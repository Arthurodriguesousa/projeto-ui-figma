import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User, Mail, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { getUserData, updateUserData } from "../utils/auth";

export function Profile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setProfileImage(userData.profileImage || null);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Foto de perfil atualizada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }

    if (!email.trim()) {
      toast.error("Email não pode estar vazio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido");
      return;
    }

    updateUserData({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      profileImage: profileImage || undefined,
    });
    toast.success("Perfil atualizado com sucesso!");
    setTimeout(() => navigate("/settings"), 500);
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
          <h1 className="text-xl text-foreground">Editar Perfil</h1>
        </div>

        <div className="px-6 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-accent-foreground" />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 w-12 h-12 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
              >
                <Camera className="w-5 h-5 text-primary-foreground" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Clique na câmera para alterar a foto</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-foreground">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-input-background border-2 border-input focus:border-accent rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-input-background border-2 border-input focus:border-accent rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-input-background border-2 border-input focus:border-accent rounded-xl outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl mt-8 flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}
