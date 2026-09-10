import { useState } from "react";
import { ShieldCheck, ShieldAlert, Calendar, Trash2, AlertTriangle, Image, ChevronDown, ChevronUp, Shield, X } from "lucide-react";
import { loadHistory, clearHistory, type HistoryEntry } from "../utils/history";

const SCAM_TYPE_LABELS: Record<string, string> = {
  phishing_bancario: '🏦 Phishing Bancário',
  whatsapp_clonado: '📱 WhatsApp Clonado',
  falso_premio: '🎁 Falso Prêmio',
  pix_urgente: '⚡ PIX Urgente',
  pix_engano: '🔄 PIX Engano',
  emprestimo_falso: '💳 Empréstimo Fraudulento',
  impersonacao_governo: '🏛️ Impersonação Gov.',
  renda_extra: '💰 Renda Extra Falsa',
  investimento_fraudulento: '📈 Investimento Fraudulento',
  boleto_falso: '📄 Boleto Falso',
  roubo_dados: '🔐 Roubo de Dados',
  multa_falsa: '🚗 Multa Falsa',
  motoboy_cartao: '🏍️ Golpe do Motoboy',
  falso_sequestro: '😨 Falso Sequestro',
  golpe_namorado_online: '💔 Golpe do Amor',
  corrente_viral: '⛓️ Corrente Viral',
  falso_suporte_tecnico: '🖥️ Falso Suporte Técnico',
  heranca_falsa: '🏛️ Herança Falsa',
  falso_funcionario_banco: '🕵️ Falso Funcionário do Banco',
  entrega_falsa: '📦 Entrega Falsa',
  falsa_vaga: '💼 Falsa Vaga',
  golpe_acidente_emocional: '🚗 Golpe do Acidente',
  falso_inss: '🏛️ Falso INSS',
  falso_medico_hospital: '🏥 Falso Médico',
  golpe_qr_code: '📷 QR Code Falso',
  voz_clonada_ia: '🎙️ Voz Clonada',
  roubo_conta_whatsapp: '📱 Roubo WhatsApp',
  falso_advogado: '⚖️ Falso Advogado',
  pix_agendado_falso: '🔄 PIX Agendado Falso',
  central_bancaria_falsa: '🏦 Falsa Central Bancária',
  avaliacao_produto_falsa: '📦 Tarefa Falsa / Pirâmide',
  notificacao_legitima: '✅ Notificação Legítima',
  generico: '⚠️ Suspeito'
};

const HIGHLIGHT_TAG_CONFIG: Record<string, { label: string; color: string }> = {
  urgencia:                { label: '🚨 Urgência',              color: 'bg-red-100 text-red-700 border-red-200' },
  pedido_dinheiro:         { label: '💸 Pedido de dinheiro',    color: 'bg-orange-100 text-orange-700 border-orange-200' },
  link_suspeito:           { label: '🔗 Link suspeito',         color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  pedido_senha:            { label: '🔐 Pedido de senha',       color: 'bg-purple-100 text-purple-700 border-purple-200' },
  manipulacao_emocional:   { label: '😨 Manipulação emocional', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  compartilhamento_forcado:{ label: '⛓️ Compartilhamento forçado', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  taxa_antecipada:         { label: '💳 Taxa antecipada',       color: 'bg-rose-100 text-rose-700 border-rose-200' },
  identidade_falsa:        { label: '🕵️ Identidade falsa',      color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

const RISK_COLORS: Record<string, { badge: string; icon: string; border: string; bg: string; text: string }> = {
  "caminho-feliz": { badge: "bg-success/10 text-success", icon: "text-success", border: "border-success/40", bg: "bg-success/5", text: "text-success" },
  medio:           { badge: "bg-yellow-100 text-yellow-700", icon: "text-yellow-600", border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-800" },
  alto:            { badge: "bg-orange-100 text-orange-700", icon: "text-orange-600", border: "border-orange-400", bg: "bg-orange-50", text: "text-orange-800" },
  critico:         { badge: "bg-destructive/10 text-destructive", icon: "text-destructive", border: "border-destructive/60", bg: "bg-destructive/5", text: "text-destructive" },
};

const RISK_LABELS: Record<string, string> = {
  "caminho-feliz": "Risco baixo",
  medio: "Médio",
  alto: "Alto",
  critico: "Crítico",
};

function isSafe(entry: HistoryEntry) {
  return entry.veredito === "Seguro" || entry.veredito === "Risco baixo identificado" || entry.riskLevel === "caminho-feliz";
}

function formatVeredito(veredito: string): string {
  if (veredito === "Seguro") return "Risco baixo identificado";
  return veredito;
}

function EntryDetail({ entry, onClose }: { entry: HistoryEntry; onClose: () => void }) {
  const safe = isSafe(entry);
  const c = RISK_COLORS[entry.riskLevel] ?? RISK_COLORS["caminho-feliz"];
  const scamTypes = (entry.scamTypes || []).filter(t => t !== 'generico');
  const highlightTags = entry.highlightTags || [];
  const acoes = entry.acoes || [];
  const suggestions = entry.suggestions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-background rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {safe
              ? <ShieldCheck className={`w-5 h-5 flex-shrink-0 ${c.icon}`} />
              : <ShieldAlert className={`w-5 h-5 flex-shrink-0 ${c.icon}`} />
            }
            <span className="font-semibold text-foreground" style={{ overflowWrap: "break-word" }}>
              {formatVeredito(entry.veredito)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c.badge}`}>
              {RISK_LABELS[entry.riskLevel] ?? formatVeredito(entry.veredito)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
            aria-label="Fechar detalhes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Data e risco */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{entry.date} às {entry.time}</span>
            <span className="ml-auto font-mono font-semibold">{entry.riskPercent}% risco</span>
          </div>

          {/* Conteúdo analisado */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Conteúdo analisado</h4>
            <p
              className="text-sm text-foreground leading-relaxed"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {entry.hasImages && <Image className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />}
              {entry.content || "—"}
            </p>
          </div>

          {/* Highlight tags */}
          {highlightTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {highlightTags.map((tag) => {
                const cfg = HIGHLIGHT_TAG_CONFIG[tag];
                if (!cfg) return null;
                return (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                    {cfg.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Tipos de golpe */}
          {scamTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {scamTypes.map((type) => (
                <span key={type} className="text-xs px-2 py-1 bg-muted rounded-md text-foreground/80">
                  {SCAM_TYPE_LABELS[type] || type}
                </span>
              ))}
            </div>
          )}

          {/* Motivo / Análise */}
          <div className={`rounded-xl p-4 border ${c.border} ${c.bg}`}>
            <h4 className={`text-xs font-semibold mb-1.5 uppercase tracking-wide opacity-70 ${c.text}`}>Análise da IA</h4>
            <p
              className={`text-sm leading-relaxed ${c.text}`}
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {entry.motivo}
            </p>
          </div>

          {/* Ações */}
          {acoes.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">O que fazer</h4>
              <ul className="space-y-1.5">
                {acoes.map((acao, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5 text-muted-foreground">▸</span>
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {suggestions.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Recomendações
              </h4>
              <ul className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5 text-muted-foreground">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory());
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  const colors = (entry: HistoryEntry) =>
    RISK_COLORS[entry.riskLevel] ?? RISK_COLORS["caminho-feliz"];

  return (
    <div className="min-h-full bg-background">
      {selected && (
        <EntryDetail entry={selected} onClose={() => setSelected(null)} />
      )}

      <div className="max-w-[430px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl mb-1 text-foreground">Histórico</h1>
            <p className="text-muted-foreground text-sm">
              {entries.length === 0
                ? "Nenhuma análise realizada ainda"
                : `${entries.length} análise${entries.length > 1 ? "s" : ""} salva${entries.length > 1 ? "s" : ""}`}
            </p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Faça sua primeira verificação para ver o histórico aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((item) => {
              const safe = isSafe(item);
              const c = colors(item);
              const hasDetail = (item.acoes?.length || 0) > 0 || (item.suggestions?.length || 0) > 0 || (item.scamTypes?.length || 0) > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-accent/40 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${safe ? "bg-success/10" : "bg-destructive/10"}`}>
                      {safe
                        ? <ShieldCheck className={`w-5 h-5 ${c.icon}`} />
                        : <ShieldAlert className={`w-5 h-5 ${c.icon}`} />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className="text-foreground text-sm leading-snug line-clamp-2 flex-1"
                          style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
                        >
                          {item.hasImages && (
                            <Image className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
                          )}
                          {item.content || "—"}
                        </p>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full flex-shrink-0 ${c.badge}`}>
                          {RISK_LABELS[item.riskLevel] ?? formatVeredito(item.veredito)}
                        </span>
                      </div>

                      <p
                        className="text-xs text-muted-foreground line-clamp-2 mb-2"
                        style={{ overflowWrap: "break-word" }}
                      >
                        {item.motivo}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span>{item.time}</span>
                        <span className="ml-auto flex items-center gap-1 font-mono">
                          {item.riskPercent}% risco
                          {hasDetail && <ChevronDown className="w-3 h-3 opacity-50" />}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Toque em uma análise para ver os detalhes completos</span>
          </div>
        )}
      </div>
    </div>
  );
}
