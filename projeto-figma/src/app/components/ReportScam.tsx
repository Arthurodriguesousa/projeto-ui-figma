import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, CheckCircle, ArrowLeft, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "PIX Falso",
  "Mensagem Suspeita",
  "Golpe Telefônico",
  "Boleto Fraudulento",
  "Link Malicioso",
  "Email Phishing",
  "Perfil Fake",
  "Outro",
];

export function ReportScam() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 10 MB");
      return;
    }

    setAttachedFile(file);
    toast.success("Evidência anexada com sucesso");
    e.target.value = "";
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !description) {
      toast.error("Preencha a categoria e a descrição para enviar", {
        description: "Esses campos são obrigatórios",
      });
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate("/community");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-2xl text-foreground mb-2">Golpe Reportado!</h2>
          <p className="text-muted-foreground">
            Obrigado por ajudar a proteger a comunidade
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-8">
      <div className="max-w-[430px] mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/community")}
            className="flex items-center gap-2 rounded-xl transition-colors mb-4"
            style={{
              minWidth: 48,
              minHeight: 48,
              padding: "0 12px",
              color: "#6B7280",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            aria-label="Voltar para Comunidade"
          >
            <ArrowLeft style={{ width: 20, height: 20 }} strokeWidth={2.5} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>Voltar</span>
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: "#111827" }}>
            Reportar Golpe
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280" }}>
            Ajude a comunidade alertando sobre golpes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="category-grid"
              className="block mb-3"
              style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}
            >
              Categoria do Golpe <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <div id="category-grid" className="grid grid-cols-2 gap-3" role="group" aria-label="Categorias de golpe">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-xl border-2 transition-all"
                    style={{
                      minHeight: 56,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: isSelected ? 700 : 500,
                      borderColor: isSelected ? "#1E3A5F" : "#D1D5DB",
                      backgroundColor: isSelected ? "#EEF4FF" : "#FFFFFF",
                      color: isSelected ? "#1E3A5F" : "#374151",
                    }}
                    aria-pressed={isSelected}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2"
              style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}
            >
              Descrição do Golpe <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o golpe em detalhes: como aconteceu, o que foi dito, como identificou..."
              required
              className="w-full resize-none rounded-xl outline-none transition-all"
              style={{
                minHeight: 140,
                padding: 16,
                fontSize: 15,
                lineHeight: 1.6,
                backgroundColor: "#F0F4F8",
                border: "2px solid #D1D5DB",
                color: "#111827",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1E3A5F";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              htmlFor="platform"
              className="block mb-2"
              style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}
            >
              Plataforma / Link / Site
            </label>
            <input
              id="platform"
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="Ex: WhatsApp, Instagram, site fraudulento..."
              className="w-full rounded-xl outline-none transition-all"
              style={{
                height: 56,
                minHeight: 56,
                padding: "0 16px",
                fontSize: 15,
                backgroundColor: "#F0F4F8",
                border: "2px solid #D1D5DB",
                color: "#111827",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1E3A5F";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Campo de evidência */}
          <div>
            <label className="block mb-2" style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}>
              Anexar Evidência <span style={{ color: "#6B7280", fontSize: 14, fontWeight: 400 }}>(opcional)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileAttach}
              className="hidden"
              aria-hidden="true"
            />

            {!attachedFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all"
                style={{
                  minHeight: 80,
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1E3A5F";
                  e.currentTarget.style.backgroundColor = "#EEF4FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }}
                aria-label="Anexar evidência"
              >
                <Paperclip style={{ width: 20, height: 20 }} strokeWidth={2} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  Clique para anexar imagem ou PDF (até 10 MB)
                </span>
              </button>
            ) : (
              <div
                className="flex items-center justify-between rounded-xl border-2"
                style={{
                  minHeight: 56,
                  padding: "0 16px",
                  borderColor: "#16A34A",
                  backgroundColor: "#F0FDF4",
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Paperclip style={{ width: 18, height: 18, color: "#16A34A", flexShrink: 0 }} strokeWidth={2} />
                  <span
                    className="truncate"
                    style={{ fontSize: 14, fontWeight: 500, color: "#166534" }}
                  >
                    {attachedFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#DCFCE7")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  aria-label="Remover evidência"
                >
                  <X style={{ width: 18, height: 18, color: "#166534" }} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          <div
            className="rounded-xl flex gap-3"
            style={{
              padding: 16,
              backgroundColor: "rgba(234,179,8,0.1)",
              border: "1.5px solid rgba(234,179,8,0.3)",
            }}
            role="alert"
          >
            <AlertTriangle
              style={{ width: 20, height: 20, color: "#CA8A04", flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            />
            <p style={{ fontSize: 14, color: "#111827", lineHeight: 1.6 }}>
              Seu reporte será analisado e compartilhado com a comunidade para prevenir que
              outras pessoas sejam vítimas do mesmo golpe.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedCategory || !description}
              className="w-full rounded-xl transition-all"
              style={{
                height: 60,
                minHeight: 60,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.03em",
                backgroundColor: !selectedCategory || !description ? "#9CA3AF" : "#1E3A5F",
                color: "#FFFFFF",
                cursor: !selectedCategory || !description ? "not-allowed" : "pointer",
                boxShadow: !selectedCategory || !description ? "none" : "0 4px 14px rgba(30,58,95,0.3)",
              }}
              aria-describedby={!selectedCategory || !description ? "submit-hint" : undefined}
            >
              ENVIAR REPORTE
            </button>

            {(!selectedCategory || !description) && (
              <p
                id="submit-hint"
                className="text-center"
                style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}
              >
                Preencha a descrição e a plataforma para enviar.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
