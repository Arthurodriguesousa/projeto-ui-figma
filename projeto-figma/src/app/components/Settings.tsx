import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Shield, HelpCircle, LogOut, User, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { getUserData, logout } from "../utils/auth";
import { getStoredTheme, setTheme, type Theme } from "../utils/theme";

export function Settings() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("usuario@exemplo.com");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUserName(userData.name || "Usuário");
      setUserEmail(userData.email || "usuario@exemplo.com");
    }
    setThemeState(getStoredTheme());
  }, []);

  const handleToggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
    toast.success(next === "dark" ? "Tema escuro ativado" : "Tema claro ativado");
  };

  const isDark = theme === "dark";

  const settingsGroups = [
    {
      title: "Conta",
      items: [
        { icon: User, label: "Perfil", badge: null, path: "/profile" },
      ],
    },
    {
      title: "Segurança",
      items: [
        { icon: Shield, label: "Privacidade e Segurança", badge: null, path: "/privacy" },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: HelpCircle, label: "Central de Ajuda", badge: null, path: "/help" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    setTimeout(() => navigate("/login"), 500);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-[430px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl mb-2 text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-foreground mb-1">{userName}</h3>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-muted-foreground mb-3 px-2">Aparência</h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={handleToggleTheme}
                role="switch"
                aria-checked={isDark}
                aria-label={`Tema escuro ${isDark ? "ativado" : "desativado"}`}
                className="w-full flex items-center gap-4 p-4 min-h-[64px] hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  {isDark ? (
                    <Moon className="w-5 h-5 text-foreground" aria-hidden="true" />
                  ) : (
                    <Sun className="w-5 h-5 text-foreground" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className="block text-foreground">Tema escuro</span>
                  <span className="block text-sm text-muted-foreground">
                    {isDark ? "Ativado" : "Desativado"}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="relative inline-flex items-center"
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 999,
                    backgroundColor: isDark ? "var(--accent)" : "var(--switch-background)",
                    transition: "background-color 0.2s",
                    border: "2px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: isDark ? 24 : 2,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>

          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm text-muted-foreground mb-3 px-2">{group.title}</h3>
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-4 p-4 min-h-[64px] hover:bg-muted transition-colors ${
                        index !== group.items.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="flex-1 text-left text-foreground">{item.label}</span>
                      {item.badge && (
                        <span className="w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full mt-8 min-h-[48px] h-14 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl flex items-center justify-center gap-3 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          Sair da Conta
        </button>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Versão 1.0.0</p>
          <p className="mt-1">© 2026 AntiGolpe. Todos os direitos reservados.</p>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl text-foreground mb-2">Sair da Conta?</h2>
            <p className="text-muted-foreground mb-6">
              Você precisará fazer login novamente para acessar sua conta.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 min-h-[48px] h-12 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 min-h-[48px] h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
