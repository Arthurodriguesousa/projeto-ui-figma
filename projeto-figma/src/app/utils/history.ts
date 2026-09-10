const STORAGE_KEY = "scam_analysis_history";

export type HistoryEntry = {
  id: string;
  content: string;
  veredito: string;
  riskPercent: number;
  riskLevel: string;
  motivo: string;
  date: string;
  time: string;
  hasImages: boolean;
  acoes?: string[];
  scamTypes?: string[];
  highlightTags?: string[];
  suggestions?: string[];
  threats?: string[];
};

export function saveAnalysis(entry: Omit<HistoryEntry, "id" | "date" | "time">): void {
  const now = new Date();
  const date = now.toLocaleDateString("pt-BR");
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time,
  };

  const existing = loadHistory();
  const updated = [newEntry, ...existing].slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
