export type UserData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
};

export type UserSettings = {
  shareAnalytics: boolean;
  publicProfile: boolean;
  saveHistory: boolean;
};

const USER_KEY = "app_user_data";
const LOGGED_IN_KEY = "app_logged_in";
const SETTINGS_KEY = "app_user_settings";

export function saveUserData(userData: UserData): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Erro ao salvar dados do usuário:", error);
  }
}

export function getUserData(): UserData | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    return null;
  }
}

export function updateUserData(updates: Partial<UserData>): void {
  try {
    const current = getUserData();
    if (current) {
      const updated = { ...current, ...updates };
      saveUserData(updated);
    }
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
  }
}

export function setLoggedIn(value: boolean): void {
  try {
    localStorage.setItem(LOGGED_IN_KEY, value ? "true" : "false");
  } catch (error) {
    console.error("Erro ao salvar estado de login:", error);
  }
}

export function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(LOGGED_IN_KEY) === "true";
  } catch (error) {
    return false;
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(LOGGED_IN_KEY);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export function validateLogin(email: string, password: string): boolean {
  const userData = getUserData();
  if (!userData) return false;
  return userData.email === email && userData.password === password;
}

// Settings management
export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
  }
}

export function getSettings(): UserSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      shareAnalytics: true,
      publicProfile: false,
      saveHistory: true,
    };
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return {
      shareAnalytics: true,
      publicProfile: false,
      saveHistory: true,
    };
  }
}

export function updateSettings(updates: Partial<UserSettings>): void {
  try {
    const current = getSettings();
    const updated = { ...current, ...updates };
    saveSettings(updated);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
  }
}

// Password management
export function changePassword(currentPassword: string, newPassword: string): boolean {
  try {
    const userData = getUserData();
    if (!userData) return false;

    if (userData.password !== currentPassword) {
      return false;
    }

    updateUserData({ password: newPassword });
    return true;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return false;
  }
}
