import { useState, useRef } from "react";
import {
  Paperclip,
  Camera,
  Sparkles,
  AlertCircle,
  Shield,
  Link as LinkIcon,
  Phone,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  X,
  Lightbulb,
  ImagePlus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { validateContent, type AnalysisResult } from "../utils/scamAnalyzer";
import { analyzeWithAI, sendFeedback } from "../utils/aiClient";
import { saveAnalysis } from "../utils/history";
import { toast } from "sonner";

const SCAM_TYPE_LABELS: Record<string, string> = {
  phishing_bancario: "🏦 Phishing Bancário",
  whatsapp_clonado: "📱 WhatsApp Clonado",
  falso_premio: "🎁 Falso Prêmio",
  pix_urgente: "⚡ PIX Urgente",
  pix_engano: "🔄 PIX Engano / Comprovante Falso",
  emprestimo_falso: "💳 Empréstimo Fraudulento",
  impersonacao_governo: "🏛️ Impersonação Gov.",
  renda_extra: "💰 Renda Extra Falsa",
  investimento_fraudulento: "📈 Investimento Fraudulento",
  boleto_falso: "📄 Boleto Falso",
  roubo_dados: "🔐 Roubo de Dados",
  multa_falsa: "🚗 Multa Falsa",
  motoboy_cartao: "🏍️ Golpe do Motoboy",
  falso_sequestro: "😨 Falso Sequestro",
  golpe_namorado_online: "💔 Golpe do Amor / Romance",
  corrente_viral: "⛓️ Corrente Viral / Promoção Falsa",
  falso_suporte_tecnico: "🖥️ Falso Suporte Técnico",
  heranca_falsa: "🏛️ Herança Falsa",
  falso_funcionario_banco: "🕵️ Falso Funcionário do Banco",
  entrega_falsa: "📦 Entrega / Correios Falso",
  falsa_vaga: "💼 Falsa Vaga de Emprego",
  golpe_acidente_emocional: "🚗 Golpe do Acidente Emocional",
  falso_inss: "🏛️ Falso INSS / Gov.br",
  falso_medico_hospital: "🏥 Falso Médico / Hospital",
  golpe_qr_code: "📷 Golpe do QR Code",
  voz_clonada_ia: "🎙️ Voz Clonada por IA",
  roubo_conta_whatsapp: "📱 Roubo de Conta WhatsApp",
  falso_advogado: "⚖️ Falso Advogado / Processo",
  pix_agendado_falso: "🔄 PIX Agendado / Comprovante Falso",
  central_bancaria_falsa: "🏦 Falsa Central Bancária",
  avaliacao_produto_falsa: "📦 Tarefa Falsa / Pirâmide",
  notificacao_legitima: "✅ Notificação Legítima",
  generico: "⚠️ Suspeito",
};

const HIGHLIGHT_TAG_CONFIG: Record<string, { label: string; color: string }> =
  {
    urgencia: {
      label: "🚨 Urgência",
      color: "bg-red-100 text-red-800 border-red-300",
    },
    pedido_dinheiro: {
      label: "💸 Pedido de dinheiro",
      color: "bg-orange-100 text-orange-800 border-orange-300",
    },
    link_suspeito: {
      label: "🔗 Link suspeito",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    pedido_senha: {
      label: "🔐 Pedido de senha/código",
      color: "bg-purple-100 text-purple-900 border-purple-300",
    },
    manipulacao_emocional: {
      label: "😨 Manipulação emocional",
      color: "bg-pink-100 text-pink-900 border-pink-300",
    },
    compartilhamento_forcado: {
      label: "⛓️ Compartilhamento forçado",
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    taxa_antecipada: {
      label: "💳 Taxa antecipada",
      color: "bg-rose-100 text-rose-900 border-rose-300",
    },
    identidade_falsa: {
      label: "🕵️ Identidade falsa",
      color: "bg-indigo-100 text-indigo-900 border-indigo-300",
    },
  };

const RISK_LEVEL_CONFIG = {
  critico: {
    label: "CRÍTICO",
    color: "bg-red-700 text-white",
    icon: ShieldAlert,
    border: "border-red-700",
  },
  alto: {
    label: "ALTO",
    color: "bg-orange-700 text-white",
    icon: AlertTriangle,
    border: "border-orange-700",
  },
  medio: {
    label: "MÉDIO",
    color: "bg-yellow-700 text-white",
    icon: AlertCircle,
    border: "border-yellow-700",
  },
  "caminho-feliz": {
    label: "RISCO BAIXO",
    color: "bg-green-800 text-white",
    icon: CheckCircle,
    border: "border-green-800",
  },
};

export function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<
    | (AnalysisResult & { aiId?: string; aiSources?: string[]; aiConsenso?: boolean })
    | null
  >(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showInfoCard, setShowInfoCard] = useState(true);

  const safeResult = result
    ? {
        ...result,
        scamTypes: result.scamTypes || [],
        suggestions: result.suggestions || [],
        threats: result.threats || [],
        signals: result.signals || [],
        acoes: result.acoes || [],
        clarifyingQuestions: result.clarifyingQuestions || [],
        riskLevel: result.riskLevel || "caminho-feliz",
        detectedUrls: result.detectedUrls || [],
        highlightTags: result.highlightTags || [],
      }
    : null;

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    if (newFiles.length === 0) {
      toast.error("Apenas imagens até 10MB são permitidas");
      return;
    }
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result)
          setUploadedImages((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${newFiles.length} imagem(ns) anexada(s) com sucesso`);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateOCR = (imageData: string): string => {
    const texts = [
      "Clique no link https://bit.ly/premio123 para receber seu prêmio de R$ 10.000",
      "Sua conta será bloqueada. Acesse urgente www.itau-seguro.tk e regularize",
      "PIX de R$ 5.000 aprovado. Confirme seus dados pelo link: cutt.ly/banco456",
      "Oi, troquei de número. Me ajuda com um PIX urgente? (11) 98765-4321",
      "Empréstimo de R$ 50.000 pré-aprovado! Pague taxa de liberação de R$ 299",
      "Seu CPF está irregular na Receita Federal. Regularize em www.receita-gov.xyz",
      "Parabéns! Você ganhou um iPhone. Acesse: premio.ml/iphone e resgate agora",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleVerify = async () => {
    if (!content.trim() && attachedFiles.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    let fullContent = content;
    if (uploadedImages.length > 0) {
      await new Promise((r) => setTimeout(r, 800));
      fullContent +=
        "\n\n[Texto extraído de imagens]:\n" +
        uploadedImages.map(simulateOCR).join("\n");
    }
    if (uploadedImages.length === 0) {
      const validation = validateContent(fullContent);
      if (validation.status === "invalido") {
        toast.error(validation.mensagem, {
          description: "Envie uma mensagem, link, cobrança ou relato de golpe para análise.",
        });
        setAnalyzing(false);
        return;
      }
    }
    const analysis = await analyzeWithAI(fullContent, uploadedImages);
    setResult(analysis);
    setFeedbackSent(false);
    setAnalyzing(false);
    saveAnalysis({
      content:
        content.trim() ||
        (attachedFiles.length > 0
          ? `${attachedFiles.length} imagem(ns) anexada(s)`
          : fullContent.slice(0, 120)),
      veredito: analysis.veredito,
      riskPercent: analysis.riskPercent,
      riskLevel: analysis.riskLevel || "caminho-feliz",
      motivo: analysis.motivo,
      hasImages: uploadedImages.length > 0,
      acoes: analysis.acoes || [],
      scamTypes: analysis.scamTypes || [],
      highlightTags: analysis.highlightTags || [],
      suggestions: analysis.suggestions || [],
      threats: analysis.threats || [],
    });
  };

  const handleFeedback = async (isCorrect: boolean) => {
    if (!result?.aiId || feedbackSent) return;
    const ok = await sendFeedback({
      analysisId: result.aiId,
      isCorrect,
      correctedVerdict: isCorrect
        ? result.veredito
        : result.veredito === "Seguro" || result.veredito === "Risco baixo identificado"
          ? "Golpe Confirmado"
          : "Risco baixo identificado",
    });
    if (ok) {
      setFeedbackSent(true);
      toast.success(
        isCorrect
          ? "Obrigado! Seu feedback ajuda a IA a evoluir."
          : "Feedback registrado. O modelo será ajustado em análises futuras."
      );
    } else {
      toast.error("Não foi possível enviar o feedback.");
    }
  };

  return (
    <div className="min-h-full bg-background px-5 py-8">
      <div className="max-w-[430px] mx-auto space-y-6">

        {/* ── Cabeçalho ─────────────────────────────── */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1E3A5F" }}
              aria-hidden="true"
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-foreground" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3 }}>
              Verificar Golpe
            </h1>
          </div>
          <p
            className="pl-[52px]"
            style={{ color: "#374151", fontSize: 16, lineHeight: 1.5 }}
          >
            Análise de links, mensagens ou conteúdo suspeito
          </p>
        </header>

        {/* ── Card informativo ──────────────────────── */}
        {showInfoCard && (
          <div
            className="relative rounded-2xl p-5"
            style={{
              backgroundColor: "#EEF4FF",
              border: "2px solid #93C5FD",
            }}
            role="region"
            aria-label="Como funciona"
          >
            {/* Botão fechar — 48×48px touch target */}
            <button
              onClick={() => setShowInfoCard(false)}
              className="absolute top-2 right-2 flex items-center justify-center rounded-xl transition-colors"
              style={{
                width: 48,
                height: 48,
                color: "#1E3A5F",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#BFDBFE")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              aria-label="Fechar dica"
            >
              <X style={{ width: 22, height: 22 }} strokeWidth={2.5} />
            </button>

            <div className="flex items-start gap-3 pr-10">
              <Lightbulb
                className="flex-shrink-0 mt-0.5"
                style={{ width: 24, height: 24, color: "#1E3A5F" }}
                aria-hidden="true"
              />
              <div>
                <p
                  className="mb-1"
                  style={{ color: "#1E3A5F", fontSize: 16, fontWeight: 700 }}
                >
                  Entenda como funciona
                </p>
                <p style={{ color: "#1E3A5F", fontSize: 15, lineHeight: 1.6 }}>
                  Nossa Inteligência Artificial analisa links suspeitos, imagens
                  e históricos de conversas procurando por padrões de golpes
                  conhecidos. Após o processamento rápido, exibimos o nível de
                  risco para que você navegue com total segurança.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Área de entrada ───────────────────────── */}
        <section aria-labelledby="input-label">
          <label
            id="input-label"
            htmlFor="scam-input"
            style={{
              display: "block",
              color: "#111827",
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Cole o conteúdo suspeito abaixo
          </label>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "2.5px solid #2D4A6E",
              backgroundColor: "#F0F4F8",
              boxShadow: "0 2px 8px rgba(30,58,95,0.08)",
            }}
          >
            <textarea
              id="scam-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cole aqui um link, texto de mensagem ou descreva o que recebeu..."
              aria-describedby="input-hint"
              className="w-full resize-none outline-none transition-colors"
              style={{
                minHeight: 160,
                padding: "16px 16px 12px",
                backgroundColor: "transparent",
                color: "#111827",
                fontSize: 16,
                lineHeight: 1.6,
              }}
              onFocus={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.borderColor = "#1E4ED8";
                (e.currentTarget.parentElement as HTMLElement).style.boxShadow =
                  "0 0 0 3px rgba(30,78,216,0.25)";
              }}
              onBlur={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.borderColor = "#2D4A6E";
                (e.currentTarget.parentElement as HTMLElement).style.boxShadow =
                  "0 2px 8px rgba(30,58,95,0.08)";
              }}
            />

            {/* Pré-visualização de imagens */}
            {uploadedImages.length > 0 && (
              <div
                className="grid grid-cols-3 gap-3 px-4 pb-4"
                role="list"
                aria-label="Imagens anexadas"
              >
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative" role="listitem">
                    <img
                      src={img}
                      alt={`Imagem anexada ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-xl"
                      style={{ border: "2px solid #2D4A6E" }}
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#B91C1C" }}
                      aria-label={`Remover imagem ${idx + 1}`}
                    >
                      <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Barra de ações do input */}
            <div
              className="flex items-center gap-2 px-3 pb-3"
              style={{ borderTop: "1.5px solid #C4D4E8" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileAttach}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl transition-colors"
                style={{
                  minWidth: 48,
                  minHeight: 48,
                  padding: "0 14px",
                  color: "#1E3A5F",
                  fontSize: 15,
                  fontWeight: 500,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#DBEAFE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label="Anexar imagem"
              >
                <Paperclip style={{ width: 20, height: 20 }} aria-hidden="true" />
                <span>Anexar</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl transition-colors"
                style={{
                  minWidth: 48,
                  minHeight: 48,
                  padding: "0 14px",
                  color: "#1E3A5F",
                  fontSize: 15,
                  fontWeight: 500,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#DBEAFE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label="Tirar foto"
              >
                <Camera style={{ width: 20, height: 20 }} aria-hidden="true" />
                <span>Foto</span>
              </button>
            </div>
          </div>

          <p
            id="input-hint"
            style={{ color: "#374151", fontSize: 14, marginTop: 6 }}
          >
            Aceita links, mensagens de texto ou imagens (até 10 MB cada)
          </p>
        </section>

        {/* ── Botão principal ───────────────────────── */}
        <div>
          <button
            onClick={handleVerify}
            disabled={(!content.trim() && attachedFiles.length === 0) || analyzing}
            className="w-full flex items-center justify-center gap-3 rounded-2xl transition-all"
            style={{
              height: 60,
              backgroundColor:
                (!content.trim() && attachedFiles.length === 0) || analyzing
                  ? "#9CA3AF"
                  : "#1E3A5F",
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.03em",
              boxShadow:
                (!content.trim() && attachedFiles.length === 0) || analyzing
                  ? "none"
                  : "0 4px 14px rgba(30,58,95,0.35)",
              cursor:
                (!content.trim() && attachedFiles.length === 0) || analyzing
                  ? "not-allowed"
                  : "pointer",
            }}
            aria-busy={analyzing}
            aria-describedby={(!content.trim() && attachedFiles.length === 0) && !analyzing ? "verify-button-hint" : undefined}
          >
            {analyzing ? (
              <>
                <div
                  className="border-2 border-white border-t-transparent rounded-full animate-spin"
                  style={{ width: 22, height: 22 }}
                  aria-hidden="true"
                />
                {uploadedImages.length > 0
                  ? "Analisando imagens e links..."
                  : "Analisando com IA..."}
              </>
            ) : (
              <>
                <Sparkles style={{ width: 22, height: 22 }} aria-hidden="true" />
                VERIFICAR COM IA
              </>
            )}
          </button>

          {(!content.trim() && attachedFiles.length === 0) && !analyzing && (
            <p
              id="verify-button-hint"
              className="text-center"
              style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}
            >
              Insira um link, mensagem ou imagem para continuar.
            </p>
          )}
        </div>

        {/* ── Resultado da análise ──────────────────── */}
        {safeResult &&
          (() => {
            const v = safeResult.veredito;
            const isSeguro = v === "Seguro";
            const isSuspeito = v === "Suspeito";
            const isAltoRisco = v === "Alto Risco";

            // Adaptar veredito para linguagem mais cautelosa
            const displayVeredito = isSeguro ? "Risco baixo identificado" : v;

            const blockBg = isSeguro
              ? { bg: "#F0FDF4", border: "#166534", text: "#14532D" }
              : isSuspeito
                ? { bg: "#FEFCE8", border: "#92400E", text: "#78350F" }
                : isAltoRisco
                  ? { bg: "#FFF7ED", border: "#C2410C", text: "#9A3412" }
                  : { bg: "#FEF2F2", border: "#B91C1C", text: "#7F1D1D" };

            const VeredIcon = isSeguro
              ? Shield
              : isSuspeito
                ? AlertCircle
                : isAltoRisco
                  ? AlertTriangle
                  : ShieldAlert;

            return (
              <div className="space-y-4" role="region" aria-label="Resultado da análise">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: `2.5px solid ${blockBg.border}`,
                    backgroundColor: blockBg.bg,
                  }}
                >
                  <div className="p-6" style={{ color: blockBg.text }}>

                    {/* Cabeçalho do veredito */}
                    <div className="flex items-start gap-3 mb-5">
                      <VeredIcon
                        style={{ width: 32, height: 32, flexShrink: 0, marginTop: 2 }}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                          {displayVeredito}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="rounded-full px-3 py-0.5"
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              ...(() => {
                                const cfg = RISK_LEVEL_CONFIG[safeResult.riskLevel];
                                return cfg
                                  ? { backgroundColor: blockBg.border, color: "#FFFFFF" }
                                  : {};
                              })(),
                            }}
                          >
                            {RISK_LEVEL_CONFIG[safeResult.riskLevel]?.label}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>
                            {safeResult.riskPercent}% de risco
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Highlight tags - ocultar "link_suspeito" se for risco baixo */}
                    {safeResult.highlightTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4" aria-label="Sinais detectados">
                        {safeResult.highlightTags
                          .filter((tag) => {
                            // Se risco baixo, não mostrar "link_suspeito" - mostrar tag neutra
                            if (isSeguro && tag === "link_suspeito") return false;
                            return true;
                          })
                          .map((tag) => {
                            const cfg = HIGHLIGHT_TAG_CONFIG[tag];
                            if (!cfg) return null;
                            return (
                              <span
                                key={tag}
                                className={`rounded-full border px-3 py-1 font-semibold ${cfg.color}`}
                                style={{ fontSize: 13, overflowWrap: "break-word" }}
                              >
                                {cfg.label}
                              </span>
                            );
                          })}
                        {/* Tag alternativa para risco baixo com link */}
                        {isSeguro && safeResult.details.hasUrl && (
                          <span
                            className="rounded-full border px-3 py-1 font-semibold"
                            style={{
                              fontSize: 13,
                              backgroundColor: "#DBEAFE",
                              color: "#1E3A5F",
                              borderColor: "#93C5FD",
                              overflowWrap: "break-word",
                            }}
                          >
                            🔗 Link analisado
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tipos de golpe */}
                    {safeResult.scamTypes.filter((t) => t !== "generico").length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {safeResult.scamTypes
                          .filter((t) => t !== "generico")
                          .map((type) => (
                            <span
                              key={type}
                              className="rounded-lg px-3 py-1"
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                backgroundColor: "rgba(255,255,255,0.6)",
                                color: blockBg.text,
                              }}
                            >
                              {SCAM_TYPE_LABELS[type]}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Análise */}
                    <div
                      className="rounded-xl p-4 mb-4"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.65)",
                        border: `1.5px solid ${blockBg.border}40`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 8,
                          opacity: 0.7,
                        }}
                      >
                        Análise
                      </p>
                      <p style={{ fontSize: 15, lineHeight: 1.65, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                        {isSeguro
                          ? safeResult.motivo + " Nenhum indício forte de golpe foi encontrado, mas confirme sempre pelo canal oficial."
                          : safeResult.motivo}
                      </p>
                    </div>

                    {/* O que fazer agora */}
                    {safeResult.acoes.length > 0 && (
                      <div
                        className="rounded-xl p-4 mb-4"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.65)",
                          border: `1.5px solid ${blockBg.border}40`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                            opacity: 0.7,
                          }}
                        >
                          O que fazer agora
                        </p>
                        <ul className="space-y-2">
                          {safeResult.acoes.map((acao, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2"
                              style={{ fontSize: 15, lineHeight: 1.55 }}
                            >
                              <span style={{ flexShrink: 0, marginTop: 2, fontWeight: 700 }}>
                                ▸
                              </span>
                              <span>{acao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recomendações */}
                    {!safeResult.safe && safeResult.suggestions.length > 0 && (
                      <div
                        className="rounded-xl p-4 mb-4"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.65)",
                          border: `1.5px solid ${blockBg.border}40`,
                        }}
                      >
                        <p
                          className="flex items-center gap-1.5"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                            opacity: 0.7,
                          }}
                        >
                          <Shield style={{ width: 13, height: 13 }} aria-hidden="true" />
                          Recomendações gerais para esse tipo de golpe
                        </p>
                        <ul className="space-y-1.5">
                          {safeResult.suggestions.map((s, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2"
                              style={{ fontSize: 15, lineHeight: 1.55 }}
                            >
                              <span style={{ flexShrink: 0, opacity: 0.6 }}>•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detalhes técnicos */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {safeResult.details.hasUrl && (
                        <div
                          className="flex items-center gap-2 rounded-xl px-3"
                          style={{
                            height: 44,
                            backgroundColor: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <LinkIcon style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            Link detectado
                          </span>
                        </div>
                      )}
                      {safeResult.details.hasSuspiciousPhone && (
                        <div
                          className="flex items-center gap-2 rounded-xl px-3"
                          style={{
                            height: 44,
                            backgroundColor: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <Phone style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            Tel. suspeito
                          </span>
                        </div>
                      )}
                      {safeResult.details.hasScamKeywords && (
                        <div
                          className="flex items-center gap-2 rounded-xl px-3"
                          style={{
                            height: 44,
                            backgroundColor: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            Termos de golpe
                          </span>
                        </div>
                      )}
                      {safeResult.details.hasUrgencyWords && (
                        <div
                          className="flex items-center gap-2 rounded-xl px-3"
                          style={{
                            height: 44,
                            backgroundColor: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            Urgência
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Feedback de IA */}
                    {safeResult.aiId && (
                      <div
                        className="rounded-xl p-4 mb-4"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.65)",
                          border: `1.5px solid ${blockBg.border}40`,
                        }}
                      >
                        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                          A análise foi útil?
                        </p>
                        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 12 }}>
                          Seu feedback alimenta o aprendizado contínuo do modelo.
                        </p>
                        {feedbackSent ? (
                          <p style={{ fontSize: 14, opacity: 0.8 }}>
                            ✓ Feedback registrado
                          </p>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleFeedback(true)}
                              className="rounded-xl border-2 transition-colors"
                              style={{
                                height: 48,
                                padding: "0 20px",
                                fontSize: 15,
                                fontWeight: 600,
                                borderColor: blockBg.border,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                color: blockBg.text,
                              }}
                            >
                              👍 Acertou
                            </button>
                            <button
                              onClick={() => handleFeedback(false)}
                              className="rounded-xl border-2 transition-colors"
                              style={{
                                height: 48,
                                padding: "0 20px",
                                fontSize: 15,
                                fontWeight: 600,
                                borderColor: blockBg.border,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                color: blockBg.text,
                              }}
                            >
                              👎 Errou
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-3">
                      {!safeResult.safe && (
                        <button
                          onClick={() => navigate("/chat")}
                          className="flex-1 rounded-xl border-2 transition-colors"
                          style={{
                            height: 56,
                            fontSize: 15,
                            fontWeight: 700,
                            borderColor: blockBg.border,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            color: blockBg.text,
                          }}
                        >
                          💬 Falar com analista
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setContent("");
                          setResult(null);
                          setAttachedFiles([]);
                          setUploadedImages([]);
                        }}
                        className="flex-1 rounded-xl border-2 transition-colors"
                        style={{
                          height: 56,
                          fontSize: 15,
                          fontWeight: 700,
                          borderColor: blockBg.border,
                          backgroundColor: "rgba(255,255,255,0.8)",
                          color: blockBg.text,
                        }}
                      >
                        🔄 Nova Verificação
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* ── O que você pode verificar ─────────────── */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "#EEF4FF",
            border: "2px solid #BFDBFE",
          }}
        >
          <h3
            style={{
              color: "#1E3A5F",
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            💡 O que você pode verificar:
          </h3>
          <ul className="space-y-3">
            {[
              { icon: "🔗", text: "Links suspeitos (SMS, WhatsApp, e-mail)" },
              { icon: "📱", text: "Prints de conversas ou mensagens" },
              { icon: "📞", text: "Números de telefone desconhecidos" },
              { icon: "💰", text: "Solicitações de PIX ou transferências" },
              { icon: "📄", text: "Ofertas, promoções ou prêmios suspeitos" },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3"
                style={{ color: "#1E3A5F", fontSize: 15, lineHeight: 1.5 }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">
                  {item.icon}
                </span>
                <span style={{ fontWeight: 500 }}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
