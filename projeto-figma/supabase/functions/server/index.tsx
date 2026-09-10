import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BASE = "/make-server-9a5ffd57";

app.get(`${BASE}/health`, (c) => c.json({ status: "ok" }));

// ============================================================
// Prompt do analista de cibersegurança (Chain of Thought)
// ============================================================
const SYSTEM_PROMPT = `Você é um analista de cibersegurança especializado em detecção de golpes brasileiros (phishing, falsa central, WhatsApp clonado, PIX urgente, falso prêmio, boleto falso, typosquatting).

REGRAS OBRIGATÓRIAS:
1. Use raciocínio em 4 etapas (Chain of Thought):
   (1) Desconstrução: identifique links, telefones, marcas mencionadas.
   (2) Verificação de contexto: urgência, pedido de dados, impersonação.
   (3) Ponderação por evidências: RISCO COMEÇA EM 0%. Só sobe com evidências explícitas.
   (4) Veredito: Seguro (<10%), Suspeito (10-49%), Golpe (>=50%).
2. "Caminho Feliz" substitui "Risco Baixo/Mínimo".
3. Parâmetros UTM/gads/fbclid/gclid em URLs são NORMAIS (marketing). NÃO os trate como ofuscação.
4. Links de e-commerce conhecido (Amazon, Shopee, Mercado Livre, Magalu, Americanas, Shein, etc.) com apenas parâmetros de marketing → Caminho Feliz, sem tags contraditórias.
5. NÃO atribua tags como "WhatsApp Clonado" a um link de e-commerce — a tag deve corresponder à categoria do link.
6. Responda SEMPRE em JSON válido no formato:
{
  "veredito": "Seguro" | "Suspeito" | "Golpe",
  "nivelRiscoPercent": <0-100>,
  "porQue": "<motivo curto>",
  "oQueFazer": "<recomendação curta>",
  "etapas": [{"titulo": "1. Desconstrução", "observacoes": ["..."]}, ...]
}`;

async function callOpenAI(content: string, images: string[]): Promise<any | null> {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) return null;
  try {
    const userContent: any[] = [{ type: "text", text: content }];
    for (const img of images) userContent.push({ type: "image_url", image_url: { url: img } });
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.1,
      }),
    });
    if (!resp.ok) {
      console.log("OpenAI error", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.log("OpenAI exception", err);
    return null;
  }
}

async function callGemini(content: string, images: string[]): Promise<any | null> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return null;
  try {
    const parts: any[] = [{ text: content }];
    for (const img of images) {
      const match = img.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (match) parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
    }
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
        }),
      },
    );
    if (!resp.ok) {
      console.log("Gemini error", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.log("Gemini exception", err);
    return null;
  }
}

function mergeVerdicts(a: any, b: any): any {
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;
  // Veredito mais cauteloso vence
  const rank: Record<string, number> = { Seguro: 0, Suspeito: 1, Golpe: 2 };
  const winner = (rank[a.veredito] ?? 0) >= (rank[b.veredito] ?? 0) ? a : b;
  return {
    veredito: winner.veredito,
    nivelRiscoPercent: Math.max(a.nivelRiscoPercent ?? 0, b.nivelRiscoPercent ?? 0),
    porQue: winner.porQue,
    oQueFazer: winner.oQueFazer,
    etapas: [
      ...(a.etapas || []).map((e: any) => ({ ...e, titulo: `[OpenAI] ${e.titulo}` })),
      ...(b.etapas || []).map((e: any) => ({ ...e, titulo: `[Gemini] ${e.titulo}` })),
    ],
    consenso: a.veredito === b.veredito,
    fontes: ["openai/gpt-4o", "google/gemini-1.5-pro"],
  };
}

// ============================================================
// POST /analyze — chama GPT-4o e Gemini Pro em paralelo
// ============================================================
app.post(`${BASE}/analyze`, async (c) => {
  try {
    const body = await c.req.json();
    const content: string = body.content || "";
    const images: string[] = Array.isArray(body.images) ? body.images.slice(0, 4) : [];

    // Consulta de aprendizado: já temos feedback sobre conteúdo idêntico?
    const learnedKey = `learned:${await sha1(content)}`;
    const learned = await kv.get(learnedKey).catch(() => null);

    const [openai, gemini] = await Promise.all([callOpenAI(content, images), callGemini(content, images)]);
    let merged = mergeVerdicts(openai, gemini);

    if (!merged) {
      return c.json({ error: "Nenhum provedor de IA respondeu (chaves não configuradas ou indisponíveis). Use fallback local." }, 503);
    }

    // Aplica correção de aprendizado contínuo
    if (learned?.correctedVerdict) {
      merged.etapas = [
        ...(merged.etapas || []),
        {
          titulo: "5. Aprendizado Contínuo",
          observacoes: [`Veredito ajustado com base em ${learned.feedbackCount} feedbacks anteriores: ${learned.correctedVerdict}`],
        },
      ];
      merged.veredito = learned.correctedVerdict;
      merged.nivelRiscoPercent = learned.correctedRisk ?? merged.nivelRiscoPercent;
    }

    // Salva análise no histórico de treinamento
    const id = crypto.randomUUID();
    await kv.set(`analysis:${id}`, {
      id,
      content,
      hasImages: images.length > 0,
      result: merged,
      timestamp: new Date().toISOString(),
      provider: openai && gemini ? "both" : openai ? "openai" : "gemini",
    });

    return c.json({ id, ...merged });
  } catch (err) {
    console.log("analyze exception", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ============================================================
// POST /feedback — usuário reporta falso positivo/negativo
// ============================================================
app.post(`${BASE}/feedback`, async (c) => {
  try {
    const body = await c.req.json();
    const { analysisId, isCorrect, correctedVerdict, comment } = body;
    if (!analysisId) return c.json({ error: "analysisId obrigatório" }, 400);

    const analysis = await kv.get(`analysis:${analysisId}`);
    if (!analysis) return c.json({ error: "análise não encontrada" }, 404);

    const feedbackId = crypto.randomUUID();
    await kv.set(`feedback:${feedbackId}`, {
      id: feedbackId,
      analysisId,
      isCorrect,
      correctedVerdict,
      comment,
      content: analysis.content,
      originalVerdict: analysis.result.veredito,
      timestamp: new Date().toISOString(),
    });

    // Atualiza modelo de aprendizado por hash de conteúdo
    if (!isCorrect && correctedVerdict) {
      const learnedKey = `learned:${await sha1(analysis.content)}`;
      const prev = (await kv.get(learnedKey).catch(() => null)) || { feedbackCount: 0 };
      await kv.set(learnedKey, {
        correctedVerdict,
        correctedRisk: correctedVerdict === "Golpe" ? 80 : correctedVerdict === "Suspeito" ? 30 : 0,
        feedbackCount: (prev.feedbackCount || 0) + 1,
        lastUpdated: new Date().toISOString(),
      });

      // Sinaliza padrão global para futuras análises
      await kv.set(`pattern:${feedbackId}`, {
        content: analysis.content,
        correctedVerdict,
        learnedAt: new Date().toISOString(),
      });
    }

    return c.json({ ok: true, feedbackId });
  } catch (err) {
    console.log("feedback exception", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ============================================================
// GET /stats — visão da evolução do modelo
// ============================================================
app.get(`${BASE}/stats`, async (c) => {
  try {
    const analyses = await kv.getByPrefix("analysis:");
    const feedbacks = await kv.getByPrefix("feedback:");
    const patterns = await kv.getByPrefix("pattern:");
    const corrections = feedbacks.filter((f: any) => !f.isCorrect);
    return c.json({
      totalAnalyses: analyses.length,
      totalFeedbacks: feedbacks.length,
      totalCorrections: corrections.length,
      learnedPatterns: patterns.length,
      accuracy: feedbacks.length > 0 ? (feedbacks.length - corrections.length) / feedbacks.length : null,
    });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

async function sha1(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(app.fetch);
