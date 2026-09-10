import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  AlertTriangle,
  Flag,
  Share2,
  Shield,
  Heart,
  Send,
  Clock,
  User,
  X,
  Copy,
  ExternalLink,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { scamReports } from "../data/scams";
import {
  brazilianStates,
  federalAuthorities,
  stateAuthorities,
} from "../data/authorities";

type CommentItem = {
  id: number;
  author: string;
  text: string;
  time: string;
};

const initialComments: Record<number, CommentItem[]> = {
  1: [
    {
      id: 1,
      author: "Patrícia M.",
      text: "Recebi essa mesma mensagem ontem! Cuidado pessoal.",
      time: "Há 1h",
    },
    {
      id: 2,
      author: "João S.",
      text: "O link tinha um domínio estranho com .xyz, fica esperto!",
      time: "Há 45 min",
    },
  ],
};

export function ScamDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/").pop() || "";
  const report = scamReports.find((r) => String(r.id) === id);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report?.reports ?? 0);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(
    initialComments[Number(id)] ?? []
  );
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    toast.success("Comentário apagado");
  };

  const handleStartEdit = (commentId: number, currentText: string) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editingText.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, text: editingText.trim(), time: "Editado agora" }
          : c
      )
    );
    setEditingId(null);
    setEditingText("");
    toast.success("Comentário atualizado");
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-foreground mb-2">Golpe não encontrado</h2>
          <button
            onClick={() => navigate("/community")}
            className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg"
          >
            Voltar para Comunidade
          </button>
        </div>
      </div>
    );
  }

  const severityColor =
    report.severity === "Alta"
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : report.severity === "Média"
      ? "bg-orange-500/10 text-orange-600 border-orange-500/30"
      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";

  const shareText = `⚠️ Alerta de Golpe: ${report.title}\n\n${report.description}\n\nFique atento e proteja-se!`;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://safeapp.com";

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    if (!liked) toast.success("Você confirmou este alerta");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: "Você",
        text: newComment.trim(),
        time: "Agora",
      },
    ]);
    setNewComment("");
    toast.success("Comentário publicado");
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366]",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Twitter / X",
      color: "bg-black",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      color: "bg-[#0088cc]",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Instagram",
      color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
      url: "https://www.instagram.com/",
      note: "Copie o texto e cole no Instagram",
    },
    {
      name: "Email",
      color: "bg-slate-600",
      url: `mailto:?subject=${encodeURIComponent("Alerta de Golpe: " + report.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ];

  const localAuthorities = selectedState
    ? stateAuthorities[selectedState] ?? []
    : [];
  const stateName =
    brazilianStates.find((s) => s.code === selectedState)?.name || "";

  const handleStateChange = (code: string) => {
    setSelectedState(code);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success("Link e texto copiados!");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-[430px] mx-auto">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 z-10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-foreground">Detalhes do Golpe</h1>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-foreground mb-2">{report.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${severityColor}`}
                  >
                    Risco {report.severity}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {report.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {report.time}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-destructive rounded-full"></span>
                {likes} confirmações
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-3">Descrição</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {report.description}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Como se proteger
            </h3>
            <ul className="space-y-2">
              {report.tips.map((tip, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-3">Reportado por</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">{report.reporter}</p>
                <p className="text-xs text-muted-foreground">
                  Membro verificado da comunidade
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center gap-1 p-3 border rounded-xl transition-colors ${
                liked
                  ? "bg-destructive/10 border-destructive/30"
                  : "bg-card border-border hover:border-accent"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-destructive text-destructive" : "text-accent"
                }`}
              />
              <span className="text-xs text-foreground">
                {liked ? "Curtido" : "Curtir"}
              </span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("comments-section");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => commentInputRef.current?.focus(), 300);
              }}
              className="flex flex-col items-center gap-1 p-3 bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <Send className="w-5 h-5 text-accent" />
              <span className="text-xs text-foreground">Comentar</span>
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex flex-col items-center gap-1 p-3 bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <Share2 className="w-5 h-5 text-accent" />
              <span className="text-xs text-foreground">Compartilhar</span>
            </button>
          </div>

          <div id="comments-section" className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground mb-4">
              Comentários ({comments.length})
            </h3>

            <div className="flex gap-2 mb-4">
              <input
                ref={commentInputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Escreva um comentário..."
                className="flex-1 h-11 px-4 bg-input-background border border-input focus:border-accent rounded-xl outline-none transition-colors text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="w-11 h-11 bg-accent disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 text-accent-foreground rounded-xl flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Seja o primeiro a comentar
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => {
                  const isOwn = c.author === "Você";
                  const isEditing = editingId === c.id;
                  return (
                    <div
                      key={c.id}
                      className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm text-foreground truncate">
                              {c.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.time}
                            </span>
                          </div>
                          {isOwn && !isEditing && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleStartEdit(c.id, c.text)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                                title="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-destructive/10 transition-colors"
                                title="Apagar"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSaveEdit(c.id)
                              }
                              autoFocus
                              className="flex-1 h-9 px-3 bg-input-background border border-accent rounded-lg outline-none text-sm"
                            />
                            <button
                              onClick={() => handleSaveEdit(c.id)}
                              className="w-9 h-9 bg-accent text-accent-foreground rounded-lg flex items-center justify-center"
                              title="Salvar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditingText("");
                              }}
                              className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground break-words">
                            {c.text}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowReport(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 rounded-xl transition-colors"
          >
            <Flag className="w-5 h-5" />
            <span>Denunciar às autoridades</span>
          </button>
        </div>
      </div>

      {showShare && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">Compartilhar</h3>
              <button
                onClick={() => setShowShare(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {shareLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (s.note) {
                      handleCopyLink();
                      toast.info(s.note);
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-12 h-12 ${s.color} rounded-full flex items-center justify-center text-white`}
                  >
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-foreground text-center">
                    {s.name}
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copiar link e texto</span>
            </button>
          </div>
        </div>
      )}

      {showReport && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowReport(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">Denunciar às autoridades</h3>
              <button
                onClick={() => setShowReport(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Selecione seu estado para ver os canais oficiais da sua região:
            </p>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 leading-relaxed">
                Se algum link não abrir, busque o nome do órgão no Google — sites
                oficiais de governo são atualizados periodicamente e podem mudar de endereço.
              </p>
            </div>

            <div className="relative mb-4">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-input-background border border-input focus:border-accent rounded-xl outline-none transition-colors text-foreground appearance-none"
              >
                <option value="">Selecione um estado...</option>
                {brazilianStates.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            {selectedState && localAuthorities.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Canais de {stateName}
                </p>
                <div className="space-y-2 mb-4">
                  {localAuthorities.map((a) => (
                    <a
                      key={a.name}
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        toast.success("Redirecionando para o canal oficial");
                        setTimeout(() => setShowReport(false), 500);
                      }}
                      className="flex items-center justify-between gap-3 p-4 bg-background border border-border hover:border-destructive/50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {a.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.desc}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </>
            )}

            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Canais nacionais
            </p>
            <div className="space-y-2">
              {federalAuthorities.map((a) => (
                <a
                  key={a.name}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    toast.success("Redirecionando para o canal oficial");
                    setTimeout(() => setShowReport(false), 500);
                  }}
                  className="flex items-center justify-between gap-3 p-4 bg-background border border-border hover:border-destructive/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
