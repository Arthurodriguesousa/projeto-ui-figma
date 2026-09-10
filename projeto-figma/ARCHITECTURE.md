# Arquitetura do Sistema — App de Detecção e Prevenção de Golpes

## 1. Visão geral

O aplicativo é um cliente React + Tailwind cuja inteligência de análise de fraudes (links, textos e imagens) **não é executada localmente em produção**. Toda a decisão de risco — veredito, motivo, recomendação, detecção de phishing, OCR e análise de imagens — é delegada a uma **API externa de Large Language Model (LLM)** de mercado. O módulo `scamAnalyzer.ts` atual funciona como **camada de fallback offline** e como **pré-processador** (extração de URLs, telefones, validação de entrada, separação contexto/link) antes da chamada remota.

```
┌──────────────┐   1.envia texto/print   ┌──────────────────────┐
│  React UI    │ ──────────────────────▶ │  Gateway de IA       │
│  (Home.tsx)  │                          │  (backend próprio)   │
└──────────────┘                          └──────────┬───────────┘
       ▲                                             │
       │  4. veredito + motivo                       │ 2. requisição
       │     + recomendação                          │    multimodal
       │                                             ▼
       │                          ┌──────────────────────────────────┐
       │                          │  LLM externo (OpenAI GPT-4o /    │
       └──────────────────────────│  Anthropic Claude 3.5 Sonnet)    │
            3. resposta JSON      │  • Análise textual               │
                                  │  • OCR e visão                   │
                                  │  • Avaliação de URL              │
                                  └──────────────────────────────────┘
```

## 2. Integração via API (LLM externo)

### Provedores previstos

- **OpenAI GPT-4o** — endpoint `POST /v1/chat/completions` com `model: "gpt-4o"`.
- **Anthropic Claude 3.5 Sonnet / 4.x** — endpoint `POST /v1/messages` com `model: "claude-3-5-sonnet-latest"` ou superior.

A camada de aplicação **não chama a LLM diretamente do navegador**. Toda requisição passa por um **backend intermediário** (gateway de IA) responsável por:

1. Anexar a chave de API a partir de variável de ambiente segura (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`).
2. Injetar o **system prompt** especializado em cibersegurança (engenharia social, phishing, falsa central, typosquatting etc.).
3. Aplicar rate-limit por usuário autenticado.
4. Sanitizar a resposta para o formato canônico `AnalysisResult`.

### Contrato de chamada

```http
POST /api/analyze
Content-Type: application/json
Authorization: Bearer <token-do-usuário>

{
  "content": "texto enviado pelo usuário",
  "images": ["data:image/png;base64,..."],   // opcional
  "locale": "pt-BR"
}
```

Resposta canônica (mantém compatibilidade com `AnalysisResult` do front):

```json
{
  "veredito": "Suspeito",
  "riskPercent": 62,
  "riskContext": 55,
  "riskLink": 70,
  "motivo": "...",
  "recomendacao": "...",
  "scamTypes": ["phishing_bancario"],
  "threats": ["URL imita Banco do Brasil"],
  "suggestions": ["NUNCA clique em links recebidos por SMS", "..."],
  "urlReports": [ { /* relatório técnico em 10 seções */ } ]
}
```

## 3. Processamento multimodal (texto + imagens)

A API recebe `images[]` em **base64** e o LLM realiza:

- **OCR**: extração nativa de texto de prints de WhatsApp, SMS, e-mails e boletos. Não é necessária biblioteca dedicada de OCR — os modelos multimodais (GPT-4o, Claude 3.5+) leem a imagem diretamente.
- **Análise visual**: identificação de logos falsificados, layouts que imitam apps bancários, QR Codes maliciosos, prints de redes sociais com perfis fake.
- **Cross-check texto + imagem**: o conteúdo extraído da imagem é unido ao texto da mensagem na mesma janela de contexto, mas (conforme regra de posição-invariância) os **links são separados do contexto** antes da análise final.

Limite recomendado: até **4 imagens por requisição**, máximo de **10 MB cada**, formatos `image/png`, `image/jpeg`, `image/webp`.

## 4. Latência e UX de carregamento

Toda chamada à LLM é **assíncrona**. O front trata a operação como uma Promise e exibe um estado de carregamento explícito:

- Botão "VERIFICAR COM IA" entra em estado `analyzing = true`.
- Spinner + texto contextual:
  - Sem imagens: `"Analisando com IA..."`.
  - Com imagens: `"Analisando imagens e links..."`.
- O botão é desabilitado durante a chamada para evitar duplo envio.
- Tempo médio esperado: **2–8 segundos** (texto puro) e **5–15 segundos** (com imagens).
- Timeout do client: **30 segundos**; após isso o usuário recebe toast de erro e pode tentar novamente.

```tsx
// src/app/components/Home.tsx (fluxo atual)
setAnalyzing(true);
try {
  const result = await analyzeContent(fullContent);   // hoje: local; futuro: fetch /api/analyze
  setResult(result);
} catch (err) {
  toast.error("Não foi possível conectar à IA. Tente novamente.");
} finally {
  setAnalyzing(false);
}
```

## 5. Segurança e privacidade

- **Chaves de API ficam apenas no backend**, nunca embarcadas no bundle do cliente.
- **HTTPS obrigatório** em todo o caminho (cliente → gateway → provedor LLM).
- **Não armazenamos** o conteúdo enviado pelo usuário no provedor externo (usar opt-out de retenção: `OpenAI-Beta: data-residency=...` ou flag equivalente da Anthropic).
- Imagens são enviadas em base64 dentro do corpo da requisição e descartadas após a análise.
- Logs do gateway anonimizam telefones, CPFs e e-mails antes do armazenamento.

## 6. Fallback local

O módulo `src/app/utils/scamAnalyzer.ts` permanece como:

- **Camada de pré-processamento**: extração de URLs (`extractUrls`), telefones (`extractPhones`), análise técnica de domínio (`analyzeUrlDeep`), separação contexto/link e validação de entrada (`validateContent` / `OFF_TOPIC_MESSAGE`).
- **Fallback offline** quando o gateway de IA estiver indisponível — degradação para análise heurística, sinalizando ao usuário que a análise foi feita em modo limitado.

## 7. Fluxo posição-invariante

Independentemente da ordem em que link e texto aparecem na entrada do usuário:

1. `extractUrls()` separa URLs.
2. `contextoOnly` é o texto sem URLs.
3. `analyzeUrlDeep()` produz `riskLink` para cada URL.
4. A LLM (ou heurística local) avalia `contextoOnly` produzindo `riskContext`.
5. `riskPercent = min(riskContext, riskLink)` combinado com `combinedSuspicion`.

Garante que `"https://site.com Veja isso"` e `"Veja isso https://site.com"` produzam o mesmo veredito.
