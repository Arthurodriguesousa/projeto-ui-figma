import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import type { AnalysisResult, ChainOfThoughtAnalysis, Veredito } from "./scamAnalyzer";
import { analyzeContent } from "./scamAnalyzer";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-9a5ffd57`;

type AiResponse = {
  id: string;
  veredito: Veredito;
  nivelRiscoPercent: number;
  porQue: string;
  oQueFazer: string;
  etapas: { titulo: string; observacoes: string[] }[];
  consenso?: boolean;
  fontes?: string[];
  error?: string;
};

export async function analyzeWithAI(content: string, images: string[] = []): Promise<AnalysisResult & { aiId?: string; aiSources?: string[]; aiConsenso?: boolean }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const resp = await fetch(`${BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ content, images }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data: AiResponse = await resp.json();
    if (data.error) throw new Error(data.error);

    // Normalize legacy veredito values from AI gateway
    if ((data.veredito as string) === 'Golpe') data.veredito = 'Golpe Confirmado';
    if ((data.veredito as string) === 'Caminho Feliz') data.veredito = 'Seguro';

    // Combina com análise local para preservar urlReports, threats etc.
    const local = await analyzeContent(content);
    const chainOfThought: ChainOfThoughtAnalysis = {
      etapas: data.etapas || local.chainOfThought.etapas,
      veredito: data.veredito,
      nivelRiscoPercent: data.nivelRiscoPercent,
      porQue: data.porQue,
      oQueFazer: data.oQueFazer,
    };

    const aiRiskLevel =
      data.veredito === 'Seguro' ? 'caminho-feliz' :
      data.veredito === 'Suspeito' ? 'medio' :
      data.veredito === 'Alto Risco' ? 'alto' : 'critico';

    return {
      ...local,
      veredito: data.veredito,
      riskPercent: data.nivelRiscoPercent,
      riskLevel: aiRiskLevel,
      motivo: data.porQue,
      recomendacao: data.oQueFazer,
      chainOfThought,
      safe: data.veredito === "Seguro",
      aiId: data.id,
      aiSources: data.fontes,
      aiConsenso: data.consenso,
    };
  } catch {
    return analyzeContent(content);
  }
}

export async function sendFeedback(params: {
  analysisId: string;
  isCorrect: boolean;
  correctedVerdict?: Veredito;
  comment?: string;
}): Promise<boolean> {
  try {
    const resp = await fetch(`${BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(params),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
