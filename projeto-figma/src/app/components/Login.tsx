import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import { getUserData, setLoggedIn, validateLogin, isLoggedIn } from "../utils/auth";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email obrigatório";
    }
    if (!password) {
      newErrors.password = "Senha obrigatória";
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const userData = getUserData();

      if (!userData) {
        toast.error("Nenhuma conta encontrada. Cadastre-se primeiro!");
        setTimeout(() => navigate("/signup"), 1500);
        return;
      }

      if (validateLogin(email, password)) {
        setLoggedIn(true);
        toast.success(`Bem-vindo de volta, ${userData.name}!`);
        navigate("/");
      } else {
        toast.error("Email ou senha incorretos");
        setErrors({ password: "Credenciais inválidas" });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const userData = getUserData();
    setLoggedIn(true);
    toast.success(
      userData
        ? `Bem-vindo de volta, ${userData.name}!`
        : "Login com Google realizado!"
    );
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-4">
      <div className="w-full max-w-md">
        {/* Logo + título */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <div className="w-7 h-7 border-4 border-white rounded-lg"></div>
          </div>
          <h1 className="mb-1 text-foreground" style={{ fontSize: 22, fontWeight: 700 }}>
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>
            Faça login para proteger-se de golpes
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block mb-1 text-foreground"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full pl-11 pr-4 bg-input-background border-2 rounded-xl transition-colors outline-none ${
                  errors.email ? "border-destructive" : "border-input focus:border-accent"
                }`}
                style={{ height: 48, fontSize: 15 }}
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="text-destructive flex items-center gap-1.5 mt-1" style={{ fontSize: 13 }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="login-password"
              className="block mb-1 text-foreground"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`w-full pl-11 pr-4 bg-input-background border-2 rounded-xl transition-colors outline-none ${
                  errors.password ? "border-destructive" : "border-input focus:border-accent"
                }`}
                style={{ height: 48, fontSize: 15 }}
              />
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="text-destructive flex items-center gap-1.5 mt-1" style={{ fontSize: 13 }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Recuperar senha */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-accent hover:underline inline-flex items-center"
              style={{ minHeight: 44, fontSize: 14 }}
            >
              Recuperar senha
            </button>
          </div>

          {/* Entrar */}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl transition-colors font-medium"
            style={{ height: 48, fontSize: 16 }}
          >
            ENTRAR
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-muted-foreground" style={{ fontSize: 13 }}>ou</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full bg-card border-2 border-border hover:bg-muted disabled:bg-muted disabled:opacity-60 text-foreground rounded-xl flex items-center justify-center gap-3 transition-colors font-medium"
            style={{ height: 48, fontSize: 15 }}
            aria-busy={googleLoading}
          >
            {googleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Sincronizando com Google...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" aria-hidden="true" />
                Entrar com Google
              </>
            )}
          </button>

          {/* Criar conta */}
          <p className="text-center text-muted-foreground mt-3" style={{ fontSize: 14 }}>
            Não tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-accent hover:underline inline-flex items-center font-medium"
              style={{ minHeight: 44 }}
            >
              Criar conta
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
