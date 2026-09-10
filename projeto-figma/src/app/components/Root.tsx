import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, Users, Clock, Settings as SettingsIcon } from "lucide-react";
import { isLoggedIn } from "../utils/auth";
import { initTheme } from "../utils/theme";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/community", icon: Users, label: "Comunidade" },
    { path: "/history", icon: Clock, label: "Histórico" },
    { path: "/settings", icon: SettingsIcon, label: "Ajustes" },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* ── Barra de navegação inferior ─────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-card"
        style={{
          borderTop: "2px solid var(--border)",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.10)",
        }}
        aria-label="Navegação principal"
      >
        <div className="max-w-[430px] mx-auto grid grid-cols-4" style={{ minHeight: 72 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-1 transition-colors relative"
                style={{
                  minHeight: 72,
                  minWidth: 48,
                  color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Indicador ativo */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 rounded-b-full"
                    style={{
                      width: 36,
                      height: 3,
                      backgroundColor: "var(--primary)",
                      transform: "translateX(-50%)",
                    }}
                    aria-hidden="true"
                  />
                )}

                <Icon
                  style={{
                    width: 26,
                    height: 26,
                    color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
