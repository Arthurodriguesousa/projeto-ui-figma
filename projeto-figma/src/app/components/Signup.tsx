import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import { saveUserData, setLoggedIn, isLoggedIn } from "../utils/auth";
import { toast } from "sonner";

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string }>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Nome obrigatório";
    if (!email) newErrors.email = "Email obrigatório";
    if (!password) {
      newErrors.password = "Senha obrigatória";
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    if (!acceptedTerms) newErrors.terms = "Você deve aceitar os termos";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      saveUserData({ name, email, password });
      setLoggedIn(true);
      toast.success(`Bem-vindo, ${name}! Sua conta foi criada com sucesso.`);
      navigate("/");
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    saveUserData({
      name: "Usuário Google",
      email: "usuario.google@gmail.com",
      password: "google_auth_token",
    });
    setLoggedIn(true);
    toast.success("Bem-vindo! Conta criada com Google.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white rounded-lg"></div>
          </div>
          <h1 className="text-3xl mb-2 text-foreground">Crie sua conta</h1>
          <p className="text-muted-foreground">Proteja-se contra golpes e fraudes</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-2 text-foreground">Nome completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className={`w-full min-h-[56px] h-14 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors ${
                  errors.name ? "border-destructive" : "border-input focus:border-accent"
                } outline-none`}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className={`w-full min-h-[56px] h-14 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors ${
                  errors.email ? "border-destructive" : "border-input focus:border-accent"
                } outline-none`}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-foreground">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha (mín. 8 caracteres)"
                className={`w-full min-h-[56px] h-14 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors ${
                  errors.password ? "border-destructive" : "border-input focus:border-accent"
                } outline-none`}
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-foreground">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className={`w-full min-h-[56px] h-14 pl-12 pr-4 bg-input-background border-2 rounded-xl transition-colors ${
                  errors.confirmPassword ? "border-destructive" : "border-input focus:border-accent"
                } outline-none`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 py-2">
            <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 accent-accent cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-foreground cursor-pointer pt-2.5 flex-1">
              Aceito os <span className="text-accent font-medium">termos de uso</span> e{" "}
              <span className="text-accent font-medium">política de privacidade</span>
            </label>
          </div>
          {errors.terms && (
            <p className="text-destructive text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.terms}</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl transition-colors font-medium"
          >
            CADASTRAR AGORA
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full min-h-[48px] h-14 bg-card border-2 border-border hover:bg-muted disabled:bg-muted disabled:opacity-60 text-foreground rounded-xl flex items-center justify-center gap-3 transition-colors font-medium"
          >
            {googleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Sincronizando com Google...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Cadastrar com Google
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-accent hover:underline min-h-[44px] inline-flex items-center font-medium"
            >
              Clique aqui
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
