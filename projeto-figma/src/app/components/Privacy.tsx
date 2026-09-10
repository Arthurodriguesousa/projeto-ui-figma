import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getSettings, updateSettings, changePassword } from "../utils/auth";

export function Privacy() {
  const navigate = useNavigate();
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  useEffect(() => {
    const settings = getSettings();
    setShareAnalytics(settings.shareAnalytics);
    setPublicProfile(settings.publicProfile);
    setSaveHistory(settings.saveHistory);
  }, []);

  const handleDeleteAccount = () => {
    toast.error("Conta excluída com sucesso");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handlePasswordChange = () => {
    const errors: typeof passwordErrors = {};

    if (!currentPassword) {
      errors.current = "Senha atual obrigatória";
    }
    if (!newPassword) {
      errors.new = "Nova senha obrigatória";
    } else if (newPassword.length < 8) {
      errors.new = "A senha deve ter no mínimo 8 caracteres";
    }
    if (!confirmNewPassword) {
      errors.confirm = "Confirme a nova senha";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirm = "As senhas não coincidem";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (changePassword(currentPassword, newPassword)) {
        toast.success("Senha alterada com sucesso!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordErrors({});
      } else {
        setPasswordErrors({ current: "Senha atual incorreta" });
        toast.error("Senha atual incorreta");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[430px] mx-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center gap-4 z-10">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl text-foreground">Privacidade e Segurança</h1>
        </div>

        <div className="px-6 py-8">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Seus dados são criptografados e nunca compartilhados sem sua permissão
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-4">PRIVACIDADE</h3>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">Compartilhar Análises Anônimas</h3>
                      <p className="text-sm text-muted-foreground">
                        Ajude a melhorar nossa IA compartilhando dados anonimizados
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newValue = !shareAnalytics;
                        setShareAnalytics(newValue);
                        updateSettings({ shareAnalytics: newValue });
                        toast.success(shareAnalytics ? "Compartilhamento desativado" : "Compartilhamento ativado");
                      }}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        shareAnalytics ? "bg-accent" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          shareAnalytics ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">Perfil Público</h3>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros usuários vejam seus reports
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newValue = !publicProfile;
                        setPublicProfile(newValue);
                        updateSettings({ publicProfile: newValue });
                        toast.success(publicProfile ? "Perfil privado" : "Perfil público");
                      }}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        publicProfile ? "bg-accent" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          publicProfile ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">Salvar Histórico de Análises</h3>
                      <p className="text-sm text-muted-foreground">
                        Manter registro das suas verificações anteriores
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newValue = !saveHistory;
                        setSaveHistory(newValue);
                        updateSettings({ saveHistory: newValue });
                        toast.success(saveHistory ? "Histórico desativado" : "Histórico ativado");
                      }}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        saveHistory ? "bg-accent" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          saveHistory ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-4">SEGURANÇA</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-card border border-border rounded-xl p-5 hover:bg-muted transition-colors text-left flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-1">Alterar Senha</h3>
                    <p className="text-sm text-muted-foreground">Redefina sua senha de acesso</p>
                  </div>
                </button>

                <button className="w-full bg-card border border-border rounded-xl p-5 hover:bg-muted transition-colors text-left flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-1">Autenticação em Dois Fatores</h3>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-4">ZONA DE PERIGO</h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-destructive/10 border-2 border-destructive/30 rounded-xl p-5 hover:bg-destructive/20 transition-colors text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-destructive mb-1">Excluir Conta</h3>
                  <p className="text-sm text-destructive/80">Esta ação é irreversível</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl text-foreground mb-4">Alterar Senha</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-2 text-sm text-foreground">Senha Atual</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors outline-none ${
                      passwordErrors.current ? "border-destructive" : "border-input focus:border-accent"
                    }`}
                  />
                </div>
                {passwordErrors.current && <p className="text-destructive text-sm mt-1">{passwordErrors.current}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm text-foreground">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full h-12 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors outline-none ${
                      passwordErrors.new ? "border-destructive" : "border-input focus:border-accent"
                    }`}
                  />
                </div>
                {passwordErrors.new && <p className="text-destructive text-sm mt-1">{passwordErrors.new}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm text-foreground">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className={`w-full h-12 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors outline-none ${
                      passwordErrors.confirm ? "border-destructive" : "border-input focus:border-accent"
                    }`}
                  />
                </div>
                {passwordErrors.confirm && <p className="text-destructive text-sm mt-1">{passwordErrors.confirm}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setPasswordErrors({});
                }}
                className="flex-1 h-12 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl text-foreground mb-2">Excluir Conta?</h2>
            <p className="text-muted-foreground mb-6">
              Todos os seus dados serão permanentemente excluídos. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-12 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
