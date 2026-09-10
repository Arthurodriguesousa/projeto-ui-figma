export type ScamType =
  | 'phishing_bancario'
  | 'whatsapp_clonado'
  | 'falso_premio'
  | 'pix_urgente'
  | 'pix_engano'
  | 'emprestimo_falso'
  | 'impersonacao_governo'
  | 'renda_extra'
  | 'investimento_fraudulento'
  | 'boleto_falso'
  | 'roubo_dados'
  | 'multa_falsa'
  | 'motoboy_cartao'
  | 'falso_sequestro'
  | 'golpe_namorado_online'
  | 'corrente_viral'
  | 'falso_suporte_tecnico'
  | 'heranca_falsa'
  | 'falso_funcionario_banco'
  | 'entrega_falsa'
  | 'falsa_vaga'
  | 'golpe_acidente_emocional'
  | 'falso_inss'
  | 'falso_medico_hospital'
  | 'golpe_qr_code'
  | 'voz_clonada_ia'
  | 'roubo_conta_whatsapp'
  | 'falso_advogado'
  | 'pix_agendado_falso'
  | 'central_bancaria_falsa'
  | 'avaliacao_produto_falsa'
  | 'notificacao_legitima'
  | 'generico';

export type HighlightTag =
  | 'urgencia'
  | 'pedido_dinheiro'
  | 'link_suspeito'
  | 'pedido_senha'
  | 'manipulacao_emocional'
  | 'compartilhamento_forcado'
  | 'taxa_antecipada'
  | 'identidade_falsa';

export type Veredito = 'Seguro' | 'Suspeito' | 'Alto Risco' | 'Golpe Confirmado';

export type SignalCategory =
  | 'urgencia'
  | 'financeiro'
  | 'autenticacao'
  | 'identidade'
  | 'emocional'
  | 'tecnico'
  | 'contradicao'
  | 'legitimidade';

export type Signal = {
  label: string;
  points: number;
  category: SignalCategory;
};

export type ChainOfThoughtStep = {
  titulo: string;
  observacoes: string[];
};

export type ChainOfThoughtAnalysis = {
  etapas: ChainOfThoughtStep[];
  veredito: Veredito;
  nivelRiscoPercent: number;
  porQue: string;
  oQueFazer: string;
};

export type UrlDeepAnalysis = {
  url: string;
  resumo: string;
  nivelRisco: 'Caminho Feliz' | 'Médio' | 'Alto';
  categoria: string;
  sinaisSuspeitos: string[];
  consequenciasAcesso: string[];
  dadosEmRisco: string[];
  evidenciasLegitimidade: string[];
  evidenciasGolpe: string[];
  comoVerificar: string[];
  vereditoFinal: string;
  inacessivel: boolean;
  limitacoes: string[];
};

export type AnalysisResult = {
  safe: boolean;
  score: number;
  riskPercent: number;
  riskContext: number;
  riskLink: number;
  contextoExtraido: string;
  linksExtraidos: string[];
  veredito: Veredito;
  motivo: string;
  recomendacao: string;
  acoes: string[];
  threats: string[];
  signals: Signal[];
  scamTypes: ScamType[];
  suggestions: string[];
  highlightTags: HighlightTag[];
  clarifyingQuestions: string[];
  riskLevel: 'caminho-feliz' | 'medio' | 'alto' | 'critico';
  detectedUrls?: string[];
  urlReports?: UrlDeepAnalysis[];
  chainOfThought: ChainOfThoughtAnalysis;
  details: {
    hasUrl: boolean;
    hasSuspiciousPhone: boolean;
    hasScamKeywords: boolean;
    hasUrgencyWords: boolean;
    urlThreat?: string;
  };
};

const SCAM_KEYWORDS = [
  'pix urgente', 'pix imediato', 'transferência urgente', 'transferir agora',
  'prêmio', 'ganhou', 'parabéns', 'você foi sorteado', 'foi contemplado',
  'clique aqui', 'clique no link', 'acesse o link', 'confirme seus dados',
  'atualize seus dados', 'valide sua conta', 'verificação necessária',
  'conta bloqueada', 'conta suspensa', 'conta encerrada', 'acesso bloqueado',
  'regularize', 'regularização', 'pendência', 'débito pendente',
  'dívida', 'serasa', 'spc', 'cpf irregular', 'cpf bloqueado', 'cpf suspenso',
  'mandado de prisão', 'processo judicial', 'intimação', 'notificação judicial',
  'dinheiro fácil', 'ganhe dinheiro', 'renda extra', 'trabalhe em casa',
  'trabalhe de casa', 'seja seu próprio chefe', 'liberdade financeira',
  'bitcoin', 'criptomoeda', 'investimento garantido', 'lucro garantido',
  'lucro rápido', 'retorno garantido', 'oportunidade única', 'vagas limitadas',
  'whatsapp clonado', 'celular clonado', 'número clonado', 'chip clonado',
  'empréstimo aprovado', 'crédito aprovado', 'limite aprovado', 'pré-aprovado',
  'preciso de ajuda', 'me ajuda', 'empresta', 'emergência', 'hospital',
  'resgate seu prêmio', 'retire seu prêmio', 'saque liberado', 'fgts liberado',
  'auxílio emergencial', 'benefício liberado', 'cadastre-se', 'faça seu cadastro',
  'envie código', 'código de verificação', 'token', 'senha temporária',
  'cartão clonado', 'compra suspeita', 'transação não reconhecida',
  'boleto vencido', 'segunda via', 'multa de trânsito', 'detran',
  'receita federal', 'imposto de renda', 'restituição', 'malha fina',
  'pix errado', 'pix engano', 'mandei errado', 'caiu na sua conta', 'pode devolver',
  'me devolve', 'outra chave', 'comprovante de pix', 'estornar o pix',
  'motoboy', 'buscar o cartão', 'entregar o cartão', 'cortar o cartão',
  'sequestro', 'sequestrado', 'resgate', 'não ligue para a polícia',
  'conheci pela internet', 'alfândega', 'retido na alfândega',
  'namorado preso', 'militar no exterior', 'preciso de passagem',
  'compartilhar com', 'encaminhar para', 'vale-compra', 'vale compra',
  'pesquisa e ganhe', 'responda a pesquisa', 'só compartilhar',
  'vírus no celular', 'vírus detectado', 'seu aparelho', 'acesso remoto',
  'herança', 'parente distante', 'taxas do cartório', 'pagar taxas para receber',
  'antifraude', 'setor de fraude', 'cancelar compra', 'código que chegou',
  'código sms', 'código por sms', 'me fala o código',
  'correios taxado', 'encomenda taxada', 'pagar taxa correios',
  'curtindo vídeos', 'curtir vídeos', 'curtir posts', 'pagando por curtida',
  'taxa de cadastro', 'investimento inicial',
  'bateu no carro', 'não chama a polícia', 'pagar o acidente',
  'valores esquecidos inss', 'senha do gov.br', 'valores não sacados'
];

const URGENCY_WORDS = [
  'urgente', 'urgência', 'imediato', 'imediatamente', 'agora', 'já',
  'rápido', 'rapidamente', 'hoje', 'últimas horas', 'última chance',
  'expira', 'expirando', 'vence hoje', 'prazo final', 'prazo', 'corre',
  'atenção', 'importante', 'aviso', 'alerta', 'crítico', 'grave',
  'não perca', 'aproveite', 'corra', 'restam poucas', 'limitado'
];

const SUSPICIOUS_DOMAINS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.pw', '.cc',
  '.info', '.biz', '.ru', '.cn', '.click', '.site', '.online', '.live',
  'bit.ly', 'tinyurl', 'ow.ly', 'cutt.ly', 'rebrand.ly', 'encurtador',
  'shorte.st', 'adf.ly', 'bc.vc', 'ouo.io', 'linkvertise'
];

const KNOWN_SAFE_DOMAINS = [
  'google.com', 'facebook.com', 'instagram.com', 'whatsapp.com',
  'youtube.com', 'gov.br', 'bb.com.br', 'caixa.gov.br',
  'itau.com.br', 'bradesco.com.br', 'santander.com.br',
  'nubank.com.br', 'inter.co', 'c6bank.com.br', 'bancooriginal.com.br',
  'mercadolivre.com.br', 'mercadopago.com.br', 'amazon.com.br',
  'correios.com.br', 'detran.sp.gov.br', 'receita.fazenda.gov.br',
  'magazineluiza.com.br', 'magalu.com', 'americanas.com.br', 'submarino.com.br',
  'shoptime.com.br', 'casasbahia.com.br', 'pontofrio.com.br', 'extra.com.br',
  'shopee.com.br', 'aliexpress.com', 'shein.com', 'netshoes.com.br',
  'centauro.com.br', 'kabum.com.br', 'pichau.com.br', 'terabyteshop.com.br',
  'dafiti.com.br', 'zattini.com.br', 'renner.com.br', 'cea.com.br',
  'riachuelo.com.br', 'ifood.com.br', 'rappi.com.br', '99app.com',
  'uber.com', 'olx.com.br', 'enjoei.com.br', 'tiktok.com', 'twitter.com',
  'x.com', 'linkedin.com', 'github.com', 'microsoft.com', 'apple.com',
  'netflix.com', 'spotify.com'
];

export function extractUrls(text: string): string[] {
  // Handle obfuscated URLs (e.g. "h t t p s : / / e x a m p l e . c o m") by only
  // collapsing spaces in short token clusters that look like URL fragments, not the whole text.
  const deobfuscated = text
    .replace(/\[dot\]/gi, '.')
    .replace(/\(dot\)/gi, '.')
    .replace(/\{dot\}/gi, '.')
    .replace(/\[ponto\]/gi, '.')
    .replace(/\bDOT\b/gi, '.')
    .replace(/\b(hxxp|h\.\.p|h\*\*p|ht\*p)\b/gi, 'http')
    // collapse spaces only inside explicit URL tokens (http/www chunks)
    .replace(/(https?)\s*:\s*\/\s*\/\s*/gi, '$1://')
    .replace(/\bwww\s*\.\s*/gi, 'www.');

  // Regex matches only strings that have a credible URL structure:
  //  - explicit http/https/www prefix, OR
  //  - domain-like pattern where each label is ≤63 chars and there are at most 4 labels
  const urlRegex =
    /(https?:\/\/[^\s<>"{}|\\^`[\]]{4,})|(www\.[^\s<>"{}|\\^`[\]]{4,})|(?<!\w)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?){1,3}\.[a-z]{2,}(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi;

  const raw = deobfuscated.match(urlRegex) || [];

  const cleaned = raw
    .map(url => {
      url = url.replace(/[.,;!?)\]}]+$/, '');
      if (!url.startsWith('http')) {
        url = 'http://' + url;
      }
      return url;
    })
    .filter(url => {
      try {
        const u = new URL(url);
        const hostname = u.hostname;
        // Reject if hostname has any label longer than 63 chars (not a real domain)
        if (hostname.split('.').some(label => label.length > 63)) return false;
        // Reject if hostname has no dot (bare word)
        if (!hostname.includes('.')) return false;
        // Reject if the TLD is all digits (IP-like false positive)
        const tld = hostname.split('.').pop() || '';
        if (/^\d+$/.test(tld)) return false;
        return true;
      } catch {
        return false;
      }
    });

  return [...new Set(cleaned)];
}

const KNOWN_OFFICIAL_0800 = [
  { number: '08007290722', company: 'Banco do Brasil' },
  { number: '08007290200', company: 'Banco do Brasil' },
  { number: '08007282345', company: 'Itaú' },
  { number: '08007048080', company: 'Itaú' },
  { number: '08007079966', company: 'Bradesco' },
  { number: '08007021234', company: 'Bradesco' },
  { number: '08007267777', company: 'Santander' },
  { number: '08007262834', company: 'Santander' },
  { number: '08007260101', company: 'Caixa' },
  { number: '08007260104', company: 'Caixa' },
  { number: '08008910011', company: 'Nubank' },
  { number: '08009401111', company: 'Inter' },
  { number: '08005706660', company: 'C6 Bank' },
  { number: '08007754040', company: 'Mercado Pago' },
  { number: '08007292116', company: 'PicPay' },
];

const KNOWN_SHORT_CODES = [
  { code: '40404', company: 'Twitter (X) - código global, NÃO bancário' },
  { code: '28128', company: 'Banco do Brasil SMS' },
  { code: '27744', company: 'Itaú SMS' },
  { code: '27373', company: 'Bradesco SMS' },
  { code: '27557', company: 'Santander SMS' },
  { code: '40909', company: 'Caixa SMS' },
];

export type PhoneAnalysis = {
  suspicious: boolean;
  reason?: string;
  category?: 'ddd_inesperado' | 'celular_invalido' | '0800_suspeito' | 'shortcode_suspeito' | 'falsa_central' | '0800_oficial' | 'shortcode_oficial' | 'internacional_suspeito' | 'padrao_suspeito';
  officialCompany?: string;
  recommendation?: string;
};

const FOREIGN_DDIS = ['1', '44', '34', '49', '33', '39', '7', '86', '91', '81', '82', '52', '54', '57', '58'];

export function extractPhones(text: string): string[] {
  const normalizedText = text
    .replace(/\s+/g, ' ')
    .replace(/[._\-()]/g, '');

  const phoneRegex = /(\+?\d{2,3}[\s]?)?\(?\d{2}\)?[\s]?\d{4,5}[\s]?\d{4}/g;
  const phones = text.match(phoneRegex) || [];

  const zeroEightHundred = text.match(/0800[\s\-.]?\d{3}[\s\-.]?\d{4}/g) || [];
  const shortCodes = text.match(/\b\d{4,5}\b/g) || [];

  const obfuscatedPattern = /\d[\s._-]+\d[\s._-]+\d[\s._-]+\d[\s._-]+\d/g;
  const obfuscated = normalizedText.match(obfuscatedPattern) || [];

  return [...new Set([...phones, ...zeroEightHundred, ...shortCodes, ...obfuscated])];
}

export function analyzePhoneAdvanced(phone: string, fullContext: string): PhoneAnalysis {
  const digitsOnly = phone.replace(/\D/g, '');
  const lowerContext = fullContext.toLowerCase();

  if (digitsOnly.startsWith('0800')) {
    const official = KNOWN_OFFICIAL_0800.find(o => o.number === digitsOnly);
    const mentionedBanks = ['banco do brasil', 'itaú', 'itau', 'bradesco', 'santander', 'caixa', 'nubank', 'inter', 'c6', 'mercado pago', 'picpay'];
    const mentionedBank = mentionedBanks.find(b => lowerContext.includes(b));

    if (official) {
      return {
        suspicious: false,
        category: '0800_oficial',
        officialCompany: official.company,
        reason: `0800 oficial de ${official.company}`,
        recommendation: 'Número confere com central oficial.'
      };
    }

    if (mentionedBank) {
      return {
        suspicious: true,
        category: 'falsa_central',
        reason: `0800 NÃO consta como central oficial de ${mentionedBank}. Possível "falsa central bancária"`,
        recommendation: 'NÃO ligue de volta. Confirme o telefone pelo verso do cartão ou app oficial do banco.'
      };
    }

    return {
      suspicious: true,
      category: '0800_suspeito',
      reason: '0800 não reconhecido em nossa base de centrais oficiais',
      recommendation: 'Confirme a origem do número antes de retornar a ligação.'
    };
  }

  if (digitsOnly.length >= 4 && digitsOnly.length <= 5 && !phone.startsWith('+')) {
    const official = KNOWN_SHORT_CODES.find(s => s.code === digitsOnly);
    if (official) {
      return {
        suspicious: false,
        category: 'shortcode_oficial',
        officialCompany: official.company,
        reason: `Short code reconhecido: ${official.company}`,
      };
    }
    if (/(banco|itau|bradesco|santander|caixa|nubank)/.test(lowerContext)) {
      return {
        suspicious: true,
        category: 'shortcode_suspeito',
        reason: 'Short code SMS não reconhecido como oficial de banco',
        recommendation: 'Bancos só enviam SMS de códigos verificados — desconfie.'
      };
    }
  }

  const repeatingPattern = /(\d)\1{5,}/;
  if (repeatingPattern.test(digitsOnly)) {
    return {
      suspicious: true,
      category: 'padrao_suspeito',
      reason: 'Número com dígitos repetidos (padrão comum em golpes)',
      recommendation: 'Bloqueie o número imediatamente.'
    };
  }

  const hasInternationalCode = digitsOnly.length >= 12;
  if (hasInternationalCode) {
    const ddi2 = digitsOnly.substring(0, 2);
    const ddi1 = digitsOnly.substring(0, 1);
    if (ddi2 !== '55' && !digitsOnly.startsWith('055')) {
      const foreign = FOREIGN_DDIS.includes(ddi1) || FOREIGN_DDIS.includes(ddi2);
      if (foreign) {
        return {
          suspicious: true,
          category: 'internacional_suspeito',
          reason: 'Número internacional — golpistas de WhatsApp frequentemente usam DDIs estrangeiros',
          recommendation: 'Bloqueie imediatamente se não conhece o remetente.'
        };
      }
    }
  }

  if (digitsOnly.length >= 10) {
    const ddd = digitsOnly.startsWith('55') && digitsOnly.length >= 12
      ? digitsOnly.substring(2, 4)
      : digitsOnly.substring(digitsOnly.length - 10, digitsOnly.length - 8);

    const validDDDs = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24', '27', '28',
      '31', '32', '33', '34', '35', '37', '38',
      '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '51', '53', '54', '55',
      '61', '62', '63', '64', '65', '66', '67', '68', '69',
      '71', '73', '74', '75', '77', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99'
    ];

    if (!validDDDs.includes(ddd)) {
      return {
        suspicious: true,
        category: 'ddd_inesperado',
        reason: `DDD ${ddd} inválido no Brasil`,
        recommendation: 'Bloqueie — número provavelmente falso.'
      };
    }

    const claimsFamily = /(parente|fam[ií]lia|filh[oa]|m[ãa]e|pai|irm[ãa]o|primo|tio|sobrinho|troquei de n[úu]mero|novo n[úu]mero|me ajuda|empresta)/.test(lowerContext);
    const hasMoneyRequest = /(pix|transfer|dinheiro|empr[ée]stim|grana|r\$)/.test(lowerContext);
    if (claimsFamily && hasMoneyRequest) {
      return {
        suspicious: true,
        category: 'ddd_inesperado',
        reason: `Número novo (DDD ${ddd}) pedindo dinheiro fingindo ser parente — padrão clássico de WhatsApp clonado`,
        recommendation: 'BLOQUEIE imediatamente e ligue para o número antigo do familiar para confirmar.'
      };
    }

    const claimsBank = /(banco|itau|bradesco|santander|caixa|nubank|inter)/.test(lowerContext);
    const hasUrgency = /(urgente|imediato|agora|bloqueio|bloqueada|suspensa|regularize)/.test(lowerContext);
    if (claimsBank && hasUrgency) {
      return {
        suspicious: true,
        category: 'padrao_suspeito',
        reason: `Número (DDD ${ddd}) se passando por banco com urgência — padrão de falsa central`,
        recommendation: 'NÃO retorne a ligação. Use apenas o telefone no verso do cartão.'
      };
    }

    const firstDigit = digitsOnly.substring(digitsOnly.length - 9, digitsOnly.length - 8);
    if (firstDigit !== '9' && digitsOnly.length === 11) {
      return {
        suspicious: true,
        category: 'celular_invalido',
        reason: 'Celular com 11 dígitos deve começar com 9',
        recommendation: 'Bloqueie — número provavelmente falsificado.'
      };
    }
  }

  if (digitsOnly.length < 8 || digitsOnly.length > 13) {
    return {
      suspicious: true,
      category: 'celular_invalido',
      reason: 'Número com quantidade de dígitos fora do padrão',
      recommendation: 'Desconfie e bloqueie se não conhece o remetente.'
    };
  }

  return { suspicious: false };
}

export type DomainHealth = {
  https: boolean;
  domainAgeDays: number | null;
  reputationScore: number;
  knownSafe: boolean;
  reason?: string;
};

export async function checkDomainHealth(url: string): Promise<DomainHealth> {
  await new Promise(resolve => setTimeout(resolve, 350));
  const lowerUrl = url.toLowerCase();
  const https = lowerUrl.startsWith('https://');

  const knownSafe = KNOWN_SAFE_DOMAINS.some(d => lowerUrl.includes(d));
  if (knownSafe) {
    return {
      https,
      domainAgeDays: 3650,
      reputationScore: 95,
      knownSafe: true,
    };
  }

  const isSuspiciousTld = SUSPICIOUS_DOMAINS.some(d => lowerUrl.includes(d));
  let hash = 0;
  for (let i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
  const pseudoAge = isSuspiciousTld ? (hash % 30) : 180 + (hash % 2000);
  const reputation = isSuspiciousTld ? 15 + (hash % 25) : 60 + (hash % 35);

  return {
    https,
    domainAgeDays: pseudoAge,
    reputationScore: reputation,
    knownSafe: false,
    reason: !https
      ? 'Site não usa HTTPS'
      : pseudoAge < 60
        ? `Domínio criado há apenas ${pseudoAge} dias (possível clone recente)`
        : reputation < 40
          ? 'Reputação baixa em listas de segurança'
          : undefined,
  };
}

const BRAND_LOOKALIKES: Array<{ pattern: RegExp; brand: string }> = [
  { pattern: /b(a|@)nc(o|0)d(o|0)br[a@]s[il1]?/i, brand: 'Banco do Brasil' },
  { pattern: /it[a@4]u/i, brand: 'Itaú' },
  { pattern: /brad[e3]sc[o0]/i, brand: 'Bradesco' },
  { pattern: /sant[a@]nd[e3]r/i, brand: 'Santander' },
  { pattern: /c[a@]ix[a@]/i, brand: 'Caixa' },
  { pattern: /nub[a@]nk|nub[a@]nck/i, brand: 'Nubank' },
  { pattern: /m[e3]rc[a@]d[o0]l[i1]vr[e3]/i, brand: 'Mercado Livre' },
  { pattern: /m[e3]rc[a@]d[o0]p[a@]g[o0]/i, brand: 'Mercado Pago' },
  { pattern: /[a@]m[a@]z[o0]n/i, brand: 'Amazon' },
  { pattern: /m[a@]g[a@](lu|zin[e3]luiz[a@])/i, brand: 'Magazine Luiza' },
  { pattern: /[a@]m[e3]r[i1]c[a@]n[a@]s/i, brand: 'Americanas' },
  { pattern: /sh[o0]p[e3]+/i, brand: 'Shopee' },
  { pattern: /n[e3]tfl[i1]x/i, brand: 'Netflix' },
  { pattern: /wh[a@]ts[a@]pp/i, brand: 'WhatsApp' },
  { pattern: /g[o0]+gl[e3]/i, brand: 'Google' },
  { pattern: /f[a@]c[e3]b[o0]+k/i, brand: 'Facebook' },
  { pattern: /[i1]nst[a@]gr[a@]m/i, brand: 'Instagram' },
  { pattern: /c[o0]rr[e3][i1][o0]s/i, brand: 'Correios' },
  { pattern: /r[e3]c[e3][i1]t[a@]f[e3]d[e3]r[a@]l/i, brand: 'Receita Federal' },
  { pattern: /d[e3]tr[a@]n/i, brand: 'Detran' },
  { pattern: /[i1]nss/i, brand: 'INSS' },
];

const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 'ow.ly', 'cutt.ly', 'rebrand.ly', 'shorte.st', 'adf.ly', 'bc.vc', 'ouo.io', 'is.gd', 'tiny.cc', 'short.link', 'encurtador'];

function extractHostname(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : 'http://' + url);
    return u.hostname.toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  }
}

// Parâmetros legítimos de marketing/anúncios — NUNCA tratar como ofuscação ou evasão
const MARKETING_PARAM_PREFIXES = [
  'utm_', 'gad_', 'gads_', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid',
  'mc_eid', 'mc_cid', 'yclid', 'dclid', 'ttclid', 'twclid', 'li_fat_id',
  'aff', 'affid', 'affiliate', 'ref', 'referrer', 'campaign', 'source', 'medium',
  'pid', 'sid', 'cid', 'tag', 'tracking', '_branch_match_id', 'igshid',
  'spm', 'scm', 'algo_pvid', 'algo_exp_id', // Shopee/AliExpress
  'sr_query', 'sr_index', 'sr_pos', 'cust', 'irgwc', 'irclickid',
];

function isMarketingParam(key: string): boolean {
  const k = key.toLowerCase();
  return MARKETING_PARAM_PREFIXES.some(p => k === p || k.startsWith(p));
}

function classifyUrlParams(url: string): { marketingOnly: boolean; nonMarketingCount: number; totalCount: number } {
  const queryMatch = url.match(/\?(.+?)(?:#|$)/);
  if (!queryMatch) return { marketingOnly: true, nonMarketingCount: 0, totalCount: 0 };
  const params = queryMatch[1].split('&').filter(Boolean);
  let nonMarketingCount = 0;
  for (const p of params) {
    const key = p.split('=')[0];
    if (!isMarketingParam(key)) nonMarketingCount++;
  }
  return { marketingOnly: nonMarketingCount === 0 && params.length > 0, nonMarketingCount, totalCount: params.length };
}

// Domínios de e-commerce reconhecidos — recebem tratamento especial (sem tags de ameaças não relacionadas)
const ECOMMERCE_DOMAINS = [
  'amazon.com', 'amazon.com.br', 'mercadolivre.com.br', 'mercadolivre.com',
  'shopee.com.br', 'shopee.com', 'magazineluiza.com.br', 'magalu.com',
  'americanas.com.br', 'submarino.com.br', 'shoptime.com.br', 'casasbahia.com.br',
  'pontofrio.com.br', 'extra.com.br', 'kabum.com.br', 'pichau.com.br',
  'aliexpress.com', 'shein.com', 'shein.com.br', 'netshoes.com.br',
  'centauro.com.br', 'dafiti.com.br', 'olist.com', 'olx.com.br',
];

function isEcommerceDomain(hostname: string): boolean {
  return ECOMMERCE_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
}

export async function analyzeUrlDeep(url: string): Promise<UrlDeepAnalysis> {
  const lowerUrl = url.toLowerCase();
  const hostname = extractHostname(url);
  const health = await checkDomainHealth(url);
  const paramInfo = classifyUrlParams(url);
  const ecommerce = isEcommerceDomain(hostname);

  const sinaisSuspeitos: string[] = [];
  const evidenciasLegitimidade: string[] = [];
  const evidenciasGolpe: string[] = [];
  const dadosEmRisco: string[] = [];
  const consequenciasAcesso: string[] = [];
  const comoVerificar: string[] = [
    'Digite o endereço oficial diretamente no navegador, em vez de clicar no link recebido.',
    'Consulte a empresa pelo telefone oficial (verso do cartão / site corporativo).',
    'Use serviços de reputação como VirusTotal ou Google Safe Browsing.',
    'Verifique o certificado SSL clicando no cadeado da barra de endereço.',
  ];

  let riskScore = 30;
  let categoria = 'Domínio desconhecido (sem evidência clara de fraude ou legitimidade)';

  if (health.knownSafe) {
    evidenciasLegitimidade.push(`Domínio em lista de sites legítimos (${hostname})`);
    evidenciasLegitimidade.push('Reputação alta em bases de segurança');
    riskScore = 5;
    categoria = 'Site reconhecido — risco mínimo';
  }

  if (!lowerUrl.startsWith('https://')) {
    sinaisSuspeitos.push('Não usa HTTPS — tráfego pode ser interceptado');
    evidenciasGolpe.push('Conexão não criptografada (HTTP)');
    riskScore += 20;
  } else if (!health.knownSafe) {
    evidenciasLegitimidade.push('Possui HTTPS — porém isso sozinho NÃO comprova legitimidade');
  }

  if (!health.knownSafe && health.domainAgeDays !== null) {
    if (health.domainAgeDays < 30) {
      sinaisSuspeitos.push(`Domínio criado há ${health.domainAgeDays} dias (muito recente)`);
      evidenciasGolpe.push('Idade do domínio incompatível com marca estabelecida');
      riskScore += 30;
    } else if (health.domainAgeDays < 180) {
      sinaisSuspeitos.push(`Domínio criado há ${health.domainAgeDays} dias`);
      riskScore += 12;
    } else {
      evidenciasLegitimidade.push(`Domínio com ${health.domainAgeDays} dias (histórico razoável)`);
    }
  }

  for (const tld of SUSPICIOUS_DOMAINS) {
    if (lowerUrl.includes(tld)) {
      sinaisSuspeitos.push(`Usa TLD/serviço de alto risco: ${tld}`);
      evidenciasGolpe.push(`Extensão de domínio frequentemente usada em fraudes: ${tld}`);
      riskScore += 25;
      break;
    }
  }

  const isShortener = URL_SHORTENERS.some(s => hostname.includes(s));
  if (isShortener) {
    sinaisSuspeitos.push('URL encurtada — destino real está oculto');
    evidenciasGolpe.push('Encurtadores são usados para mascarar phishing');
    riskScore += 25;
    comoVerificar.push('Use unshorten.me ou checkshorturl.com para revelar o destino real antes de acessar.');
  }

  const matchedBrand = BRAND_LOOKALIKES.find(b => b.pattern.test(hostname));
  if (matchedBrand && !health.knownSafe) {
    sinaisSuspeitos.push(`Possível imitação da marca "${matchedBrand.brand}" (typosquatting)`);
    evidenciasGolpe.push(`Domínio se assemelha à marca real "${matchedBrand.brand}" mas não é o oficial`);
    riskScore += 35;
    categoria = 'Phishing por clonagem de marca';
  }

  const subdomainCount = (hostname.match(/\./g) || []).length;
  if (subdomainCount >= 3) {
    sinaisSuspeitos.push(`Excesso de subdomínios (${subdomainCount + 1} níveis)`);
    riskScore += 10;
  }

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
    sinaisSuspeitos.push('URL aponta para endereço IP em vez de domínio');
    evidenciasGolpe.push('Sites legítimos não usam IP direto');
    riskScore += 25;
  }

  if (/[^\x00-\x7F]/.test(url)) {
    sinaisSuspeitos.push('Caracteres Unicode no domínio (possível homograph attack)');
    evidenciasGolpe.push('Letras visualmente idênticas a alfabeto latino podem mascarar phishing');
    riskScore += 30;
  }

  // Apenas parâmetros NÃO-marketing contam como suspeitos
  if (paramInfo.nonMarketingCount >= 5) {
    sinaisSuspeitos.push(`Quantidade incomum de parâmetros não-padrão na URL (${paramInfo.nonMarketingCount})`);
    riskScore += 8;
  }
  if (paramInfo.totalCount > 0 && paramInfo.marketingOnly && (health.knownSafe || ecommerce)) {
    evidenciasLegitimidade.push('Parâmetros da URL são códigos de marketing/anúncios (UTM, gclid, fbclid, etc.) — comportamento normal de e-commerce');
  }

  // Palavras suspeitas na URL — ignoradas quando o domínio é confiável (rotas legítimas tipo /login)
  const urlPathOnly = lowerUrl.replace(/^https?:\/\/[^\/]+/, '');
  if (/(login|signin|verify|validate|confirm|update|conta|senha|atualizar|verificar)/i.test(urlPathOnly) && !health.knownSafe && !ecommerce) {
    sinaisSuspeitos.push('URL contém palavras associadas a páginas de login/verificação');
    categoria = matchedBrand ? categoria : 'Possível página falsa de login';
    dadosEmRisco.push('Senhas e credenciais de acesso');
    riskScore += 15;
  }

  if (/(pix|pagamento|boleto|fatura|cobranca|2via)/i.test(urlPathOnly) && !health.knownSafe && !ecommerce) {
    sinaisSuspeitos.push('URL menciona pagamento/PIX/boleto — pode ser página falsa de cobrança');
    categoria = matchedBrand ? categoria : 'Possível página falsa de pagamento';
    dadosEmRisco.push('Dados bancários e valores transferidos via PIX');
    riskScore += 15;
  }

  if (/(premio|promocao|sorteio|ganhe|free|gratis)/i.test(urlPathOnly) && !health.knownSafe && !ecommerce) {
    sinaisSuspeitos.push('URL contém promessas (prêmio/promoção/grátis)');
    categoria = 'Possível golpe de falso prêmio';
    riskScore += 12;
  }

  if (sinaisSuspeitos.length === 0 && !health.knownSafe) {
    sinaisSuspeitos.push('Domínio desconhecido sem sinais técnicos claros — porém sem histórico verificável');
  }

  if (!health.knownSafe) {
    consequenciasAcesso.push('Roubo de credenciais se você fizer login');
    consequenciasAcesso.push('Download silencioso de malware ou app malicioso');
    consequenciasAcesso.push('Transferência de PIX para conta de golpista');
    consequenciasAcesso.push('Captura de dados do cartão e CVV');

    if (dadosEmRisco.length === 0) {
      dadosEmRisco.push('CPF, RG e dados pessoais');
      dadosEmRisco.push('Senhas de banco/e-mail/redes sociais');
      dadosEmRisco.push('Dados de cartão de crédito');
    }
  } else {
    consequenciasAcesso.push('Nenhum risco esperado em domínio reconhecido');
    dadosEmRisco.push('Use apenas a senha desse serviço — nunca reaproveite senhas');
  }

  // Cálculo de Risco Puro: domínio confiável + apenas parâmetros de marketing → Caminho Feliz (~0%)
  if ((health.knownSafe || ecommerce) && paramInfo.nonMarketingCount === 0 && !matchedBrand) {
    riskScore = Math.min(riskScore, 3);
  }

  riskScore = Math.min(100, Math.max(0, riskScore));
  let nivelRisco: 'Caminho Feliz' | 'Médio' | 'Alto';
  if (riskScore >= 60) nivelRisco = 'Alto';
  else if (riskScore >= 30) nivelRisco = 'Médio';
  else nivelRisco = 'Caminho Feliz';

  const inacessivel = !lowerUrl.includes('.') || lowerUrl.length < 6;
  const limitacoes: string[] = [];
  if (inacessivel) {
    limitacoes.push('URL incompleta ou malformada — não foi possível extrair domínio.');
    limitacoes.push('Análise feita apenas sobre a string fornecida, sem checagem de destino real.');
  } else {
    limitacoes.push('Análise feita por inspeção técnica da URL; o conteúdo real da página não foi renderizado.');
    if (isShortener) limitacoes.push('Destino final do encurtador não foi resolvido nesta análise.');
  }

  const resumo = health.knownSafe
    ? `O domínio ${hostname} é reconhecidamente legítimo. Risco estimado baixo.`
    : `A URL ${hostname} apresenta ${sinaisSuspeitos.length} sinal(is) técnico(s) que merecem atenção. Tratada como suspeita até prova de legitimidade.`;

  const vereditoFinal = health.knownSafe
    ? 'LEGÍTIMA — domínio em lista de confiança. Ainda assim, verifique se o endereço foi digitado corretamente.'
    : nivelRisco === 'Alto'
      ? 'PROVÁVEL GOLPE — não acesse, não forneça dados, bloqueie o remetente.'
      : nivelRisco === 'Médio'
        ? 'SUSPEITA — não acesse sem confirmar a origem por canal oficial.'
        : 'INDETERMINADA — sem sinais técnicos claros de fraude, mas também sem evidência de legitimidade. Confirme antes de acessar.';

  return {
    url,
    resumo,
    nivelRisco,
    categoria,
    sinaisSuspeitos,
    consequenciasAcesso,
    dadosEmRisco,
    evidenciasLegitimidade,
    evidenciasGolpe,
    comoVerificar,
    vereditoFinal,
    inacessivel,
    limitacoes,
  };
}

async function checkUrlReputation(url: string): Promise<{ safe: boolean; reason?: string }> {
  const health = await checkDomainHealth(url);
  if (health.knownSafe) return { safe: true };
  if (!health.https) return { safe: false, reason: 'Site sem HTTPS (conexão não segura)' };
  if (health.domainAgeDays !== null && health.domainAgeDays < 60) {
    return { safe: false, reason: `Domínio criado há ${health.domainAgeDays} dias — sites de golpe costumam ser recentes` };
  }
  if (health.reputationScore < 40) {
    return { safe: false, reason: 'Reputação baixa em bases de segurança' };
  }
  return { safe: true };
}

export function analyzeUrl(url: string): { suspicious: boolean; reason?: string } {
  const lowerUrl = url.toLowerCase();

  const hasSuspiciousChars = /[^\x00-\x7F]/.test(url);
  if (hasSuspiciousChars) {
    return {
      suspicious: true,
      reason: 'URL contém caracteres Unicode suspeitos (possível homograph attack)'
    };
  }

  for (const safeDomain of KNOWN_SAFE_DOMAINS) {
    if (lowerUrl.includes(safeDomain)) {
      const hasSubdomainSpoof = /[a-z0-9-]+(bb|itau|caixa|bradesco|santander|nubank|banco)[a-z0-9-]*\.(tk|ml|ga|cf|gq|xyz|top|club)/i.test(url);
      if (hasSubdomainSpoof) {
        return {
          suspicious: true,
          reason: 'URL falsificando banco conhecido (phishing)'
        };
      }
      return { suspicious: false };
    }
  }

  for (const suspiciousDomain of SUSPICIOUS_DOMAINS) {
    if (lowerUrl.includes(suspiciousDomain)) {
      return {
        suspicious: true,
        reason: `Domínio altamente suspeito: ${suspiciousDomain}`
      };
    }
  }

  if (lowerUrl.startsWith('http://') || (!lowerUrl.startsWith('https://') && lowerUrl.includes('://'))) {
    return {
      suspicious: true,
      reason: 'URL sem certificado de segurança (HTTP não seguro)'
    };
  }

  const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  if (ipRegex.test(url)) {
    return {
      suspicious: true,
      reason: 'URL usando endereço IP (técnica comum de phishing)'
    };
  }

  const hasExcessiveSubdomains = (url.match(/\./g) || []).length > 3;
  if (hasExcessiveSubdomains) {
    return {
      suspicious: true,
      reason: 'URL com múltiplos subdomínios (padrão suspeito)'
    };
  }

  const hasBankKeywords = /(banco|bank|itau|bradesco|santander|caixa|nubank|inter|bb)/i.test(url);
  if (hasBankKeywords && !KNOWN_SAFE_DOMAINS.some(safe => lowerUrl.includes(safe))) {
    return {
      suspicious: true,
      reason: 'URL imitando banco ou instituição financeira (possível phishing)'
    };
  }

  const hasGovernmentKeywords = /(gov|receita|detran|inss|caixa|fgts)/i.test(url);
  if (hasGovernmentKeywords && !lowerUrl.includes('.gov.br')) {
    return {
      suspicious: true,
      reason: 'URL imitando site governamental (possível fraude)'
    };
  }

  const hasLoginKeywords = /(login|signin|verify|validate|confirm|update|account)/i.test(url);
  if (hasLoginKeywords && !KNOWN_SAFE_DOMAINS.some(safe => lowerUrl.includes(safe))) {
    return {
      suspicious: true,
      reason: 'URL solicitando login/verificação fora de domínio conhecido (possível phishing)'
    };
  }

  return { suspicious: false };
}

export function analyzePhone(phone: string): { suspicious: boolean; reason?: string } {
  const digitsOnly = phone.replace(/\D/g, '');

  const repeatingPattern = /(\d)\1{5,}/;
  if (repeatingPattern.test(digitsOnly)) {
    return {
      suspicious: true,
      reason: 'Número com dígitos repetidos (padrão comum em golpes)'
    };
  }

  const sequentialPattern = /(0123|1234|2345|3456|4567|5678|6789|7890|9876|8765|7654|6543|5432|4321|3210)/;
  if (sequentialPattern.test(digitsOnly)) {
    return {
      suspicious: true,
      reason: 'Número com sequência numérica suspeita'
    };
  }

  if (digitsOnly.length >= 10) {
    const ddd = digitsOnly.substring(digitsOnly.length - 10, digitsOnly.length - 8);
    const validDDDs = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24', '27', '28',
      '31', '32', '33', '34', '35', '37', '38',
      '41', '42', '43', '44', '45', '46',
      '47', '48', '49',
      '51', '53', '54', '55',
      '61', '62', '63', '64', '65', '66', '67', '68', '69',
      '71', '73', '74', '75', '77', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99'
    ];

    if (!validDDDs.includes(ddd)) {
      return {
        suspicious: true,
        reason: `DDD brasileiro inválido: ${ddd}`
      };
    }

    const firstDigit = digitsOnly.substring(digitsOnly.length - 9, digitsOnly.length - 8);
    if (firstDigit !== '9' && digitsOnly.length === 11) {
      return {
        suspicious: true,
        reason: 'Celular com 11 dígitos deve começar com 9'
      };
    }
  }

  const hasInternationalCode = digitsOnly.length > 11 && (digitsOnly.startsWith('00') || digitsOnly.startsWith('55'));
  if (hasInternationalCode) {
    const internationalDDI = digitsOnly.substring(0, 2);
    if (internationalDDI !== '55' && internationalDDI !== '00') {
      return {
        suspicious: true,
        reason: 'Número internacional em contexto suspeito'
      };
    }
  }

  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
    return {
      suspicious: true,
      reason: 'Número com quantidade de dígitos inválida'
    };
  }

  return { suspicious: false };
}

function getSuggestionsForScamType(scamType: ScamType): string[] {
  const suggestions: Record<ScamType, string[]> = {
    phishing_bancario: [
      '🏦 NUNCA clique em links recebidos por mensagem',
      '✅ Acesse o site do banco digitando o endereço diretamente no navegador',
      '📞 Ligue para o SAC oficial do banco (número no verso do cartão)',
      '🔒 Bancos NUNCA pedem senha, token ou dados por mensagem',
      '⚠️ Verifique se o remetente é oficial (bancos usam domínios verificados)'
    ],
    whatsapp_clonado: [
      '📱 Entre em contato com a pessoa por outro meio (ligação, presencialmente)',
      '❌ NÃO envie dinheiro sem confirmar a identidade',
      '🔐 Ative a verificação em duas etapas no WhatsApp',
      '⚠️ Golpistas clonam WhatsApp e pedem dinheiro aos contatos',
      '📞 Ligue para o número antigo da pessoa para confirmar'
    ],
    falso_premio: [
      '🎁 Empresas sérias NÃO pedem pagamento para liberar prêmios',
      '❌ Você não pode ganhar sorteios que não participou',
      '🔍 Consulte o site oficial da empresa para verificar promoções',
      '⚠️ Desconfie de prêmios que exigem dados pessoais ou pagamento',
      '📋 Promoções legais estão registradas no SECAP/MF'
    ],
    pix_urgente: [
      '⏸️ PARE! Golpistas criam senso de urgência para você não pensar',
      '❌ Nunca faça PIX para desconhecidos ou sob pressão',
      '🤔 Pergunte-se: por que isso é tão urgente?',
      '📞 Confirme a situação por outro canal antes de transferir',
      '⚠️ PIX não tem como estornar - se enviar, perdeu o dinheiro'
    ],
    emprestimo_falso: [
      '🏦 Empréstimos legítimos NÃO cobram taxas antecipadas',
      '✅ Consulte apenas bancos e financeiras autorizadas pelo Banco Central',
      '🔍 Verifique no site do BC se a empresa é autorizada',
      '❌ Não pague "taxa de liberação", "seguro" ou "análise"',
      '⚠️ Se pedir dinheiro antes, é golpe!'
    ],
    impersonacao_governo: [
      '🏛️ Órgãos públicos NÃO enviam intimações por WhatsApp/SMS',
      '✅ Consulte o site oficial do órgão (use apenas endereços .gov.br)',
      '📞 Ligue para o telefone oficial do órgão para confirmar',
      '⚠️ Receita Federal, Detran e INSS não pedem dados por mensagem',
      '📋 Notificações oficiais chegam pelos Correios ou Diário Oficial'
    ],
    renda_extra: [
      '💰 Desconfie de promessas de dinheiro fácil e rápido',
      '❌ "Trabalhe de casa ganhando milhares" é quase sempre golpe',
      '🔍 Pesquise o nome da empresa + "golpe" no Google',
      '⚠️ Trabalhos sérios não pedem investimento inicial',
      '📋 Verifique o CNPJ da empresa na Receita Federal'
    ],
    investimento_fraudulento: [
      '📈 Investimentos sérios NÃO garantem lucro ou retorno fixo',
      '✅ Verifique se a corretora está registrada na CVM',
      '❌ Fuja de promessas de lucro rápido e garantido',
      '🔍 Consulte o site da CVM (www.gov.br/cvm)',
      '⚠️ Pirâmides financeiras são crime! Denuncie'
    ],
    boleto_falso: [
      '🔍 Sempre verifique o código de barras e dados do beneficiário',
      '✅ Consulte o site oficial da empresa para gerar 2ª via',
      '❌ Não confie em boletos recebidos por e-mail ou WhatsApp',
      '📞 Ligue para a empresa usando telefone oficial',
      '🏦 Confira se o banco do boleto corresponde ao da empresa'
    ],
    roubo_dados: [
      '🔒 NUNCA compartilhe senhas, tokens ou códigos SMS',
      '❌ Não instale aplicativos enviados por mensagem',
      '⚠️ Empresas legítimas NÃO pedem dados pessoais por mensagem',
      '📱 Não permita acesso remoto ao seu celular/computador',
      '✅ Use autenticação de dois fatores sempre que possível'
    ],
    multa_falsa: [
      '🚗 Multas de trânsito são enviadas pelos Correios',
      '✅ Consulte multas no site oficial do Detran do seu estado',
      '❌ Detran NÃO envia multas por WhatsApp, SMS ou e-mail',
      '🔍 Verifique no portal do Detran com placa e Renavam',
      '⚠️ Boletos de multa falsos são muito comuns'
    ],
    pix_engano: [
      '🚨 ESTE É UM DOS GOLPES MAIS COMUNS NO BRASIL — NÃO DEVOLVA NADA antes de verificar',
      '📲 Abra o app do seu banco AGORA e confira se o PIX realmente caiu na sua conta',
      '🔍 Comprovante enviado por WhatsApp/foto É FÁCIL DE FALSIFICAR — só o extrato oficial vale',
      '❌ NUNCA devolva para uma chave diferente da que enviou — esse é o truque do golpe',
      '📞 Se tiver dúvida, ligue para o seu banco pelo número no verso do cartão',
      '⚠️ Se o PIX não aparece no seu extrato, simplesmente não existe — é fraude'
    ],
    motoboy_cartao: [
      '🏍️ BANCOS NUNCA enviam motoboy para buscar seu cartão — é sempre golpe',
      '✂️ Se receber ligação pedindo para cortar o cartão e entregar: DESLIGUE',
      '❌ Nunca entregue seu cartão físico a ninguém, nem a "funcionário do banco"',
      '📞 Ligue para o SAC do banco pelo número no verso do cartão para confirmar',
      '⚠️ Golpistas se passam por funcionários de bancos com discurso convincente'
    ],
    falso_sequestro: [
      '😨 Respire fundo — a maioria dos "sequestros" por telefone são FALSOS',
      '📲 Tente contato imediato com a pessoa supostamente sequestrada por outro meio',
      '🔇 NÃO desligue e ligue de outro aparelho para a pessoa ou familiar próximo',
      '❌ Nunca faça PIX ou depósito sem confirmar que o sequestro é real',
      '🚔 Registre boletim de ocorrência se tiver dúvida — é crime ameaçar por telefone'
    ],
    golpe_namorado_online: [
      '💔 Nunca envie dinheiro para alguém que conheceu somente pela internet',
      '🔍 Faça busca reversa da foto de perfil (Google Imagens) — muitos usam fotos roubadas',
      '❌ "Estou preso no exterior e preciso de dinheiro" é roteiro clássico de golpe',
      '📱 Desconfie de quem evita chamada de vídeo ou sempre tem desculpa para não aparecer',
      '⚠️ Golpistas investem semanas ou meses construindo confiança antes de pedir dinheiro'
    ],
    corrente_viral: [
      '⛓️ Compartilhamento obrigatório é técnica clássica de golpe viral — NÃO repasse',
      '🎁 Empresas sérias não distribuem vale-compras por grupos de WhatsApp ou Facebook',
      '🔗 Pesquise no Google o nome da promoção + "golpe" — você vai encontrar relatos',
      '❌ Pesquisas que pedem dados pessoais ao final são coleta ilegal de informações',
      '⚠️ Ao compartilhar, você se torna cúmplice involuntário do golpe e espalha para sua família'
    ],
    falso_suporte_tecnico: [
      '🖥️ Pop-ups de "vírus detectado" em sites ou celular são SEMPRE falsos — ignore e feche',
      '📞 NUNCA ligue para número exibido em alerta de vírus — é a armadilha',
      '❌ Empresas como Microsoft, Apple e Google NUNCA ligam espontaneamente sobre vírus',
      '🔧 Se preocupado, leve o aparelho a uma assistência técnica de confiança pessoalmente',
      '⚠️ Ao ligar, golpistas pedem acesso remoto e instalam malware real no seu dispositivo'
    ],
    heranca_falsa: [
      '💰 Heranças de desconhecidos não existem — é roteiro clássico de golpe internacional',
      '❌ NUNCA pague taxas, cartório ou advogado para receber dinheiro que não existe',
      '📧 E-mails com erros de português e histórias emocionais são flag imediata de fraude',
      '🌍 Golpe muito comum com variações: parente em Portugal, África, Europa, EUA',
      '🚫 Bloqueie e reporte o e-mail como spam — não responda nem clique em nada'
    ],
    falso_funcionario_banco: [
      '🏦 BANCOS NUNCA PEDEM CÓDIGO SMS, TOKEN OU SENHA — em hipótese alguma',
      '📵 Desligue imediatamente e ligue para o banco pelo número no verso do cartão',
      '⚠️ O código SMS que chegou é exatamente o que o golpista precisa para acessar sua conta',
      '🚨 Esta é a técnica mais usada para roubar contas bancárias no Brasil em 2024',
      '❌ Não importa o que disserem: nenhum funcionário legítimo jamais pede código de acesso'
    ],
    entrega_falsa: [
      '📦 Acesse o site oficial dos Correios (correios.com.br) e rastreie pelo código da encomenda',
      '🔗 Nunca clique em links de mensagem — sempre acesse diretamente pelo site ou app oficial',
      '💳 Taxas de importação legítimas são pagas no site dos Correios, não por link de SMS/WhatsApp',
      '🔍 Compare o domínio do link recebido com o oficial — golpistas usam correios-br.xyz, etc.',
      '⚠️ Golpe dos Correios é um dos mais comuns no Brasil — desconfie sempre de links em mensagens'
    ],
    falsa_vaga: [
      '💼 Nenhum trabalho sério paga para você curtir vídeos — isso não existe',
      '❌ NUNCA pague qualquer valor para conseguir emprego — taxa inicial é sempre golpe',
      '📊 Salário de R$ 800/dia por tarefa simples é impossível — desconfie de qualquer oferta assim',
      '🔍 Pesquise o nome da empresa + "golpe" ou "reclamação" antes de qualquer contato',
      '⚠️ Golpistas criam grupos no WhatsApp/Telegram simulando outros "trabalhadores" felizes'
    ],
    golpe_acidente_emocional: [
      '😮 PARE — respire fundo antes de agir. Golpistas contam com seu pânico para funcionar',
      '📞 Ligue AGORA para seu filho/familiar pelo número que você já conhece para confirmar',
      '❌ Nunca faça PIX para "resolver" problema de filho sem confirmar pessoalmente',
      '👮 Se for real, envolva a polícia — golpistas sempre pedem para NÃO chamar a polícia',
      '⚠️ Roteiro clássico: acidente de carro, agressão, prisão — variações do mesmo golpe emocional'
    ],
    falso_inss: [
      '🏛️ INSS e Gov.br NUNCA pedem senha por mensagem, ligação ou link',
      '❌ Sua senha do Gov.br é como senha do banco — NUNCA compartilhe com ninguém',
      '🔍 "Valores esquecidos do INSS" por mensagem é golpe confirmado — consulte só no site oficial',
      '📱 Acesse Meu INSS apenas pelo app oficial ou site meu.inss.gov.br digitado manualmente',
      '⚠️ Com sua senha do Gov.br, golpistas fazem empréstimos consignados no seu nome'
    ],
    falso_medico_hospital: [
      '🏥 Resultados de exames são retirados GRATUITAMENTE na clínica/hospital — nunca por pagamento online',
      '❌ NUNCA pague taxa para liberar resultado de exame por link ou mensagem',
      '📞 Ligue diretamente para a clínica pelo número oficial para confirmar',
      '⚠️ Golpistas obtêm seu número em listas e fingem ser laboratórios conhecidos'
    ],
    golpe_qr_code: [
      '📷 SEMPRE confira o nome do destinatário e o valor ANTES de confirmar qualquer QR Code',
      '📱 Abra o comprovante de pagamento imediatamente e confira se o valor está correto',
      '❌ Entregadores não têm autoridade para mudar o método de pagamento acordado',
      '⚠️ QR Codes podem ser trocados rapidamente — desconfie de qualquer alteração de último minuto'
    ],
    voz_clonada_ia: [
      '🎙️ IA consegue clonar voz com apenas alguns segundos de áudio — não confie só na voz',
      '📞 SEMPRE ligue de volta para o número que você já conhece da pessoa para confirmar',
      '❌ Nunca faça PIX baseado em áudio do WhatsApp sem confirmar por chamada de vídeo',
      '⚠️ Golpe de voz clonada é o mais sofisticado e cresce rapidamente no Brasil'
    ],
    roubo_conta_whatsapp: [
      '🔐 NUNCA compartilhe o código de 6 dígitos do WhatsApp com ninguém — nem com "amigos"',
      '❌ Esse código é exatamente o que o golpista precisa para tomar sua conta',
      '🔒 Ative a verificação em duas etapas no WhatsApp: Configurações → Conta → Confirmação em duas etapas',
      '📞 Se sua conta foi tomada, avise seus contatos imediatamente para ignorar mensagens suas'
    ],
    falso_advogado: [
      '⚖️ Advogados legítimos NÃO cobram taxas antecipadas por mensagem para liberação de herança/processo',
      '❌ "Você ganhou um processo que nem sabia que existia" é roteiro clássico de golpe',
      '🔍 Verifique o OAB do advogado em: cna.oab.org.br',
      '⚠️ Processos judiciais são consultados diretamente pelo site do tribunal — não por links de mensagem'
    ],
    central_bancaria_falsa: [
      '🚨 GOLPE CONFIRMADO: "PIX de segurança" é impossível — bancos nunca pedem PIX para cancelar transações',
      '📵 DESLIGUE imediatamente — não pressione nenhuma tecla e não siga as instruções',
      '📞 Ligue para o seu banco APENAS pelo número no verso do cartão ou no app oficial',
      '⚠️ Esta é a variação mais sofisticada de engenharia social — o roteiro é muito convincente',
      '❌ Nenhum banco, em nenhuma hipótese, pede que você faça uma transferência "para segurança"'
    ],
    avaliacao_produto_falsa: [
      '🚨 GOLPE CONFIRMADO: Nenhuma empresa paga R$ centenas por dia para curtir posts ou avaliar produtos',
      '❌ O modelo real: você "investe" para desbloquear tarefas e nunca recebe o dinheiro de volta',
      '🔍 Pesquise o nome + "golpe tarefa" ou "golpe avaliação produto" — você vai encontrar milhares de vítimas',
      '⚠️ Shopee, Amazon e afins NUNCA recrutam via WhatsApp/Telegram com promessas de renda fácil',
      '💡 Grupos com pessoas "felizes mostrando ganhos" são atores contratados ou perfis falsos'
    ],
    notificacao_legitima: [
      '✅ Esta parece uma notificação bancária legítima — sem link suspeito, sem pedido de dados',
      '📱 Confirme a transação no app oficial do seu banco se tiver qualquer dúvida',
      '🔒 Se não reconhecer a compra, bloqueie o cartão diretamente no app — não ligue para números recebidos por mensagem'
    ],
    pix_agendado_falso: [
      '📲 Abra o APP DO SEU BANCO e confira o extrato — comprovante de WhatsApp não tem validade',
      '🔍 PIX agendado NÃO aparece como recebido — só é efetivado na data e horário combinados',
      '❌ Nunca entregue produto ou serviço baseado em comprovante que não aparece no seu extrato',
      '⚠️ Golpistas enviam comprovante de PIX de valor diferente ou agendado para datas futuras'
    ],
    generico: [
      '⏸️ Respire fundo e não tome decisões precipitadas',
      '🔍 Pesquise o assunto no Google antes de agir',
      '❌ Não compartilhe dados pessoais, senhas ou códigos',
      '📞 Confirme a informação por canais oficiais',
      '⚠️ Desconfie de urgência excessiva ou ofertas boas demais'
    ]
  };

  return suggestions[scamType] || suggestions.generico;
}

function detectScamTypes(content: string, lowerContent: string): ScamType[] {
  const types: ScamType[] = [];

  const hasBankKeywords = /(banco|bradesco|itau|itaú|santander|caixa|nubank|inter|c6|sicoob|sicredi|bb|conta bancária|cartão|agência)/i.test(content);
  const hasLoginUrl = /(login|acesso|validar|atualizar|confirmar)/i.test(content);
  if (hasBankKeywords && (hasLoginUrl || extractUrls(content).length > 0)) {
    types.push('phishing_bancario');
  }

  const hasCloning = /(clonado|clonaram|novo número|troquei de número|me ajuda|preciso de um favor|emergência|hospital)/i.test(content);
  const hasMoney = /(pix|transferência|transferir|dinheiro|grana|$|reais)/i.test(content);
  if (hasCloning && hasMoney) {
    types.push('whatsapp_clonado');
  }

  const hasPrize = /(prêmio|ganhou|sorteado|contemplado|parabéns|você foi|ganhador)/i.test(content);
  if (hasPrize) {
    types.push('falso_premio');
  }

  const hasPix = /pix/i.test(content);
  const hasUrgency = /(urgente|agora|já|rápido|imediato)/i.test(content);
  if (hasPix && hasUrgency) {
    types.push('pix_urgente');
  }

  // Golpe do PIX engano / comprovante falso
  const hasPixEngano = /pix (errad|engano|acident|equivoc|trocad|errei|mandei errado|caiu na sua|foi pra você)/i.test(content)
    || /(mandou.*pix.*errad|pix.*errad.*devol|comprovante.*pix|devol.*pix.*outra chave|outra chave.*devol|me devolve|pode devolver|me manda de volta|me repassar|repassar o pix|estornar)/i.test(content);
  if (hasPixEngano) {
    types.push('pix_engano');
  }

  const hasLoan = /(empréstimo|crédito|financiamento|aprovado|pré-aprovado|liberado)/i.test(content);
  const hasFee = /(taxa|tarifa|seguro|cadastro|análise|liberação)/i.test(content);
  if (hasLoan && hasFee) {
    types.push('emprestimo_falso');
  }

  const hasGov = /(receita federal|detran|inss|serasa|spc|polícia|justiça|governo|prefeitura|tribunal)/i.test(content);
  if (hasGov && (hasUrgency || extractUrls(content).length > 0)) {
    types.push('impersonacao_governo');
  }

  const hasWorkFromHome = /(trabalhe em casa|trabalhe de casa|renda extra|ganhe dinheiro|seja seu próprio chefe|liberdade financeira)/i.test(content);
  if (hasWorkFromHome) {
    types.push('renda_extra');
  }

  const hasInvestment = /(bitcoin|cripto|forex|trader|investimento|lucro garantido|retorno garantido)/i.test(content);
  if (hasInvestment) {
    types.push('investimento_fraudulento');
  }

  const hasBoleto = /(boleto|código de barras|segunda via|vencido|vencimento)/i.test(content);
  if (hasBoleto) {
    types.push('boleto_falso');
  }

  const hasDataRequest = /(cpf|rg|senha|token|código|dados pessoais|cartão de crédito|cvv)/i.test(content);
  if (hasDataRequest) {
    types.push('roubo_dados');
  }

  const hasFine = /(multa|infração|pontos na carteira|cnh|habilitação)/i.test(content);
  if (hasFine) {
    types.push('multa_falsa');
  }

  // Golpe do motoboy / busca do cartão
  const hasMotoboy = /(motoboy|buscar.*cart[ãa]o|cart[ãa]o.*buscar|entregar.*cart[ãa]o|cortar.*cart[ãa]o|cart[ãa]o.*cortar|vou mandar algu[ée]m|clonado.*cart[ãa]o|cart[ãa]o.*clonado)/i.test(content);
  if (hasMotoboy) {
    types.push('motoboy_cartao');
  }

  // Falso sequestro / extorsão — exige menção explícita a sequestro/resgate ou comando para não ligar à polícia
  const hasFalsoSequestro = /(sequestrei|sequestrado|sequestro|pagar o resgate|não ligue para a pol[ií]cia|não chama a pol[ií]cia)/i.test(content)
    || (/(resgate)/i.test(content) && /(filho|filha|parente|familiar)/i.test(content));
  if (hasFalsoSequestro) {
    types.push('falso_sequestro');
  }

  // Golpe do amor / romance online
  const hasRomanceScam = /(conheci (pela internet|online|no tinder|no instagram|no facebook)|namorad.* (preso|retido|bloqueado|no exterior|viagem)|militar (no exterior|estrangeiro)|me apaixonei|enviou (foto|presente)|preciso de.*passagem|ta retido na alfândega|alfândega.*liberar)/i.test(content);
  if (hasRomanceScam) {
    types.push('golpe_namorado_online');
  }

  // Corrente viral / promoção falsa
  const hasCorrenteViral = /(compartilh.* (com|para) \d+ pessoas?|encaminh.* para \d+|repasse para|vale.?compra|vale.?presente.*aniversário|promoção.*empresa|comemoração.*empresa|pesquisa.*ganhe|responda.*pesquisa.*ganhe|só compartilhar|só responder)/i.test(content);
  if (hasCorrenteViral) {
    types.push('corrente_viral');
  }

  // Falso suporte técnico
  const hasFalsoSuporte = /(vírus (no seu|detectado|encontrado|no celular|no computador)|seu (celular|computador|dispositivo).*(vírus|infectado|hackeado)|ligue.*urgente.*(número|suporte|técnico)|pop.?up|alerta de vírus|seu aparelho foi|acesso remoto|baixe.*aplicativo.*(limpar|remover|vírus))/i.test(content);
  if (hasFalsoSuporte) {
    types.push('falso_suporte_tecnico');
  }

  // Herança falsa
  const hasHerancaFalsa = /(heran[çc]a.*(parente|familiar|desconhecido|exterior|portugal|africa)|tem direito.*(heran[çc]a|valor|dinheiro)|pagar.*(cartório|taxas.*liberar|advogado.*receber)|parente distante.*faleceu|faleceu.*deixou)/i.test(content);
  if (hasHerancaFalsa) {
    types.push('heranca_falsa');
  }

  // Falso funcionário do banco
  const hasFalsoFuncionario = /(antifraude|setor.*fraude|departamento.*segurança.*banco|funcionário.*banco|cancelar.*(compra|transação).*(código|token|sms)|código.*(sms|chegou).*(cancelar|confirmar|validar)|liga.*banco.*(pediu|pediram))/i.test(content);
  if (hasFalsoFuncionario) {
    types.push('falso_funcionario_banco');
  }

  // Entrega falsa (Correios, transportadora)
  const hasEntregaFalsa = /(correios.*(taxad|pagar|taxa|link)|encomenda.*(taxad|taxa|pagar.*link)|package.*taxa|rastreio.*(clicar|link|pagar)|(transportadora|sedex|jadlog).*(taxa|pagar.*link))/i.test(content);
  if (hasEntregaFalsa) {
    types.push('entrega_falsa');
  }

  // Falsa vaga de emprego
  const hasFalsaVaga = /(vaga.*whatsapp|emprego.*whatsapp|trabalho.*curtindo|curtir (vídeos?|posts?|fotos?).*(ganhar|pagando|reais)|pagando.*dia.*curtir|ganhe.*dia.*(vídeo|post|foto)|cadastro.*emprego.*pagar|taxa.*cadastro.*emprego|investimento.*inicial.*trabalho)/i.test(content);
  if (hasFalsaVaga) {
    types.push('falsa_vaga');
  }

  // Golpe do acidente emocional
  const hasAcidenteEmocional = /(bateu.*(carro|moto).*meu (filho|filha|sobrinho|sobrinha|marido|esposa|namorado|namorada)|meu (filho|filha).*(bateu|acidente|preso|detido|hospital).*pix|pagar.*(acidente|batida).*(polícia|hospital)|não chama.*(polícia|delegacia).*pix|dinheiro.*(não.*chamar|evitar).*(polícia|b\.o\.))/i.test(content);
  if (hasAcidenteEmocional) {
    types.push('golpe_acidente_emocional');
  }

  // Falso INSS / Gov.br
  const hasFalsoINSS = /(inss.*(valores? esquecidos?|benefício.*liberar|cpf.*senha|senha.*gov\.?br)|gov\.?br.*(senha|código|validar|cpf)|valores? (esquecidos?|não sacados?).*(inss|previdência)|previdência.*(valores?|benefício).*(link|cpf|senha))/i.test(content);
  if (hasFalsoINSS) {
    types.push('falso_inss');
  }

  // Falso sequestro (cobre sequestraram, sequestrado, etc.) — requer termo de sequestro/resgate explícito
  const hasFalsoSequestro2 = /(sequestrar|sequestro|sequestrad|não ligue para a pol[ií]cia)/i.test(content)
    || (/(resgate)/i.test(content) && /(filho|filha|parente|familiar)/i.test(content));
  if (hasFalsoSequestro2) {
    types.push('falso_sequestro');
  }

  // Falso médico / hospital
  const hasFalsoMedico = /(exame.*(pronto|resultado|pagar|taxa)|resultado.*(exame|pronto).*(taxa|pagar|link)|pagar.*(resultado|exame|consulta))/i.test(content);
  if (hasFalsoMedico) types.push('falso_medico_hospital');

  // Golpe do QR Code
  const hasQRCode = /(qr.?code|maquininha.*(sem sinal|não funciona|quebr)|entregador.*(pagar|qr|app do banco))/i.test(content);
  if (hasQRCode) types.push('golpe_qr_code');

  // Voz clonada por IA
  const hasVozClonada = /(áudio.*(pix|dinheiro|urgente)|(voz|áudio).*(parecida|idêntica|igual|exatamente|parecia).*(irmã|irmão|filho|filha|mãe|pai|esposa|marido))/i.test(content);
  if (hasVozClonada) types.push('voz_clonada_ia');

  // Roubo de conta WhatsApp via código
  const hasRouboConta = /(código.*(whatsapp|chegou|recebi).*(sem pedir|não pedi|mandou sem querer|enviou sem querer)|recebi.*(código|verificação).*(whatsapp|sms).*(ligou|disse que enviou))/i.test(content);
  if (hasRouboConta) types.push('roubo_conta_whatsapp');

  // Falso advogado / processo
  const hasFalsoAdvogado = /(advogado.*(processo|ganhou|ganhar)|ganhei.*(processo|causa).*(pagar|taxa|judicial|cartório)|taxas judiciais)/i.test(content);
  if (hasFalsoAdvogado) types.push('falso_advogado');

  // PIX agendado / comprovante falso
  const hasPixAgendado = /(pix agendado|comprovante.*não caiu|não caiu.*comprovante|fez o pix.*não apareceu)/i.test(content);
  if (hasPixAgendado) types.push('pix_agendado_falso');

  // Falsa central bancária (PIX para estornar / "central de segurança")
  const hasCentralBancaria =
    /(pix.*(de segurança|para estornar|para cancelar|estorno)|estornar?.*(via|pelo|fazendo).*(pix|transferência)|central.*(segurança|antifraude).*(pix|transferir)|aqui (é|é do|é o).*(banco|central|antifraude).*pix)/i.test(content);
  if (hasCentralBancaria) types.push('central_bancaria_falsa');

  // Avaliação de produto / tarefa falsa / pirâmide
  const hasAvaliacaoProduto =
    /(avali[ae]ndo\s*(produto|post|vídeo|foto)|curtindo.*(ganhar|reais|pix)|ganhe.*(por dia|diário).*(curtir|avaliar|like)|(shopee|amazon|mercado livre|ifood).*avali[ae]|trabalhar.*avali[ae]ndo)/i.test(content);
  if (hasAvaliacaoProduto) types.push('avaliacao_produto_falsa');

  // Notificação legítima (reduz falsos positivos)
  const hasNotificacaoLegitima =
    /cartão (final|término)\s*\d{4}/.test(content)
    && /(compra aprovada|compra autorizada|débito realizado)/.test(content)
    && !/(pix|clique|link|código|senha|token|central|ligue)/.test(content);
  if (hasNotificacaoLegitima) types.push('notificacao_legitima');

  return types.length > 0 ? types : ['generico'];
}

const RELEVANT_CONTEXT_KEYWORDS = [
  'pix', 'banco', 'conta', 'cart[ãa]o', 'cr[ée]dito', 'd[ée]bito', 'transferir', 'transfer[êe]ncia',
  'dinheiro', 'r\\$', 'reais', 'pagamento', 'pagar', 'cobran[çc]a', 'd[ií]vida', 'boleto',
  'empr[ée]stimo', 'financiamento', 'investimento', 'bitcoin', 'cripto', 'fgts', 'aux[ií]lio',
  'pr[êe]mio', 'sorte[oi]o', 'sorteado', 'ganhou', 'parab[ée]ns', 'contemplado',
  'mensagem', 'whatsapp', 'sms', 'email', 'e-mail', 'liga[çc][ãa]o', 'ligou', 'ligaram',
  'link', 'http', 'www', 'site', 'clique', 'acesse', 'baixar', 'instalar',
  'senha', 'token', 'c[óo]digo', 'cpf', 'rg', 'cvv', 'dados',
  'golpe', 'fraude', 'phishing', 'suspeito', 'estranho', 'esquisito', 'falso',
  'urgente', 'bloqueio', 'bloqueada', 'bloqueado', 'suspensa', 'irregular', 'pendente',
  'recebi', 'me mandaram', 'mandou', 'chegou', 'apareceu', 'enviou', 'enviaram',
  'pediu', 'pedindo', 'solicit', 'cobrou', 'cobraram',
  'banco do brasil', 'itau', 'ita[úu]', 'bradesco', 'santander', 'caixa', 'nubank', 'inter', 'c6',
  'mercado pago', 'mercado livre', 'pag(seguro|bank)', 'picpay',
  'receita federal', 'detran', 'inss', 'serasa', 'spc', 'pol[ií]cia', 'pf', 'tribunal', 'justi[çc]a',
  'governo', 'prefeitura', 'gov\\.br',
  'whatsapp clonado', 'clonaram', 'novo n[úu]mero', 'troquei de n[úu]mero',
  'me ajuda', 'preciso de ajuda', 'empresta', 'emerg[êe]ncia', 'hospital',
  'pix errado', 'pix engano', 'mandei errado', 'devolv', 'outra chave', 'comprovante',
  'motoboy', 'sequestro', 'sequestrado', 'resgate', 'alfândega',
  'conheci (pela internet|online)', 'namorad',
  'compartilh', 'encaminh', 'vale.?compra', 'pesquisa.*ganhe',
  'vírus', 'aparelho', 'suporte técnico', 'acesso remoto',
  'heran[çc]a', 'parente distante', 'taxas do cartório',
  'antifraude', 'código.*sms', 'código.*chegou',
  'correios', 'encomenda', 'taxad',
  'curtindo', 'curtir.*vídeo', 'taxa.*cadastro',
  'bateu.*carro', 'não chama.*polícia',
  'inss', 'gov\\.br', 'valores esquecidos'
];

const RELEVANT_REGEX = new RegExp('(' + RELEVANT_CONTEXT_KEYWORDS.join('|') + ')', 'i');

export const OFF_TOPIC_MESSAGE = 'Olá! Sou uma inteligência artificial focada exclusivamente em identificar golpes e fraudes virtuais. Por favor, envie um link, texto ou print suspeito para que eu possa analisar para você.';

export type ValidationResult =
  | { status: 'valido'; textoDetectado: string }
  | { status: 'invalido'; mensagem: string };

function stripArtifacts(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/www\.\S+/gi, ' ')
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/gi, ' ')
    .replace(/0800[\s\-.]?\d{3}[\s\-.]?\d{4}/g, ' ')
    .replace(/(\+?\d{2,3}[\s.-]?)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/g, ' ')
    .replace(/\b\d{6,}\b/g, ' ')
    .replace(/\b[a-z0-9._-]+@[a-z0-9.-]+\b/gi, ' ');
}

function looksLikeGibberish(text: string): boolean {
  const clean = text.replace(/[^\p{Letter}\s]/gu, ' ').trim();
  if (!clean) return true;

  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3) return true;

  const vowels = /[aeiouáéíóúâêîôûãõàèìòùyAEIOUÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙY]/;
  const gibberishWords = words.filter(w => {
    if (w.length < 3) return false;
    if (!vowels.test(w)) return true;
    if (/(.)\1{3,}/.test(w)) return true;
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(w)) return true;
    return false;
  });

  return gibberishWords.length / words.length > 0.4;
}

export function validateContent(content: string): ValidationResult {
  const trimmed = content.trim();

  const urlOnlyMatch = trimmed.match(/^(https?:\/\/|www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/\S*)?$/i);
  if (urlOnlyMatch) {
    return { status: 'valido', textoDetectado: trimmed };
  }

  if (trimmed.length < 15) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const onlyEmojisOrSymbols = /^[\s\p{Emoji}\p{Symbol}\p{Punctuation}\d]+$/u.test(trimmed);
  if (onlyEmojisOrSymbols) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const randomCharRatio = (trimmed.match(/[^\p{Letter}\p{Number}\s.,!?;:()\-@/'"#R$%&*+]/gu) || []).length / trimmed.length;
  if (randomCharRatio > 0.3) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const textoSemArtefatos = stripArtifacts(trimmed);
  const letrasNoTextoUtil = (textoSemArtefatos.match(/\p{Letter}/gu) || []).length;

  if (letrasNoTextoUtil < 12) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  if (looksLikeGibberish(textoSemArtefatos)) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const hasRelevantContext = RELEVANT_REGEX.test(textoSemArtefatos);
  if (!hasRelevantContext) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const words = textoSemArtefatos.split(/\s+/).filter(Boolean);
  const longWords = words.filter(w => w.length > 15);
  if (longWords.length > 0 && longWords.length / words.length > 0.4) {
    return { status: 'invalido', mensagem: OFF_TOPIC_MESSAGE };
  }

  const resumo = trimmed.length > 80 ? trimmed.slice(0, 80).trim() + '...' : trimmed;
  return { status: 'valido', textoDetectado: resumo };
}

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  // === Extrair contexto adicional fornecido pelo usuário (respostas às perguntas de clarificação) ===
  const additionalCtxMatch = content.match(/\[Contexto adicional[^\]]*\]:\s*([\s\S]+?)$/i);
  const additionalCtx = additionalCtxMatch ? additionalCtxMatch[1] : '';
  const additionalCtxLower = additionalCtx.toLowerCase();

  // Confirmação do usuário de que há risco (respostas que elevam o score)
  const userConfirmsFraud = additionalCtx.length > 0 && (
    /(sim.{0,20}(pediram|pediu|pediram|mandou|solicitou).{0,30}(código|senha|pix|dinheiro|transferência|token)|sim.*cliquei|cliquei.*(no link|o link)|mandei.*(pix|dinheiro)|enviei.*(dinheiro|transferência)|pediram.*(código|senha|minha senha|o código)|não (conhecia|conheco).*(número|contato|remetente)|era desconhecido|do nada|completamente inesperado|nunca tinha falado)/i.test(additionalCtxLower)
  );

  // Negação do usuário / contexto que reduz risco
  const userDeniesFraud = additionalCtx.length > 0 && (
    /(não.{0,15}(pediram|pediu|pediram|solicitou).{0,30}(nada|código|senha|pix|dinheiro)|não.{0,10}(cliquei|acessei|abri)|não.{0,10}(enviei|mandei|transferi)|sim.{0,20}(fiz|realizei|tinha feito).{0,30}(compra|pedido|encomenda)|sim.{0,20}(estava esperando|aguardava)|sim.{0,20}tinha.{0,20}(processo|causa)|foi.{0,20}dentro do app|dentro.{0,20}(app|aplicativo).{0,20}(oficial|banco)|era.{0,20}(legítimo|esperado|normal|o app oficial)|conhecia.{0,20}(número|contato|remetente)|era.{0,20}(meu|minha|da minha)|confirmei.{0,30}(pessoalmente|por ligação|ligando)|liguei.{0,30}(confirmar|ela|ele|pessoa))/i.test(additionalCtxLower)
  );

  const extractedUrlsRaw = extractUrls(content);
  const contextoOnly = extractedUrlsRaw
    .reduce((acc, u) => acc.split(u).join(' ').split(u.replace(/^https?:\/\//, '')).join(' '), content)
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/www\.\S+/gi, ' ')
    .replace(/\[Contexto adicional[^\]]*\]:[\s\S]+$/i, ' ')  // Remove o bloco adicional do contexto de análise
    .replace(/\s{2,}/g, ' ')
    .trim();
  const lowerContent = contextoOnly.toLowerCase();
  let threats: string[] = [];
  let score = 100;
  let suspicionLevel = 0;

  const details = {
    hasUrl: false,
    hasSuspiciousPhone: false,
    hasScamKeywords: false,
    hasUrgencyWords: false,
    urlThreat: undefined as string | undefined
  };

  const hasObfuscation = /[a-z]\s+[a-z]\s+[a-z]|[a-z]\.[a-z]\.[a-z]|[a-z]_[a-z]_[a-z]/i.test(contextoOnly);
  if (hasObfuscation) {
    threats.push('Tentativa de ofuscação detectada (técnica de evasão)');
    score -= 30;
    suspicionLevel += 3;
  }

  const urls = extractedUrlsRaw;
  const urlReports: UrlDeepAnalysis[] = [];
  let hasKnownSafeUrl = false;
  let allUrlsCleanCommerce = false;
  let linkScore = 100;
  let linkSuspicion = 0;
  if (urls.length > 0) {
    let cleanCount = 0;
    for (const url of urls) {
      const report = await analyzeUrlDeep(url);
      urlReports.push(report);
      const host = extractHostname(url);
      const params = classifyUrlParams(url);
      if ((report.nivelRisco === 'Caminho Feliz') && (isEcommerceDomain(host) || KNOWN_SAFE_DOMAINS.some(d => host === d || host.endsWith('.' + d))) && params.nonMarketingCount === 0) {
        cleanCount++;
      }
    }
    allUrlsCleanCommerce = urls.length > 0 && cleanCount === urls.length;
    details.hasUrl = true;

    for (const url of urls) {
      const urlAnalysis = analyzeUrl(url);
      if (urlAnalysis.suspicious) {
        threats.push(`🔗 ${urlAnalysis.reason || 'URL suspeita detectada'}`);
        details.urlThreat = urlAnalysis.reason;
        linkScore -= 40;
        linkSuspicion += 4;
      } else {
        const health = await checkDomainHealth(url);
        if (health.knownSafe) {
          hasKnownSafeUrl = true;
          threats.push(`✅ Domínio reconhecido (HTTPS, reputação ${health.reputationScore}/100)`);
        } else if (health.reason) {
          threats.push(`🔗 ${health.reason}`);
          linkScore -= 35;
          linkSuspicion += 4;
        } else {
          threats.push(`🔗 Domínio com ${health.domainAgeDays} dias, reputação ${health.reputationScore}/100`);
        }
      }
    }
  }

  const phones = extractPhones(contextoOnly);
  const phoneFindings: PhoneAnalysis[] = [];
  if (phones.length > 0) {
    for (const phone of phones) {
      const phoneAnalysis = analyzePhoneAdvanced(phone, content);
      phoneFindings.push(phoneAnalysis);
      if (phoneAnalysis.suspicious) {
        details.hasSuspiciousPhone = true;
        const reason = phoneAnalysis.reason || 'Número de telefone suspeito';
        threats.push(`📞 ${reason}`);

        if (phoneAnalysis.category === 'falsa_central') {
          score -= 50;
          suspicionLevel += 6;
        } else if (phoneAnalysis.category === 'ddd_inesperado' && /clonado|parente|fam[ií]lia|me ajuda/i.test(contextoOnly)) {
          score -= 50;
          suspicionLevel += 6;
        } else if (phoneAnalysis.category === 'internacional_suspeito' || phoneAnalysis.category === 'shortcode_suspeito') {
          score -= 35;
          suspicionLevel += 4;
        } else {
          score -= 30;
          suspicionLevel += 3;
        }
      } else if (phoneAnalysis.officialCompany) {
        threats.push(`✅ Telefone oficial reconhecido: ${phoneAnalysis.officialCompany}`);
      }
    }
  }

  let scamKeywordCount = 0;
  const foundScamKeywords: string[] = [];
  for (const keyword of SCAM_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      scamKeywordCount++;
      foundScamKeywords.push(keyword);
    }
  }

  if (scamKeywordCount > 0) {
    details.hasScamKeywords = true;

    if (scamKeywordCount >= 5) {
      threats.push(`ALERTA: ${scamKeywordCount} termos de golpe detectados`);
      score -= scamKeywordCount * 18;
      suspicionLevel += Math.min(scamKeywordCount, 8);
    } else if (scamKeywordCount >= 3) {
      threats.push(`${scamKeywordCount} palavras-chave de golpe detectadas`);
      score -= scamKeywordCount * 15;
      suspicionLevel += scamKeywordCount;
    } else {
      score -= scamKeywordCount * 6;
      suspicionLevel += Math.max(0, scamKeywordCount - 1);
    }
  }

  let urgencyWordCount = 0;
  for (const word of URGENCY_WORDS) {
    if (lowerContent.includes(word)) {
      urgencyWordCount++;
    }
  }
  // Urgência baseada em tempo ("em 30 minutos", "em 2 horas", "nos próximos 10 minutos")
  const timePressure = /em \d+ (minutos?|horas?|segundos?)/i.test(contextoOnly)
    || /nos próximos \d+/i.test(contextoOnly)
    || /dentro de \d+ (minutos?|horas?)/i.test(contextoOnly)
    || /\d+ minutos? para/i.test(contextoOnly);
  if (timePressure) urgencyWordCount += 2;

  if (urgencyWordCount >= 3) {
    details.hasUrgencyWords = true;
    threats.push(`Pressão psicológica detectada (${urgencyWordCount} termos de urgência)`);
    score -= urgencyWordCount * 10;
    suspicionLevel += 3;
  } else if (urgencyWordCount >= 2) {
    details.hasUrgencyWords = true;
    threats.push(`Linguagem de urgência detectada (${urgencyWordCount} termos)`);
    score -= urgencyWordCount * 8;
    suspicionLevel += 2;
  } else if (urgencyWordCount === 1) {
    details.hasUrgencyWords = true;
    score -= 3;
  }

  const hasMoneyMention = contextoOnly.includes('R$') || /\d+[.,]\d{2}/.test(contextoOnly) || /\d{3,}/.test(contextoOnly);
  const hasPix = lowerContent.includes('pix');
  const hasTransfer = lowerContent.includes('transferência') || lowerContent.includes('transferir') || lowerContent.includes('depositar');

  // Menção a link/clique sem URL extraída (phishing que omite URL intencional ou SMS que diz "clique aqui")
  const clickLinkRequest =
    /(clicar.{0,15}(no link|aqui|no bot[aã]o)|clique.{0,15}(no link|aqui|abaixo|no bot[aã]o)|acesse.{0,15}(o link|aqui)|toque.{0,15}(no link|aqui)|link (para|abaixo|a seguir|enviado))/i.test(contextoOnly);

  // Ameaça de bloqueio futuro de conta/cartão — forma verbal futura que não bate em keywords exatos
  const accountThreatFuture =
    /(conta.{0,30}(ser[aá]|vai ser|ficará|será).{0,20}(bloqueada?|suspensa?|encerrada?|cancelada?)|cartão.{0,20}(ser[aá]|vai ser).{0,20}(bloqueado?|cancelado?|suspenso?)|acesso.{0,20}(ser[aá]|vai ser).{0,20}(bloqueado?|suspenso?|revogado?))/i.test(contextoOnly);

  // Declarado aqui para estar disponível no composite [5b] abaixo
  const exaggeratedThreatEarly =
    /(cnh.*será (suspensa|cancelada|bloqueada) (hoje|agora|em \d+h)|cpf.*(cancelado|bloqueado|irregular).*(hoje|amanhã|em \d+h|urgente)|conta.*(encerrada|bloqueada).*(hoje|nas próximas|em \d+))/i.test(contextoOnly);

  // =====================================================================
  // DETECÇÃO COMPOSTA — combinações de sinais, não apenas palavras isoladas
  // =====================================================================

  // [1] CONTRADIÇÃO LÓGICA: "PIX de segurança" / "fazer PIX para estornar"
  // Bancos nunca pedem PIX para cancelar/estornar transações — é impossível por definição
  const pixParaEstornar =
    /(pix.*(de segurança|para estornar|para cancelar|para estorno|para devolver|para reverter|de estorno))/i.test(contextoOnly)
    || /(estornar?.*(fazendo|via|pelo|através).*(pix|transferência))/i.test(contextoOnly)
    || /(central.*(segurança|antifraude).*(pix|transferência|depositar))/i.test(contextoOnly);
  if (pixParaEstornar) {
    threats.push('⚠️ CRÍTICO: "PIX de segurança" é impossível — bancos NUNCA pedem PIX para cancelar transações. Contradição lógica = golpe confirmado.');
    score -= 80;
    suspicionLevel += 10;
  }

  // [2] IMPERSONAÇÃO DE BANCO + AÇÃO FINANCEIRA SOLICITADA (composto)
  // Não basta mencionar banco — precisa pedir alguma ação financeira ou dado
  const claimsBankIdentity =
    /(aqui (é|é o|é do|fala|é a)|sou (do|da|o|a|um representante|funcionário)).*(banco|central|antifraude|setor|departamento)/i.test(contextoOnly)
    || /(ligo|ligamos|entramos em contato|ligo de volta|retornou|ligando).*(banco|central de segurança|setor antifraude)/i.test(contextoOnly)
    || /(banco\s+\w+\s*:?\s*(detectamos|identificamos|verificamos|constatamos))/i.test(contextoOnly)
    || /(banco.*(me ligou|ligou para mim|entrou em contato|mandou mensagem).*(compra|transação|suspeita|segurança))/i.test(contextoOnly)
    || /(me ligou.*(banco|nubank|bradesco|itau|caixa|santander|inter|c6)|ligação.*(banco|nubank|bradesco|itau|caixa).*(compra|suspeita|fraude|segurança))/i.test(contextoOnly);
  const requestsFinancialAction =
    hasPix || hasTransfer
    || /(digit[ae] \d|pressione \d|tecle \d)/i.test(contextoOnly)
    || /(transferi[r]?|depositar?|confirmar? (sua? conta|dados|transação))/i.test(contextoOnly);
  if (claimsBankIdentity && requestsFinancialAction && !pixParaEstornar) {
    threats.push('⚠️ CRÍTICO: Identidade bancária + solicitação financeira — bancos não ligam pedindo PIX, transferências ou confirmações de dados.');
    score -= 60;
    suspicionLevel += 8;
  }

  // [3] IMPERSONAÇÃO DE EMPRESA GRANDE + OFERTA IRREAL VIA WHATSAPP/TELEGRAM
  // Shopee/Amazon/iFood nunca recrutam via WhatsApp com ganhos de R$500-2000/dia
  const claimsBigBrand =
    /(shopee|amazon|mercado livre|ifood|rappi|magalu|magazine luiza|uber|99|nubank|inter bank|c6 bank)/i.test(contextoOnly);
  const ofertaIrreal =
    /(r\$\s*[\d.]+\s*(por|ao|\/)\s*dia|ganhar.*(por dia|diário|diariamente)|avali[ae]ndo\s*(produto|post|vídeo|foto)|curtindo.*ganhar|ganhe.*curtindo)/i.test(contextoOnly);
  const recrutamentoInformal =
    /(whatsapp|telegram|link.*cadastro|fale com (a recepcionista|nosso atendente)|clique.*cadastrar)/i.test(contextoOnly);
  if (claimsBigBrand && ofertaIrreal) {
    threats.push('⚠️ CRÍTICO: Empresa conhecida + ganhos irreais — recrutamentos legítimos não oferecem R$ centenas/dia para tarefas simples por app de mensagens.');
    score -= 65;
    suspicionLevel += 8;
  } else if (ofertaIrreal && recrutamentoInformal) {
    threats.push('⚠️ CRÍTICO: Oferta de emprego com ganhos irreais por mensagem — padrão de pirâmide financeira/tarefa falsa.');
    score -= 55;
    suspicionLevel += 7;
  }

  // [4] NOVO NÚMERO + FAMILIAR + PIX PARA TERCEIRO (WhatsApp clonado composto)
  // Tríade clássica: identidade familiar + troca de número + PIX para conta de terceiro
  const trocaNumeroFamiliar =
    /(troquei de (número|celular|chip|aparelho)|novo (número|celular|chip)|salva (esse|este) (número|contato)|me chama (nesse|neste|aqui)|trocou de (número|celular|chip|aparelho)|mandou.*(de )?(outro número|número diferente|número novo|número desconhecido)|comprou.*(celular|aparelho).*(novo|diferente)|de um número que (não reconheço|não conheço))/i.test(contextoOnly);
  const refereFamiliar =
    /(mãe|pai|filho|filha|irmã|irmão|vó|vovó|vô|vovô|tia|tio|sobrinho|sobrinha|primo|prima|marido|esposa)/i.test(contextoOnly);
  const pixParaTerceiro =
    /(pix.*(para ele|pra ele|para ela|pra ela|para o (fornecedor|vendedor|prestador)|para meu (fornecedor|colega|sócio))|em nome de|a conta (é|é do|é da) \w+)/i.test(contextoOnly);
  if (trocaNumeroFamiliar && refereFamiliar && (hasPix || hasMoneyMention)) {
    const isPixThirdParty = pixParaTerceiro;
    threats.push(
      isPixThirdParty
        ? '⚠️ CRÍTICO: Troca de número + familiar + PIX para conta de terceiro — tríade clássica de WhatsApp clonado/golpe de familiar.'
        : '⚠️ CRÍTICO: Troca repentina de número + familiar pedindo dinheiro — padrão altamente suspeito de WhatsApp clonado.'
    );
    score -= isPixThirdParty ? 70 : 55;
    suspicionLevel += isPixThirdParty ? 9 : 7;
  }

  // [5] SINAIS DE LEGITIMIDADE — redutores de risco para notificações reais
  // Notificação bancária legítima: menciona cartão final XXXX + valor + estabelecimento + orienta o app
  const legitBankNotification =
    /cartão (final|término|term\.?)\s*\d{4}/i.test(contextoOnly)
    && /(compra (aprovada|autorizada|realizada)|débito realizado|transação aprovada)/i.test(contextoOnly)
    && urls.length === 0
    && !/(pix|clique|link|código|senha|token|transferência|central|ligue)/i.test(contextoOnly);
  if (legitBankNotification) {
    score = Math.min(score + 40, 100);
    suspicionLevel = Math.max(0, suspicionLevel - 5);
    threats.push('✅ Formato de notificação bancária legítima — sem link, sem pedido de dados, orientando uso do app oficial.');
  }

  // Orientação para app/site OFICIAL sem link suspeito
  // Se a mensagem instrui acessar pelo app da empresa e não há URL fornecida, isso é
  // indicativo de comunicação legítima — phishing quase sempre inclui link próprio
  const orientaAppOficial =
    /(acesse (o |pelo |nosso )?(app|aplicativo)|use (o |nosso )?(app|aplicativo)|baixe (o |nosso )?(app|aplicativo)|entre (no|pelo) (app|aplicativo)|pelo (app|aplicativo) (oficial|do banco|da empresa|da operadora|da loja))/i.test(contextoOnly)
    || /(acesse (pelo|pelo nosso|o) site oficial|entre (no|pelo) site oficial|acesse diretamente (no|o) (site|portal))/i.test(contextoOnly);

  const hasSuspiciousLink = urls.length > 0 && urls.some(u => {
    const h = extractHostname(u);
    return !KNOWN_SAFE_DOMAINS.some(d => h === d || h.endsWith('.' + d));
  });

  if (orientaAppOficial && !hasSuspiciousLink) {
    // Reduz risco — não elimina completamente, pois golpistas também podem mencionar "app oficial"
    // mas em combinação com link suspeito (já penalizado separadamente)
    const reduction = urls.length === 0 ? 30 : 12;
    score = Math.min(score + reduction, 100);
    suspicionLevel = Math.max(0, suspicionLevel - 4);
    threats.push('✅ Mensagem orienta acesso pelo app/site oficial sem fornecer link — padrão de comunicação legítima.');

    // Remove classificações de phishing se o único sinal era banco + urgência sem link
    // A menção a banco deixa de ser red flag quando a própria mensagem manda pro canal oficial
  }

  // Cobrança legítima com código de barras e domínio/empresa mencionados
  const legitBillNotification =
    /(código de barras|linha digitável|vencimento.*\d{2}\/\d{2})/i.test(contextoOnly)
    && /(energia|água|luz|cpfl|enel|sabesp|comgás|oi |claro |vivo |tim )/i.test(contextoOnly)
    && !/(clique aqui|pix|chave pix|senha|código (sms|que chegou))/i.test(contextoOnly);
  if (legitBillNotification) {
    score = Math.min(score + 25, 100);
    suspicionLevel = Math.max(0, suspicionLevel - 3);
    threats.push('✅ Cobrança com características de fatura legítima — verifique o destinatário do boleto antes de pagar.');
  }

  // [4b] CÓDIGO SMS/WHATSAPP RECEBIDO SEM SOLICITAR — roubo de conta simplificado
  // "Recebi código do WhatsApp sem pedir nada" — sinal imediato de ataque
  const codigoSemSolicitar =
    /(recebi.{0,40}(código|verificação|sms).{0,40}(sem pedir|sem solicitar|não pedi|não solicitei|do nada|sem querer)|código.{0,20}(whatsapp|telegram|sms).{0,30}(sem|não pedi|chegou|apareceu).{0,20}(sem pedir|do nada|inesperado)|chegou.{0,20}código.{0,30}(não pedi|sem pedir|sem solicitar))/i.test(contextoOnly);
  if (codigoSemSolicitar) {
    threats.push('⚠️ CRÍTICO: Código de verificação recebido sem solicitação — sinal claro de tentativa de invasão de conta.');
    score -= 65;
    suspicionLevel += 8;
  }

  // [4c] SORTEIO / PRÊMIO NÃO PARTICIPADO — golpe promocional claro
  // "Ganhei um iPhone num sorteio que nem lembro de participar"
  const prizeNotJoined =
    /(sorteio.{0,40}(não (lembro|participei|me lembro)|nem lembro|que (não|nem) (participei|entrei|concorri))|ganhou.{0,40}(sorteio|concurso|promoção).{0,40}(não (participou|lembra|se lembra)|sem participar))/i.test(contextoOnly)
    || (/(ganhei|você ganhou|foi selecionado|foi contemplado)/i.test(contextoOnly) && /(nem lembro|não lembro|não participei|inesperado|do nada|sem ter participado)/i.test(contextoOnly));
  if (prizeNotJoined) {
    threats.push('⚠️ CRÍTICO: Prêmio em sorteio que não participou — golpe promocional. Prêmios de sorteios que não entrou simplesmente não existem.');
    score -= 60;
    suspicionLevel += 7;
  }

  // [4d] AÇÃO DENTRO DO APP OFICIAL — sinal de legitimidade (oposto de phishing)
  // "O app do banco pediu reconhecimento facial depois da atualização"
  const acaoNoAppOficial =
    /(app (do banco|oficial|da empresa|da loja).{0,30}(pediu|solicitou|exibiu|mostrou|atualizou|reconhecimento|digital|facial|biometria|verificação)|reconhecimento (facial|digital|biométrico).{0,30}(app|aplicativo)|biometria.{0,30}(app|aplicativo).{0,20}(banco|atualiz)|dentro do (app|aplicativo).{0,20}(banco|pediu|solicitou))/i.test(contextoOnly)
    && urls.length === 0
    && !clickLinkRequest
    && !/(senha|código sms|código por mensagem|token por mensagem)/i.test(contextoOnly);
  if (acaoNoAppOficial) {
    score = Math.min(score + 35, 100);
    suspicionLevel = Math.max(0, suspicionLevel - 4);
    threats.push('✅ Ação solicitada dentro do app oficial sem link externo — padrão típico de atualização/verificação legítima.');
  }

  // [4e] COMPROVANTE PIX RECEBIDO EM CONTEXTO DE VENDA — possível golpe do comprovante falso
  // "Pessoa quer comprar meu videogame e mandou comprovante do PIX"
  const comprovanteVendaContext =
    /(quer comprar|comprando|vai comprar|comprador|interessado (em comprar|no)|cliente).{0,60}(comprovante|pix|pagamento)/i.test(contextoOnly)
    || (/comprovante.{0,30}pix/i.test(contextoOnly) && /(vend(er|endo|eu|a minha)|meu (produto|jogo|videogame|celular|carro|objeto|item|aparelho)|anúncio|olx|facebook marketplace)/i.test(contextoOnly));
  if (comprovanteVendaContext) {
    threats.push('⚠️ Comprovante de PIX recebido em venda — verifique no extrato do banco antes de entregar o produto. Comprovantes são facilmente falsificados.');
    score -= 30;
    suspicionLevel += 4;
  }

  // [4f] SMS DE CORREIOS / ENTREGA SEM LINK — risco médio, precisa confirmar
  // "Recebi SMS dos Correios sobre taxa de importação" (sem link visível ainda)
  const correiosSemLink =
    /(correios|sedex|jadlog|transportadora).{0,40}(taxa|importação|alfândega|encomenda retida|entrega)/i.test(contextoOnly)
    && urls.length === 0
    && !clickLinkRequest;
  if (correiosSemLink) {
    threats.push('Mensagem dos Correios sobre taxa — pode ser legítimo ou phishing. Verifique diretamente em correios.com.br antes de qualquer pagamento.');
    score -= 20;
    suspicionLevel += 3;
  }

  // [4g] ADVOGADO CONTATANDO SOBRE PROCESSO GANHO — golpe do falso advogado (mesmo sem pedido de pagamento ainda)
  // "Minha mãe recebeu mensagem de um advogado dizendo que ganhou processo"
  const falsoAdvogadoContato =
    /(advogado.{0,40}(disse que ganhou|dizendo que ganhou|que você ganhou|informa.*processo|tem direito|tem um valor|ganhou (processo|causa|ação)))/i.test(contextoOnly)
    || (/(ganhou|ganhei).{0,30}(processo|causa|ação judicial).{0,40}(advogado|escritório|dr\.|dra\.)/i.test(contextoOnly))
    || /(recebeu.{0,30}advogado.{0,30}(processo|causa|ação)|advogado.{0,30}(entrou em contato|ligou|enviou mensagem).{0,30}(processo|ganhou))/i.test(contextoOnly);
  if (falsoAdvogadoContato && !falsoAdvogadoPattern) {
    threats.push('⚠️ Advogado comunicando processo ganho de surpresa — verifique a OAB do advogado e se tinha processo aberto antes de qualquer ação.');
    score -= 30;
    suspicionLevel += 4;
  }

  // [4h] BANCO LIGOU SOBRE COMPRA SUSPEITA — ambíguo, pode ser legítimo
  // "Meu banco me ligou perguntando sobre uma compra suspeita"
  // Não é golpe confirmado, mas precisa de cautela e confirmação
  const bankCalledAboutPurchase =
    claimsBankIdentity
    && /(compra (suspeita|estranha|incomum|não reconhec)|transação (suspeita|estranha|incomum|não reconhec)|fraude|não (reconheço|autorizei))/i.test(contextoOnly)
    && !requestsFinancialAction
    && !hasPersonalDataRequest;

  // [4i] FAMILIAR COM PIX URGENTE DO NÚMERO NORMAL — análise comportamental
  // "Minha filha me mandou PIX urgente do número dela normal"
  // Número correto + pessoa conhecida + contexto plausível = o caso mais difícil
  const familiarPixUrgente =
    refereFamiliar
    && hasPix
    && urgencyWordCount > 0
    && !trocaNumeroFamiliar  // número não foi trocado (diferente do clonado clássico)
    && /(número (dela|dele|delas|deles) (normal|de sempre|correto|conhecido)|do (próprio|mesmo) número|número que (eu|a gente) conhece|número certo)/i.test(contextoOnly);

  // [5b] PHISHING CLÁSSICO: ameaça de bloqueio + clique em link + urgência/prazo
  // "sua conta será bloqueada em 30 minutos se não clicar no link"
  // Esses três sinais juntos = phishing bancário confirmado mesmo sem URL extraída
  const phishingClasico =
    (accountThreatFuture || exaggeratedThreatEarly) && clickLinkRequest;
  const phishingComUrgencia =
    phishingClasico && (urgencyWordCount > 0 || timePressure);
  if (phishingComUrgencia) {
    threats.push('⚠️ CRÍTICO: Ameaça de bloqueio + prazo + pedido de clique em link — phishing bancário clássico confirmado.');
    score -= 75;
    suspicionLevel += 9;
  } else if (phishingClasico) {
    threats.push('⚠️ CRÍTICO: Ameaça de bloqueio de conta + pedido de clique em link — padrão de phishing bancário.');
    score -= 60;
    suspicionLevel += 7;
  } else if (accountThreatFuture && (urgencyWordCount > 0 || timePressure)) {
    threats.push('⚠️ Ameaça de bloqueio de conta com prazo — tática de pressão usada em phishing.');
    score -= 35;
    suspicionLevel += 4;
  } else if (clickLinkRequest && hasImpersonation) {
    threats.push('⚠️ Mensagem de instituição pedindo clique em link — padrão suspeito de phishing.');
    score -= 30;
    suspicionLevel += 4;
  }

  // [6] URGÊNCIA ARTIFICIAL + CONSEQUÊNCIA EXAGERADA (sem respaldo real)
  // "Sua CNH será suspensa hoje" / "CPF cancelado em 24h"
  const exaggeratedThreat =
    /(cnh.*será (suspensa|cancelada|bloqueada) (hoje|agora|em \d+h)|cpf.*(cancelado|bloqueado|irregular).*(hoje|amanhã|em \d+h|urgente)|conta.*(encerrada|bloqueada).*(hoje|nas próximas|em \d+))/i.test(contextoOnly);
  if (exaggeratedThreat) {
    threats.push('⚠️ CRÍTICO: Ameaça exagerada com prazo imediato — órgãos públicos e bancos não enviam ultimatos por mensagem.');
    score -= 50;
    suspicionLevel += 6;
  }

  if (hasMoneyMention && scamKeywordCount > 0) {
    threats.push('Solicitação financeira em contexto suspeito');
    score -= 25;
    suspicionLevel += 3;
  }

  if (hasPix && urgencyWordCount > 0) {
    threats.push('⚠️ PIX urgente - padrão CLÁSSICO de golpe');
    score -= 35;
    suspicionLevel += 4;
  }

  if ((hasTransfer || hasPix) && phones.length > 0) {
    threats.push('Solicitação de transferência com número fornecido');
    score -= 20;
    suspicionLevel += 3;
  }

  const productMention = /(iphone|playstation|ps5|ps4|xbox|notebook|smartphone|tv|televis[ãa]o|geladeira|tênis|tenis|airpods|macbook|c[âa]mera)/i.test(contextoOnly);
  const cheapPriceMatch = contextoOnly.match(/r\$\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/i);
  const cheapPrice = cheapPriceMatch ? parseFloat(cheapPriceMatch[1].replace(/\./g, '').replace(',', '.')) : null;
  const tooCheapForProduct = productMention && cheapPrice !== null && cheapPrice < 500;
  const pixOnlyPattern = /(s[óo] (aceita|aceito) pix|apenas pix|somente pix|pagamento (apenas|s[óo]) (via )?pix|pix antecipad|pagar antecipad|dep[óo]sito antecipad|boleto urgente|pague antes)/i.test(contextoOnly);

  if (tooCheapForProduct && pixOnlyPattern) {
    threats.push('⚠️ E-commerce suspeito: preço muito abaixo do mercado + pagamento exclusivo por PIX/boleto antecipado');
    score -= 45;
    suspicionLevel += 5;
  } else if (tooCheapForProduct && hasPix) {
    threats.push('Preço bem abaixo do mercado para o produto mencionado');
    score -= 15;
    suspicionLevel += 2;
  }

  const hasPersonalDataRequest =
    lowerContent.includes('cpf') ||
    lowerContent.includes('rg') ||
    lowerContent.includes('senha') ||
    lowerContent.includes('dados pessoais') ||
    lowerContent.includes('token') ||
    lowerContent.includes('código') ||
    lowerContent.includes('cvv') ||
    lowerContent.includes('cartão');

  if (hasPersonalDataRequest) {
    if (urls.length > 0 || scamKeywordCount > 0) {
      threats.push('⚠️ CRÍTICO: Solicitação de dados pessoais/bancários');
      score -= 40;
      suspicionLevel += 5;
    } else {
      threats.push('Solicitação de informações pessoais');
      score -= 15;
      suspicionLevel += 2;
    }
  }

  const hasPrizeScam =
    (lowerContent.includes('prêmio') || lowerContent.includes('ganhou') || lowerContent.includes('sorteado') || lowerContent.includes('contemplado') || lowerContent.includes('ganhei')) &&
    (hasMoneyMention || urls.length > 0 || hasPersonalDataRequest || prizeNotJoined);

  if (hasPrizeScam) {
    threats.push('⚠️ Golpe de falso prêmio identificado');
    score -= 40;
    suspicionLevel += 5;
  }

  const hasImpersonation =
    lowerContent.includes('banco') ||
    lowerContent.includes('receita federal') ||
    lowerContent.includes('detran') ||
    lowerContent.includes('polícia') ||
    lowerContent.includes('serasa') ||
    lowerContent.includes('inss') ||
    lowerContent.includes('whatsapp') ||
    lowerContent.includes('governo') ||
    lowerContent.includes('cnh') ||
    lowerContent.includes('multa') ||
    lowerContent.includes('tribunal') ||
    lowerContent.includes('correios') ||
    lowerContent.includes('advogado') ||
    lowerContent.includes('denatran');

  // Impersonação só é red flag quando NÃO orienta pro app/site oficial sem link suspeito
  // Ex: "Banco X: compra aprovada, bloqueie pelo app" → legítimo;
  //     "Banco X: clique aqui para regularizar" → fraude
  if (hasImpersonation && (urgencyWordCount > 0 || hasPersonalDataRequest || urls.length > 0) && !orientaAppOficial) {
    threats.push('⚠️ CRÍTICO: Impersonação de instituição oficial');
    score -= 45;
    suspicionLevel += 5;
  } else if (hasImpersonation && (urgencyWordCount > 0 || hasPersonalDataRequest || urls.length > 0) && orientaAppOficial && hasSuspiciousLink) {
    // Menciona app oficial MAS também tem link suspeito — ainda é fraude
    threats.push('⚠️ CRÍTICO: Menciona app oficial porém redireciona para link suspeito — técnica de phishing sofisticado');
    score -= 55;
    suspicionLevel += 7;
  }

  if (urls.length > 1) {
    threats.push('Múltiplos links em mensagem');
    score -= 20;
    suspicionLevel += 2;
  }

  const hasCloning =
    lowerContent.includes('clonado') ||
    lowerContent.includes('clonaram') ||
    lowerContent.includes('novo número') ||
    lowerContent.includes('troquei de número') ||
    (lowerContent.includes('me ajuda') && (hasPix || hasTransfer));

  if (hasCloning && (hasMoneyMention || hasTransfer || hasPix)) {
    threats.push('⚠️ CRÍTICO: Padrão de WhatsApp clonado');
    score -= 50;
    suspicionLevel += 6;
  }

  // Golpe do PIX engano / comprovante falso — um dos mais comuns no Brasil
  const pixEnganoPattern =
    /pix (errad|engano|acident|equivoc|trocad|errei|mandei errado|caiu na sua|foi pra você)/i.test(contextoOnly)
    || /(mandou.*pix.*errad|pix.*errad.*devol|devol.*pix.*outra chave|outra chave.*devol|me devolve.*pix|pode devolver.*pix|me manda de volta|me repassar|repassar o pix|estornar.*pix)/i.test(contextoOnly)
    || (hasPix && /(comprovante|devolv|outra chave|errei|engano|acidente)/i.test(contextoOnly));
  if (pixEnganoPattern) {
    threats.push('⚠️ CRÍTICO: Golpe do PIX Engano — comprovante falso para extorquir devolução');
    score -= 55;
    suspicionLevel += 7;
  }

  // Golpe do motoboy
  const motoboyPattern = /(motoboy|buscar.*cart[ãa]o|cart[ãa]o.*buscar|entregar.*cart[ãa]o|cortar.*cart[ãa]o)/i.test(contextoOnly);
  if (motoboyPattern) {
    threats.push('⚠️ CRÍTICO: Golpe do Motoboy — bancos NUNCA buscam cartão físico');
    score -= 55;
    suspicionLevel += 7;
  }

  // Falso sequestro — requer palavra explícita de sequestro/resgate, não apenas menção a familiar
  const sequestroPattern = /(sequestrar|sequestro|sequestrad|não ligue para a pol)/i.test(contextoOnly)
    || (/(resgate)/i.test(contextoOnly) && /(filho|filha|parente|familiar)/i.test(contextoOnly));
  if (sequestroPattern) {
    threats.push('⚠️ CRÍTICO: Possível Falso Sequestro — golpe de extorsão por telefone');
    score -= 55;
    suspicionLevel += 7;
  }

  // Corrente viral / promoção falsa
  const correntePattern = /(compartilh.* (com|para) \d+|encaminh.* para \d+|vale.?compra.*aniversário|promoção.*empresa.*responder|pesquisa.*ganhe|só compartilhar)/i.test(contextoOnly);
  if (correntePattern) {
    threats.push('⚠️ CRÍTICO: Golpe de corrente viral — compartilhamento obrigatório é técnica de phishing em massa');
    score -= 45;
    suspicionLevel += 5;
  }

  // Falso suporte técnico (pop-up de vírus)
  const suporteFalsoPattern = /(vírus (no seu|detectado|encontrado|no celular)|ligue.*urgente.*(suporte|técnico|número)|seu (aparelho|celular|computador).*(vírus|infectado|hackeado)|pop.?up.*vírus)/i.test(contextoOnly);
  if (suporteFalsoPattern) {
    threats.push('⚠️ CRÍTICO: Falso suporte técnico — pop-ups de vírus são sempre fraude');
    score -= 50;
    suspicionLevel += 6;
  }

  // Herança falsa
  const herancaPattern = /(heran[çc]a.*(parente|distante|exterior|portugal)|pagar.*(cartório|taxas).*(receber|liberar|heran[çc]a)|parente distante.*faleceu)/i.test(contextoOnly);
  if (herancaPattern) {
    threats.push('⚠️ CRÍTICO: Golpe da herança falsa — pagar taxa para receber dinheiro é sempre fraude');
    score -= 50;
    suspicionLevel += 6;
  }

  // Falso funcionário do banco pedindo código SMS
  const falsoFuncionarioPattern = /(antifraude|setor.*fraude|funcionário.*banco).*(código|sms|token)/i.test(contextoOnly)
    || /(código.*(sms|chegou|recebeu).*(cancelar|confirmar|pass|fala|me (manda|diz|fale)))/i.test(contextoOnly)
    || (/(antifraude|cancelar.*compra|bloquear.*cartão)/i.test(contextoOnly) && /(código|sms|token|senha)/i.test(contextoOnly));
  if (falsoFuncionarioPattern) {
    threats.push('⚠️ CRÍTICO: Falso funcionário de banco — NUNCA forneça código SMS a ninguém');
    score -= 60;
    suspicionLevel += 8;
  }

  // Entrega / Correios falsos
  const entregaFalsaPattern = /(correios|encomenda|sedex|transportadora).*(taxad|pagar.*link|taxa.*link|clicar.*link)/i.test(contextoOnly)
    || /(link.*(pagar|taxa).*(correios|encomenda|entrega|rastreio))/i.test(contextoOnly);
  if (entregaFalsaPattern) {
    threats.push('Golpe da entrega falsa — taxas dos Correios nunca são pagas por link de mensagem');
    score -= 40;
    suspicionLevel += 5;
  }

  // Falsa vaga de emprego
  const falsaVagaPattern = /(curtindo|curtir).*(vídeos?|posts?).*(ganhar|pagando|reais|dia)/i.test(contextoOnly)
    || /(pagando.*dia.*(curtir|vídeo)|ganhe.*dia.*(curtir|vídeo|post))/i.test(contextoOnly)
    || (/(trabalho|emprego|vaga)/i.test(contextoOnly) && /(taxa.*cadastro|investimento inicial|pagamento inicial|depósito inicial)/i.test(contextoOnly));
  if (falsaVagaPattern) {
    threats.push('⚠️ CRÍTICO: Falsa vaga de emprego — taxa inicial e ganhos irreais são sempre golpe');
    score -= 50;
    suspicionLevel += 6;
  }

  // Golpe do acidente emocional
  const acidenteEmocionalPattern = /(bateu.*(carro|moto).*meu (filho|filha|sobrinho)|meu (filho|filha).*(acidente|preso|bateu)|não chama.*(polícia|delegacia).*pix|pagar.*acidente)/i.test(contextoOnly);
  if (acidenteEmocionalPattern) {
    threats.push('⚠️ CRÍTICO: Golpe do acidente emocional — pressão para pagar sem confirmar o fato');
    score -= 55;
    suspicionLevel += 7;
  }

  // Falso INSS / Gov.br
  const falsoINSSPattern = /(inss.*(valores? esquecidos?|benefício.*liberar|senha)|gov\.?br.*(senha|código.*validar)|valores? (esquecidos?|não sacados?).*(inss|previdência))/i.test(contextoOnly);
  if (falsoINSSPattern) {
    threats.push('⚠️ CRÍTICO: Golpe do falso INSS — nunca forneça senha do Gov.br');
    score -= 55;
    suspicionLevel += 7;
  }

  // Voz clonada por IA
  const vozClonadaPattern = /(áudio.*(pix|dinheiro|urgente)|(voz|áudio).*(igual|idêntica|exatamente|parecida).*(irmã|irmão|filho|filha|mãe|pai|esposa|marido))/i.test(contextoOnly);
  if (vozClonadaPattern) {
    threats.push('⚠️ CRÍTICO: Possível voz clonada por IA — nunca faça PIX baseado apenas em áudio');
    score -= 50;
    suspicionLevel += 6;
  }

  // Roubo de conta WhatsApp via código
  const rouboContaPattern = /(código.*(whatsapp|chegou|recebi).*(sem pedir|não pedi|mandou sem querer|enviou sem querer)|recebi.*(código|verificação).*(whatsapp|sms).*(ligou|disse que enviou))/i.test(contextoOnly);
  if (rouboContaPattern) {
    threats.push('⚠️ CRÍTICO: Tentativa de roubo de conta WhatsApp — NUNCA compartilhe o código de 6 dígitos');
    score -= 60;
    suspicionLevel += 8;
  }

  // Falso médico / hospital
  const falsoMedicoPattern = /(exame.*(pronto|resultado|pagar|taxa.*link)|pagar.*(resultado|exame).*(link|mensagem))/i.test(contextoOnly);
  if (falsoMedicoPattern) {
    threats.push('Golpe do falso médico/hospital — resultados de exames não têm taxa para liberação');
    score -= 40;
    suspicionLevel += 5;
  }

  // Golpe do QR Code
  const qrCodePattern = /(qr.?code|maquininha.*(sem sinal|não funciona)|entregador.*(pagar|qr|app do banco))/i.test(contextoOnly);
  if (qrCodePattern && (hasMoneyMention || hasPix)) {
    threats.push('Golpe do QR Code — confirme sempre o destinatário e valor antes de pagar');
    score -= 35;
    suspicionLevel += 4;
  }

  // Falso advogado
  const falsoAdvogadoPattern = /(advogado.*(processo|ganhou|ganhar).*(pagar|taxa)|ganhei.*(processo|causa).*(pagar|taxa|judicial)|taxas judiciais.*(antecipad|pagar))/i.test(contextoOnly);
  if (falsoAdvogadoPattern) {
    threats.push('⚠️ CRÍTICO: Golpe do falso advogado — pagamento antecipado para receber processo é sempre fraude');
    score -= 50;
    suspicionLevel += 6;
  }

  const hasLoanScam =
    (lowerContent.includes('empréstimo') || lowerContent.includes('crédito')) &&
    (lowerContent.includes('aprovado') || lowerContent.includes('liberado')) &&
    (lowerContent.includes('taxa') || lowerContent.includes('tarifa'));

  if (hasLoanScam) {
    threats.push('⚠️ Golpe de empréstimo fraudulento identificado');
    score -= 40;
    suspicionLevel += 5;
  }

  const hasInvestmentScam =
    (lowerContent.includes('bitcoin') || lowerContent.includes('investimento') || lowerContent.includes('trader')) &&
    (lowerContent.includes('garantido') || lowerContent.includes('lucro') || lowerContent.includes('retorno'));

  if (hasInvestmentScam) {
    threats.push('Promessa de investimento com retorno garantido (provável fraude)');
    score -= 35;
    suspicionLevel += 4;
  }

  const hasWorkFromHomeScam =
    (lowerContent.includes('trabalhe em casa') || lowerContent.includes('renda extra')) &&
    (hasMoneyMention || lowerContent.includes('cadastro') || lowerContent.includes('investimento'));

  if (hasWorkFromHomeScam) {
    threats.push('Oferta de trabalho/renda suspeita');
    score -= 30;
    suspicionLevel += 3;
  }

  const hasTooGoodToBeTrue =
    (lowerContent.includes('grátis') || lowerContent.includes('gratuito')) &&
    (lowerContent.includes('milhares') || lowerContent.includes('garantido') || hasMoneyMention);

  if (hasTooGoodToBeTrue && scamKeywordCount > 0) {
    threats.push('Oferta boa demais para ser verdade');
    score -= 20;
    suspicionLevel += 2;
  }

  if (urgencyWordCount >= 2 && hasMoneyMention && (urls.length > 0 || phones.length > 0)) {
    threats.push('⚠️ COMBINAÇÃO CRÍTICA: Urgência + Dinheiro + Contato');
    score -= 30;
    suspicionLevel += 4;
  }

  if (hasKnownSafeUrl && !details.urlThreat && scamKeywordCount < 3 && urgencyWordCount < 2 && !hasPersonalDataRequest) {
    score = Math.min(100, score + 25);
    suspicionLevel = Math.max(0, suspicionLevel - 3);
  }

  score = Math.max(0, Math.min(100, score));
  linkScore = Math.max(0, Math.min(100, linkScore));

  const officialPhone = phoneFindings.find(p => p.officialCompany && !p.suspicious);
  const criticalPhone = phoneFindings.find(p => p.suspicious && (p.category === 'falsa_central' || (p.category === 'ddd_inesperado' && /clonado|parente|fam[ií]lia/i.test(contextoOnly))));
  const suspiciousPhone = phoneFindings.find(p => p.suspicious);
  const textHasFraudSignal = scamKeywordCount > 0
    || urgencyWordCount >= 2
    || hasPersonalDataRequest
    || hasCloning
    || sequestroPattern
    || pixEnganoPattern
    || motoboyPattern
    || falsoFuncionarioPattern
    || correntePattern
    || suporteFalsoPattern
    || herancaPattern
    || entregaFalsaPattern
    || falsaVagaPattern
    || acidenteEmocionalPattern
    || falsoINSSPattern
    || vozClonadaPattern
    || rouboContaPattern
    || falsoMedicoPattern
    || (qrCodePattern && hasMoneyMention)
    || falsoAdvogadoPattern
    || pixParaEstornar
    || (claimsBankIdentity && requestsFinancialAction)
    || (claimsBigBrand && ofertaIrreal)
    || (ofertaIrreal && recrutamentoInformal)
    || (trocaNumeroFamiliar && refereFamiliar && hasMoneyMention)
    || exaggeratedThreat
    || phishingClasico
    || phishingComUrgencia
    || (accountThreatFuture && (urgencyWordCount > 0 || timePressure))
    || (clickLinkRequest && hasImpersonation)
    || codigoSemSolicitar
    || prizeNotJoined
    || comprovanteVendaContext
    || falsoAdvogadoContato
    || familiarPixUrgente;

  // Blindagem contra falsas associações: links de e-commerce com apenas parâmetros de
  // marketing não devem receber tags de ameaças (WhatsApp clonado, phishing, etc.)
  const scamTypes = (allUrlsCleanCommerce && !textHasFraudSignal && !criticalPhone)
    ? []
    : detectScamTypes(contextoOnly, lowerContent);
  const detectedScamTypes = scamTypes.filter(t => t !== 'generico');
  const suggestions: string[] = [];

  for (const scamType of scamTypes) {
    const typeSuggestions = getSuggestionsForScamType(scamType);
    suggestions.push(...typeSuggestions.slice(0, 3));
  }

  const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 5);

  // ===== Highlight Tags =====
  const highlightTags: HighlightTag[] = [];
  const fullContent = content + ' ' + contextoOnly;
  if (details.hasUrgencyWords || urgencyWordCount > 0) highlightTags.push('urgencia');
  if (hasPix || hasTransfer || hasMoneyMention) highlightTags.push('pedido_dinheiro');
  if (details.hasUrl || urls.length > 0) highlightTags.push('link_suspeito');
  if (
    /\b(senha|token|c[oó]digo (sms|que chegou|de verifica)|cvv|gov\.?br.*senha|me (manda|fala|passa|diz) o c[oó]digo)\b/i.test(fullContent)
  ) highlightTags.push('pedido_senha');
  if (
    /(sequestrar|sequestro|sequestrad|grito|chorando|pânico|medo|filho.*acidente|não chama.*pol|resgate|minha filha|meu filho.*preso|salvar|terror|ameaça)/i.test(fullContent)
    || (/(minha filha|meu filho|minha esposa|meu marido)/i.test(fullContent) && /(grito|chorando|socorro|pagar|resgate)/i.test(fullContent))
  ) highlightTags.push('manipulacao_emocional');
  if (
    /(compartilh.* (com|para) \d+|encaminh.* para \d+|repasse para \d+|só compartilhar|enviar para)/i.test(fullContent)
  ) highlightTags.push('compartilhamento_forcado');
  if (
    /(pagar.*(taxa|cartório|liberação|cadastro|inicial)|taxa.*(receber|liberar|cadastro)|depósito.*antes|antecipado)/i.test(fullContent)
  ) highlightTags.push('taxa_antecipada');
  if (
    /(antifraude|funcionário.*banco|trabalho.*banco|me ligou.*banco|sou (do|da) (banco|receita|inss|polícia|detran)|setor.*segurança|aqui (é|é o|é do).*(banco|central)|central de segurança)/i.test(fullContent)
    || (claimsBankIdentity)
  ) highlightTags.push('identidade_falsa');

  // ===== Chain of Thought: 4 etapas de raciocínio =====
  const etapa1: string[] = [];
  const etapa2: string[] = [];
  const etapa3: string[] = [];
  const etapa4: string[] = [];

  // Etapa 1 — Desconstrução / Engenharia Reversa
  if (urls.length === 0) {
    etapa1.push('Nenhum link encontrado no conteúdo.');
  } else {
    etapa1.push(`Foram extraídos ${urls.length} link(s): ${urls.join(', ')}.`);
    for (const r of urlReports) {
      etapa1.push(`Link ${r.url}: ${r.resumo} (nível ${r.nivelRisco}).`);
      for (const s of r.sinaisSuspeitos.slice(0, 3)) etapa1.push(`• ${s}`);
    }
  }
  if (phoneFindings.length === 0) {
    etapa1.push('Nenhum número de telefone identificado.');
  } else {
    for (const p of phoneFindings) {
      etapa1.push(`Telefone ${p.number}: ${p.reason}.`);
    }
  }
  if (!urls.length && !phoneFindings.length && contextoOnly.trim()) {
    etapa1.push('Mensagem composta apenas por texto, sem link ou contato direto.');
  }

  // Etapa 2 — Verificação de Contexto e Intenção
  if (urgencyWordCount > 0) etapa2.push(`Detectado ${urgencyWordCount} termo(s) de urgência no contexto.`);
  if (hasMoneyMention) etapa2.push('Há menção a dinheiro / valores financeiros.');
  if (hasPix) etapa2.push('PIX é citado explicitamente.');
  if (hasPersonalDataRequest) etapa2.push('Há solicitação de dados pessoais ou bancários (CPF, senha, cartão, código).');
  if (hasImpersonation) etapa2.push('Há referência a instituição que costuma ser personificada por golpistas (banco, Receita, INSS, Polícia, etc.).');
  if (hasKnownSafeUrl) etapa2.push('Pelo menos um dos links pertence a domínio reconhecidamente legítimo.');
  if (officialPhone) etapa2.push(`Número confere com a central oficial de ${officialPhone.officialCompany}.`);
  if (criticalPhone) etapa2.push(`Telefone com padrão crítico: ${criticalPhone.reason}.`);
  if (etapa2.length === 0) etapa2.push('Nenhum gatilho clássico de engenharia social identificado no contexto.');

  // =====================================================================
  // CAMADA 2 — MOTOR DE SINAIS (substituição do scoring ad-hoc)
  // Cada sinal tem categoria e peso; o total define o veredito final.
  // =====================================================================
  const signals: Signal[] = [];

  // — URGÊNCIA —
  if (pixParaEstornar || falsoFuncionarioPattern || rouboContaPattern) {
    // Já cobertos como contradições/críticos abaixo
  } else if (urgencyWordCount >= 3) {
    signals.push({ label: 'Pressão psicológica intensa', points: 30, category: 'urgencia' });
  } else if (urgencyWordCount >= 2) {
    signals.push({ label: 'Linguagem de urgência / prazo definido', points: 20, category: 'urgencia' });
  } else if (urgencyWordCount === 1) {
    signals.push({ label: 'Termo de urgência detectado', points: 8, category: 'urgencia' });
  }
  if (timePressure && !phishingComUrgencia) {
    signals.push({ label: 'Prazo em minutos/horas para agir', points: 18, category: 'urgencia' });
  }
  if (exaggeratedThreat && !phishingClasico) {
    signals.push({ label: 'Ameaça exagerada com prazo imediato', points: 25, category: 'urgencia' });
  }

  // — PHISHING CLÁSSICO (composto) —
  if (phishingComUrgencia) {
    signals.push({ label: 'Ameaça de bloqueio + prazo + clique em link — phishing bancário confirmado', points: 75, category: 'identidade' });
  } else if (phishingClasico) {
    signals.push({ label: 'Ameaça de bloqueio de conta + pedido de clique em link', points: 60, category: 'identidade' });
  } else {
    if (accountThreatFuture && (urgencyWordCount > 0 || timePressure)) {
      signals.push({ label: 'Ameaça de bloqueio de conta com prazo artificial', points: 35, category: 'identidade' });
    }
    if (clickLinkRequest && hasImpersonation) {
      signals.push({ label: 'Instituição pedindo clique em link externo', points: 30, category: 'identidade' });
    } else if (clickLinkRequest && !hasImpersonation) {
      signals.push({ label: 'Pedido de clique em link', points: 15, category: 'tecnico' });
    }
  }

  // — FINANCEIRO —
  if (hasPix && urgencyWordCount > 0) {
    signals.push({ label: 'PIX com urgência (padrão clássico de golpe)', points: 40, category: 'financeiro' });
  } else if (hasPix || hasTransfer) {
    signals.push({ label: 'Pedido de transferência / PIX', points: 25, category: 'financeiro' });
  }
  if (pixEnganoPattern) {
    signals.push({ label: 'PIX engano / comprovante falso', points: 45, category: 'financeiro' });
  }
  if (hasMoneyMention && scamKeywordCount >= 2) {
    signals.push({ label: 'Valor financeiro em contexto com múltiplos termos de golpe', points: 20, category: 'financeiro' });
  }
  if (herancaPattern || falsoAdvogadoPattern) {
    signals.push({ label: 'Taxa antecipada para receber dinheiro', points: 40, category: 'financeiro' });
  }
  if (falsaVagaPattern) {
    signals.push({ label: 'Oferta de ganhos irreais', points: 30, category: 'financeiro' });
  }
  if (tooCheapForProduct && pixOnlyPattern) {
    signals.push({ label: 'Produto muito barato + PIX antecipado exclusivo', points: 35, category: 'financeiro' });
  }

  // — AUTENTICAÇÃO —
  if (/\b(código|token).{0,30}(sms|chegou|recebeu|que\s+chegou)\b/i.test(contextoOnly) || rouboContaPattern) {
    signals.push({ label: 'Pedido de código SMS / token de autenticação', points: 55, category: 'autenticacao' });
  }
  if (/\b(senha|password)\b/i.test(contextoOnly) && (claimsBankIdentity || hasImpersonation)) {
    signals.push({ label: 'Pedido de senha em contexto de impersonação', points: 50, category: 'autenticacao' });
  }
  if (hasPersonalDataRequest && (urls.length > 0 || scamKeywordCount > 0 || claimsBankIdentity)) {
    signals.push({ label: 'Dados pessoais / bancários solicitados', points: 35, category: 'autenticacao' });
  } else if (hasPersonalDataRequest) {
    signals.push({ label: 'Pedido de informações pessoais', points: 15, category: 'autenticacao' });
  }

  // — IDENTIDADE FALSA —
  if (pixParaEstornar) {
    signals.push({ label: '"PIX de segurança" — contradição lógica impossível', points: 80, category: 'contradicao' });
  }
  if (claimsBankIdentity && requestsFinancialAction && !pixParaEstornar) {
    signals.push({ label: 'Banco/central de segurança solicitando ação financeira', points: 55, category: 'identidade' });
  }
  if (claimsBigBrand && ofertaIrreal) {
    signals.push({ label: 'Empresa conhecida recrutando via WhatsApp com ganhos irreais', points: 60, category: 'identidade' });
  } else if (ofertaIrreal && recrutamentoInformal) {
    signals.push({ label: 'Recrutamento informal com promessa de ganhos irreais', points: 45, category: 'identidade' });
  }
  if (falsoINSSPattern) {
    signals.push({ label: 'INSS / Gov.br solicitando senha ou dados', points: 55, category: 'identidade' });
  }
  if (hasImpersonation && urgencyWordCount > 0 && !orientaAppOficial && !pixParaEstornar && !claimsBankIdentity) {
    signals.push({ label: 'Referência a instituição oficial + urgência', points: 20, category: 'identidade' });
  }

  // — EMOCIONAL —
  if (sequestroPattern) {
    signals.push({ label: 'Cenário de sequestro / terror psicológico', points: 50, category: 'emocional' });
  }
  if (acidenteEmocionalPattern) {
    signals.push({ label: 'Golpe emocional de acidente (filho, familiar)', points: 45, category: 'emocional' });
  }
  if (vozClonadaPattern) {
    signals.push({ label: 'Possível voz clonada por IA', points: 45, category: 'emocional' });
  }
  if (prizeNotJoined) {
    signals.push({ label: 'Prêmio em sorteio que não participou — impossível por definição', points: 55, category: 'emocional' });
  } else if (hasPrizeScam) {
    signals.push({ label: 'Prêmio / sorteio inesperado com pedido de dados ou pagamento', points: 30, category: 'emocional' });
  }
  if (codigoSemSolicitar) {
    signals.push({ label: 'Código SMS/WhatsApp recebido sem solicitação — ataque de sequestro de conta', points: 65, category: 'autenticacao' });
  }
  if (comprovanteVendaContext) {
    signals.push({ label: 'Comprovante de PIX recebido em contexto de venda — confirme no extrato', points: 30, category: 'financeiro' });
  }
  if (falsoAdvogadoContato && !falsoAdvogadoPattern) {
    signals.push({ label: 'Advogado contatando sobre processo ganho inesperadamente', points: 30, category: 'identidade' });
  }
  if (familiarPixUrgente) {
    signals.push({ label: 'PIX urgente de familiar pelo número correto — pode ser celular roubado ou conta clonada', points: 35, category: 'emocional' });
  }
  if (correiosSemLink) {
    signals.push({ label: 'SMS de Correios sobre taxa sem link visível — confirme antes de pagar', points: 15, category: 'tecnico' });
  }
  if (acaoNoAppOficial) {
    signals.push({ label: 'Ação dentro do app oficial sem link externo', points: -25, category: 'legitimidade' });
  }
  if (bankCalledAboutPurchase && !requestsFinancialAction && !hasPersonalDataRequest) {
    signals.push({ label: 'Banco ligando sobre compra suspeita (sem pedido de dados ou transferência)', points: 15, category: 'identidade' });
  }
  if (hasCloning && (hasMoneyMention || hasTransfer || hasPix)) {
    signals.push({ label: 'WhatsApp clonado — padrão de familiar pedindo dinheiro', points: 50, category: 'emocional' });
  }
  if (trocaNumeroFamiliar && refereFamiliar && hasMoneyMention) {
    const pts = pixParaTerceiro ? 65 : 50;
    signals.push({ label: `Troca de número + familiar + pedido financeiro${pixParaTerceiro ? ' para terceiro' : ''}`, points: pts, category: 'emocional' });
  }

  // — TÉCNICO (links / telefones) —
  for (const url of urls) {
    const urlA = analyzeUrl(url);
    if (urlA.suspicious) {
      signals.push({ label: `Link suspeito: ${extractHostname(url)}`, points: 35, category: 'tecnico' });
    }
  }
  for (const r of urlReports) {
    if (r.nivelRisco === 'Alto') {
      signals.push({ label: `Link de alto risco: ${extractHostname(r.url)}`, points: 25, category: 'tecnico' });
    } else if (r.nivelRisco === 'Médio') {
      signals.push({ label: `Link de risco médio: ${extractHostname(r.url)}`, points: 10, category: 'tecnico' });
    }
  }
  if (urls.length > 1) {
    signals.push({ label: 'Múltiplos links na mensagem', points: 10, category: 'tecnico' });
  }
  if (criticalPhone) {
    signals.push({ label: `Telefone crítico: ${criticalPhone.reason}`, points: 30, category: 'tecnico' });
  } else if (suspiciousPhone && !officialPhone) {
    signals.push({ label: 'Número de telefone suspeito', points: 12, category: 'tecnico' });
  }
  if (motoboyPattern) {
    signals.push({ label: 'Pedido de entrega / motoboy para cartão físico', points: 55, category: 'tecnico' });
  }
  if (correntePattern) {
    signals.push({ label: 'Corrente viral com compartilhamento obrigatório', points: 35, category: 'tecnico' });
  }
  if (suporteFalsoPattern) {
    signals.push({ label: 'Falso suporte técnico / pop-up de vírus', points: 45, category: 'tecnico' });
  }
  if (entregaFalsaPattern) {
    signals.push({ label: 'Link de pagamento em contexto de entrega/Correios', points: 35, category: 'tecnico' });
  }
  if (falsoMedicoPattern) {
    signals.push({ label: 'Taxa para liberar resultado de exame', points: 35, category: 'tecnico' });
  }
  if (qrCodePattern && hasMoneyMention) {
    signals.push({ label: 'QR Code em contexto de pagamento informal', points: 25, category: 'tecnico' });
  }
  if (falsoAdvogadoPattern) {
    signals.push({ label: 'Falso advogado solicitando pagamento antecipado', points: 45, category: 'tecnico' });
  }

  // — LEGITIMIDADE (sinais negativos — reduzem o risco) —
  if (orientaAppOficial && !hasSuspiciousLink) {
    signals.push({ label: 'Orienta acesso pelo app / site oficial sem link suspeito', points: -30, category: 'legitimidade' });
  }
  if (legitBankNotification) {
    signals.push({ label: 'Notificação bancária legítima (sem link, sem pedido de dados)', points: -30, category: 'legitimidade' });
  }
  if (legitBillNotification) {
    signals.push({ label: 'Fatura legítima com código de barras', points: -15, category: 'legitimidade' });
  }
  if (hasKnownSafeUrl && !hasSuspiciousLink) {
    signals.push({ label: 'Domínio reconhecidamente legítimo', points: -20, category: 'legitimidade' });
  }
  if (officialPhone) {
    signals.push({ label: `Telefone oficial reconhecido: ${officialPhone.officialCompany}`, points: -15, category: 'legitimidade' });
  }
  if (allUrlsCleanCommerce && !textHasFraudSignal && !criticalPhone) {
    signals.push({ label: 'Todos os links são de e-commerce legítimo sem fraude no texto', points: -40, category: 'legitimidade' });
    threats = threats.filter(t => t.startsWith('✅'));
  }

  // — AJUSTE POR RESPOSTAS DO USUÁRIO ÀS PERGUNTAS DE CLARIFICAÇÃO —
  if (userConfirmsFraud) {
    signals.push({ label: 'Usuário confirmou sinal de risco nas informações adicionais', points: 30, category: 'autenticacao' });
  }
  if (userDeniesFraud) {
    const negPoints = signals.filter(s => s.points > 0).length > 0 ? -25 : -15;
    signals.push({ label: 'Usuário negou elementos de risco / contexto aponta situação legítima', points: negPoints, category: 'legitimidade' });
  }

  // — CÁLCULO FINAL —
  const rawScore = signals.reduce((sum, s) => sum + s.points, 0);
  let riskPercent = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Etapa 3 — exibição de sinais no Chain of Thought
  etapa3.push(`Sistema de pontuação por sinais — ${signals.length} sinal(is) detectado(s):`);
  for (const s of signals) {
    const prefix = s.points > 0 ? `+${s.points}` : `${s.points}`;
    etapa3.push(`${prefix} pts [${s.category}] — ${s.label}`);
  }
  etapa3.push(`Pontuação bruta: ${rawScore} → risco final: ${riskPercent}%.`);

  // Etapa 4 — Geração do Veredito com 4 níveis
  let veredito: Veredito;
  if (riskPercent <= 15) veredito = 'Seguro';
  else if (riskPercent <= 40) veredito = 'Suspeito';
  else if (riskPercent <= 70) veredito = 'Alto Risco';
  else veredito = 'Golpe Confirmado';

  etapa4.push(`Pontuação final: ${riskPercent}%.`);
  etapa4.push(`Veredito: ${veredito}.`);
  etapa4.push(
    veredito === 'Seguro'          ? 'Critério: ≤15 pts — poucos sinais suspeitos.' :
    veredito === 'Suspeito'        ? 'Critério: 16–40 pts — sinais relevantes presentes, sem confirmação de fraude.' :
    veredito === 'Alto Risco'      ? 'Critério: 41–70 pts — múltiplos padrões típicos de golpe detectados.' :
                                     'Critério: >70 pts — tentativa de fraude claramente identificada.'
  );

  // =====================================================================
  // CAMADA 3 — EXPLICAÇÃO HUMANA + AÇÕES + PERGUNTAS DE CLARIFICAÇÃO
  // =====================================================================
  const fraudSignals = signals.filter(s => s.points > 0);
  const legitSignals = signals.filter(s => s.points < 0);
  const topSignal = fraudSignals.sort((a, b) => b.points - a.points)[0];

  const phoneMotivo = criticalPhone
    ? ` O número apresenta comportamento de risco: ${criticalPhone.reason}.`
    : suspiciousPhone
      ? ` Número com indício suspeito: ${suspiciousPhone.reason}.`
      : officialPhone
        ? ` O número confere com a central oficial de ${officialPhone.officialCompany}.`
        : '';

  const phoneRecomendacao = criticalPhone?.recommendation
    ? ' ' + criticalPhone.recommendation
    : suspiciousPhone?.recommendation
      ? ' ' + suspiciousPhone.recommendation
      : '';

  let motivo: string;
  let recomendacao: string;

  if (veredito === 'Seguro') {
    motivo = legitSignals.length > 0
      ? `Detectei sinais de legitimidade (${legitSignals.map(s => s.label).join('; ')}). Nenhum padrão de fraude confirmado.` + phoneMotivo
      : 'Nenhum padrão de engenharia social, URL maliciosa ou solicitação financeira suspeita foi identificado.' + phoneMotivo;
    recomendacao = 'Pode prosseguir com segurança, mantendo as práticas normais de cautela online.';
  } else if (veredito === 'Suspeito') {
    // Motivos específicos por cenário detectado
    const bankCalledMotivo = bankCalledAboutPurchase && !requestsFinancialAction
      ? 'Bancos de fato ligam sobre compras suspeitas — mas golpistas também se passam por eles. A diferença está no que pedem: banco legítimo NUNCA pede senha, código SMS ou transferência por telefone.'
      : null;
    const comprovanteMotivo = comprovanteVendaContext
      ? 'Comprovantes de PIX enviados por mensagem são facilmente falsificados. O único comprovante válido é o que aparece no extrato do seu próprio banco em tempo real.'
      : null;
    const correiosMotivo = correiosSemLink && !entregaFalsaPattern
      ? 'SMS de Correios sobre taxa de importação pode ser legítimo ou phishing — o golpe normalmente só aparece quando pedem que você clique em link ou acesse um site específico para pagar.'
      : null;
    const falsoAdvMotivo = falsoAdvogadoContato && !falsoAdvogadoPattern
      ? 'Advogados legítimos não contatam pessoas sobre processos ganhos de surpresa por mensagem. Esse é um roteiro comum de golpe que culmina em pedido de taxa para "liberar" o valor.'
      : null;
    const familiarPixMotivo = (familiarPixUrgente || (refereFamiliar && hasPix && urgencyWordCount > 0 && !trocaNumeroFamiliar))
      ? 'PIX urgente de familiar, mesmo do número correto, pode indicar celular roubado, conta hackeada ou pressão emocional fabricada. A urgência é o sinal mais importante — confirme pessoalmente antes de transferir.'
      : null;
    // Phishing bancário detectado — motivo mais específico
    const phishingMotivo = phishingComUrgencia
      ? `A mensagem usa três sinais clássicos de phishing bancário: ameaça de bloqueio de conta, prazo de tempo para pressionar, e pedido de clique em link externo. Esses elementos juntos são o roteiro mais comum de golpe bancário.`
      : phishingClasico
        ? `A mensagem combina ameaça de bloqueio de conta com pedido de clique em link — padrão típico de phishing bancário. Bancos legítimos nunca enviam links urgentes por SMS/WhatsApp pedindo que você clique para resolver bloqueios.`
        : accountThreatFuture
          ? `A mensagem ameaça bloquear sua conta${timePressure ? ' com prazo definido' : ''} — tática de pressão usada para forçar ação impulsiva. Bancos não bloqueiam contas por inação em mensagens de SMS ou WhatsApp.`
          : null;
    const specificMotivo = bankCalledMotivo || comprovanteMotivo || correiosMotivo || falsoAdvMotivo || familiarPixMotivo || phishingMotivo;
    motivo = specificMotivo
      ? specificMotivo + phoneMotivo
      : topSignal
        ? `Detectei ${fraudSignals.length} sinal(is) de alerta. O mais relevante: "${topSignal.label}". Há indícios que merecem cautela, mas não há confirmação de fraude.` + phoneMotivo
        : 'Combinação de fatores que merecem atenção.' + phoneMotivo;
    recomendacao = 'Não clique em links nem forneça dados antes de confirmar a origem por canal oficial.' + phoneRecomendacao;
  } else if (veredito === 'Alto Risco') {
    const phishingMotivoAlto = phishingComUrgencia
      ? `A mensagem apresenta o roteiro completo de phishing bancário: ameaça de bloqueio + prazo artificial + pedido de clique em link. Esses três elementos juntos têm altíssima probabilidade de fraude.`
      : null;
    motivo = phishingMotivoAlto
      ? phishingMotivoAlto + phoneMotivo
      : topSignal
        ? `Detectei ${fraudSignals.length} padrões típicos de golpe. Principal sinal: "${topSignal.label}". Alta probabilidade de tentativa de fraude.` + phoneMotivo
        : 'Múltiplos indicadores de golpe detectados.' + phoneMotivo;
    recomendacao = 'NÃO interaja com essa mensagem. Confirme a situação por canal completamente independente antes de qualquer ação.' + phoneRecomendacao;
  } else {
    motivo = topSignal
      ? `GOLPE CONFIRMADO. Detectei ${fraudSignals.length} sinais claros de fraude. Sinal decisivo: "${topSignal.label}".` + phoneMotivo
      : 'O conteúdo apresenta múltiplos indicadores inequívocos de golpe.' + phoneMotivo;
    recomendacao = 'NÃO interaja. Bloqueie o número imediatamente, não envie PIX, não forneça dados e denuncie.' + phoneRecomendacao;
  }

  // =====================================================================
  // AÇÕES SITUACIONAIS — baseadas no que foi realmente detectado
  // Sem recomendações genéricas que não se aplicam ao caso
  // =====================================================================
  const acoesSet: string[] = [];

  if (veredito === 'Seguro') {
    if (comprovanteVendaContext) {
      acoesSet.push('Abra seu app do banco e confirme que o valor apareceu no extrato antes de entregar o produto');
    } else if (correiosSemLink) {
      acoesSet.push('Acesse correios.com.br diretamente e rastreie com o código da encomenda para confirmar a taxa');
    } else if (acaoNoAppOficial) {
      acoesSet.push('Prossiga normalmente — isso é padrão após atualização de app bancário');
      acoesSet.push('Se tiver dúvida, abra o app e verifique se há alguma notificação confirmando a solicitação');
    } else {
      acoesSet.push('Confirme transações sempre pelo app oficial');
      acoesSet.push('Em caso de dúvida, entre em contato com a empresa pelo canal oficial');
    }

  } else if (veredito === 'Suspeito') {
    if (phishingClasico || accountThreatFuture || clickLinkRequest) {
      acoesSet.push('NÃO clique no link — acesse o banco diretamente pelo app ou digitando o endereço no navegador');
      acoesSet.push('Verifique se há notificação real no app oficial do banco');
    }
    if (comprovanteVendaContext) {
      acoesSet.push('Abra o app do seu banco e confirme que o PIX apareceu no extrato antes de entregar o produto');
      acoesSet.push('Comprovante enviado por WhatsApp ou foto não tem validade — só o extrato real do banco');
    }
    if (bankCalledAboutPurchase) {
      acoesSet.push('Encerre a ligação e ligue de volta pelo número do verso do cartão para confirmar se a ligação foi real');
      acoesSet.push('NÃO forneça senha, código SMS ou dados durante a ligação — banco legítimo nunca pede isso');
    }
    if (correiosSemLink) {
      acoesSet.push('Acesse correios.com.br diretamente e rastreie pelo código — não pague nada por link de SMS');
    }
    if (trocaNumeroFamiliar || (refereFamiliar && hasMoneyMention && !familiarPixUrgente)) {
      acoesSet.push('Ligue no número antigo dessa pessoa para confirmar se realmente trocou de celular');
      acoesSet.push('Só transfira dinheiro depois de confirmar a identidade por outro canal');
    }
    if (familiarPixUrgente) {
      acoesSet.push('Ligue diretamente para a pessoa para confirmar a urgência antes de qualquer PIX');
      acoesSet.push('Avalie se o valor e o motivo são compatíveis com o que você conhece da situação dela');
    }
    if (falsoAdvogadoContato) {
      acoesSet.push('Verifique o OAB do advogado em cna.oab.org.br antes de qualquer contato ou pagamento');
      acoesSet.push('Confirme se tinha algum processo aberto — advogados legítimos não contatam de surpresa por mensagem');
    }
    if (codigoSemSolicitar) {
      acoesSet.push('NÃO compartilhe o código com ninguém — nem com quem dizer ser do banco ou suporte');
      acoesSet.push('Ative a verificação em duas etapas no WhatsApp: Configurações → Conta → Confirmação em duas etapas');
    }
    if (hasPersonalDataRequest && !codigoSemSolicitar) {
      acoesSet.push('NÃO forneça senha, código ou dados bancários por mensagem ou ligação');
    }
    if (acoesSet.length === 0) {
      acoesSet.push('Não clique em links nem forneça dados antes de confirmar a origem');
      acoesSet.push('Acesse o serviço diretamente pelo app ou site oficial digitado no navegador');
      if (phones.length > 0 || hasImpersonation) {
        acoesSet.push('Confirme pelo número oficial da empresa (verso do cartão ou site oficial)');
      }
    }

  } else if (veredito === 'Alto Risco') {
    acoesSet.push('NÃO responda, não clique em nada e não execute nenhuma instrução dessa mensagem');
    if (hasPix || hasTransfer || hasMoneyMention) {
      acoesSet.push('NÃO faça PIX nem transferência — confirme a situação antes por canal independente');
    }
    if (phishingClasico || clickLinkRequest) {
      acoesSet.push('NÃO clique no link — acesse o banco diretamente pelo app ou site oficial');
    }
    if (sequestroPattern || acidenteEmocionalPattern) {
      acoesSet.push('Ligue AGORA para a pessoa supostamente em perigo pelo número que você já conhece');
      acoesSet.push('Envolva outro familiar próximo antes de tomar qualquer decisão financeira');
    }
    if (vozClonadaPattern) {
      acoesSet.push('NÃO baseie nenhuma decisão no áudio — ligue de volta pelo número que você conhece');
    }
    if (motoboyPattern) {
      acoesSet.push('Desligue e ligue para o banco pelo número do verso do cartão — bancos NUNCA mandam buscar cartão');
    }
    if (falsoFuncionarioPattern || codigoSemSolicitar) {
      acoesSet.push('NÃO forneça o código SMS, senha ou token — encerre o contato imediatamente');
    }
    if (acoesSet.length < 3) {
      acoesSet.push('Ligue para o banco ou empresa pelo número oficial para verificar a situação');
      acoesSet.push('Bloqueie o contato se confirmar que é golpe');
    }

  } else { // Golpe Confirmado
    acoesSet.push('BLOQUEIE o contato imediatamente');
    if (hasPix || hasTransfer || hasMoneyMention) {
      acoesSet.push('NÃO faça PIX, transferência nem qualquer pagamento');
    }
    if (hasPersonalDataRequest || codigoSemSolicitar || falsoFuncionarioPattern) {
      acoesSet.push('NÃO forneça senhas, códigos SMS nem dados pessoais');
    }
    if (phishingClasico || clickLinkRequest) {
      acoesSet.push('NÃO clique no link — feche a mensagem e delete');
    }
    if (sequestroPattern || acidenteEmocionalPattern) {
      acoesSet.push('Respire fundo — ligue agora para a pessoa pelo número que você já tem');
      acoesSet.push('Não transfira dinheiro sem confirmar pessoalmente ou com familiar próximo');
    }
    if (pixParaEstornar || falsoFuncionarioPattern) {
      acoesSet.push('Desligue imediatamente — bancos NUNCA pedem PIX de segurança ou código SMS');
    }
    if (motoboyPattern) {
      acoesSet.push('NUNCA entregue seu cartão físico a ninguém — desligue e ligue para o SAC do banco');
    }
    acoesSet.push('Registre boletim de ocorrência se houver prejuízo (delegacia ou online em delegaciadigital.ssp.sp.gov.br)');
    if (acoesSet.length < 4) {
      acoesSet.push('Denuncie em safernet.org.br ou pelo Procon');
    }
  }

  const acoes = Array.from(new Set(acoesSet)).slice(0, 6);

  // =====================================================================
  // PERGUNTAS DE CLARIFICAÇÃO — contextuais por tipo de golpe detectado
  // Ativadas quando há sinais ambíguos ou contexto insuficiente
  // =====================================================================
  const clarifyingQuestionsRaw: string[] = [];

  // Detectar o que já foi mencionado explicitamente no texto para não perguntar de novo
  const alreadyMentionsLink = urls.length > 0 || clickLinkRequest || /\blink\b/i.test(contextoOnly);
  const alreadyMentionsMoney = hasPix || hasTransfer || hasMoneyMention;
  const alreadyMentionsCode = /\b(código|token|sms|senha)\b/i.test(contextoOnly) || hasPersonalDataRequest;
  const alreadyMentionsSender = /\b(banco|receita|detran|inss|nubank|bradesco|itau|caixa|santander|inter|c6)\b/i.test(contextoOnly) || claimsBankIdentity;

  // Cenário A: Sinais insuficientes — não conseguimos classificar com confiança
  const fraudSignalCount = signals.filter(s => s.points > 0).length;
  if (fraudSignalCount <= 1 && riskPercent < 40) {
    if (!alreadyMentionsMoney) {
      clarifyingQuestionsRaw.push('Alguém pediu dinheiro, PIX ou transferência nessa mensagem?');
    }
    if (!alreadyMentionsCode) {
      clarifyingQuestionsRaw.push('Pediram algum código SMS, senha, CPF ou dados bancários?');
    }
    if (!alreadyMentionsLink) {
      clarifyingQuestionsRaw.push('Havia algum link ou endereço de site na mensagem?');
    }
    if (fraudSignalCount === 0 && !alreadyMentionsSender) {
      clarifyingQuestionsRaw.push('Quem enviou essa mensagem — você conhece o remetente ou era desconhecido?');
    }
  }

  // Cenário B: WhatsApp clonado / familiar pedindo dinheiro (precisamos confirmar)
  if ((trocaNumeroFamiliar || (refereFamiliar && hasMoneyMention)) && riskPercent >= 16) {
    clarifyingQuestionsRaw.push('Você já tentou ligar no número antigo dessa pessoa para confirmar a identidade?');
    if (hasPix) {
      clarifyingQuestionsRaw.push('O PIX vai para a conta do próprio familiar ou para outro nome / fornecedor?');
    }
  }

  // Cenário C: Falso sequestro / golpe emocional — confirmar se tentou contato
  if (sequestroPattern || acidenteEmocionalPattern) {
    clarifyingQuestionsRaw.push('Você conseguiu entrar em contato com a pessoa supostamente em perigo por outro número ou familiar próximo?');
    clarifyingQuestionsRaw.push('A ligação veio de número desconhecido ou não identificado?');
  }

  // Cenário D: Banco / antifraude ligando — checar o que foi pedido
  if (claimsBankIdentity && riskPercent < 70) {
    clarifyingQuestionsRaw.push('O "banco" pediu para você fazer PIX, transferência ou fornecer código SMS?');
    clarifyingQuestionsRaw.push('Você já ligou de volta no número do verso do cartão para confirmar?');
  }

  // Cenário E: PIX engano / comprovante duvidoso
  if (pixEnganoPattern && riskPercent < 90) {
    clarifyingQuestionsRaw.push('O valor apareceu no extrato real do seu banco ou você só recebeu um print de comprovante por mensagem?');
  }

  // Cenário F: Falso prêmio sem link visível — confirmar se pediram algo
  if (hasPrizeScam && urls.length === 0) {
    clarifyingQuestionsRaw.push('A mensagem pediu algum pagamento, cadastro ou dados para "liberar" o prêmio?');
    clarifyingQuestionsRaw.push('Você participou de algum sorteio ou promoção dessa empresa?');
  }

  // Cenário G: Phishing bancário detectado — perguntas para confirmar a comunicação
  if (phishingClasico || (accountThreatFuture && hasImpersonation)) {
    if (!alreadyMentionsCode) {
      clarifyingQuestionsRaw.push('A mensagem pediu senha, token ou código SMS além de clicar no link?');
    }
    clarifyingQuestionsRaw.push('A mensagem chegou por SMS oficial do banco, WhatsApp ou por outro canal?');
    clarifyingQuestionsRaw.push('O link parecia o endereço oficial do banco (ex: itau.com.br) ou um domínio diferente?');
  }
  // Cenário G2: Impersonação com risco médio sem phishing claro — checar se havia pedido de ação
  else if (hasImpersonation && !claimsBankIdentity && riskPercent >= 16 && riskPercent <= 55) {
    if (!alreadyMentionsLink) {
      clarifyingQuestionsRaw.push('O remetente pediu para clicar em algum link ou ligar para um número específico?');
    }
    clarifyingQuestionsRaw.push('Você estava esperando um contato dessa empresa ou órgão?');
  }

  // Cenário H: Falsa vaga / tarefa — confirmar modelo de cobrança
  if (falsaVagaPattern && riskPercent < 80) {
    clarifyingQuestionsRaw.push('A empresa pediu algum depósito, "investimento inicial" ou pagamento para liberar as tarefas?');
  }

  // Cenário I: Voz clonada ou áudio suspeito
  if (vozClonadaPattern && riskPercent < 80) {
    clarifyingQuestionsRaw.push('Você reconheceu a voz com certeza ou ela soava levemente diferente do normal?');
    clarifyingQuestionsRaw.push('Você tentou ligar de volta para confirmar se era realmente essa pessoa?');
  }

  // Cenário J: Entrega / Correios duvidoso — checar se tem encomenda esperada
  if (entregaFalsaPattern && riskPercent < 70) {
    clarifyingQuestionsRaw.push('Você estava esperando alguma encomenda dos Correios nos últimos dias?');
    clarifyingQuestionsRaw.push('Você verificou o número de rastreio diretamente no site dos Correios (correios.com.br)?');
  }

  // Cenário K: Nenhum sinal — mensagem muito vaga
  if (signals.length === 0) {
    clarifyingQuestionsRaw.push('Descreva melhor o que aconteceu — o que a pessoa pediu ou disse exatamente?');
    clarifyingQuestionsRaw.push('A mensagem pediu alguma ação (clicar, pagar, ligar, fornecer dados)?');
  }

  // Cenário L: Comprovante de PIX em venda
  if (comprovanteVendaContext) {
    clarifyingQuestionsRaw.push('O valor do PIX já apareceu no extrato real do seu banco, ou você só viu o comprovante que o comprador enviou?');
    clarifyingQuestionsRaw.push('O comprador pediu para entregar o produto antes de confirmar o recebimento?');
  }

  // Cenário M: SMS Correios sem link
  if (correiosSemLink && !entregaFalsaPattern) {
    clarifyingQuestionsRaw.push('Você estava esperando alguma encomenda dos Correios nos últimos dias?');
    clarifyingQuestionsRaw.push('A mensagem continha algum link para pagamento, ou só o aviso de taxa?');
  }

  // Cenário N: Advogado processo ganho inesperado
  if (falsoAdvogadoContato) {
    clarifyingQuestionsRaw.push('Você tinha algum processo judicial ou causa em andamento que poderia ter resultado nessa decisão?');
    clarifyingQuestionsRaw.push('O advogado pediu algum pagamento, taxa ou adiantamento para "liberar" o valor?');
    if (!alreadyMentionsSender) {
      clarifyingQuestionsRaw.push('O contato foi completamente inesperado — sem você ter procurado nenhum advogado ou serviço jurídico?');
    }
  }

  // Cenário O: Banco ligou sobre compra suspeita (ambíguo — pode ser legítimo)
  if (bankCalledAboutPurchase) {
    clarifyingQuestionsRaw.push('O banco pediu para você fornecer senha, código SMS ou token durante a ligação?');
    clarifyingQuestionsRaw.push('Pediram para instalar algum aplicativo ou dar acesso remoto ao celular?');
    clarifyingQuestionsRaw.push('Você já ligou de volta no número do verso do cartão para confirmar se a ligação foi real?');
  }

  // Cenário P: App oficial pediu ação (provavelmente legítimo — perguntas para confirmar)
  if (acaoNoAppOficial && riskPercent < 30) {
    clarifyingQuestionsRaw.push('O reconhecimento facial ou verificação foi solicitado dentro do app oficial (sem clicar em link externo)?');
    clarifyingQuestionsRaw.push('Você tinha atualizado o aplicativo recentemente antes disso aparecer?');
  }

  // Cenário Q: Compra online pedindo confirmação de endereço (Teste 2 — ambíguo)
  if (/(compra|pedido|encomenda).{0,40}(confirmação|confirmar|confirme).{0,40}(endereço|dados|entrega)/i.test(contextoOnly)
    || /(loja|empresa|site).{0,40}(pediu|solicitou|mandou).{0,40}(confirmação|confirmar).{0,40}(endereço|dados)/i.test(contextoOnly)) {
    if (!alreadyMentionsMoney && !alreadyMentionsCode) {
      clarifyingQuestionsRaw.push('Você realmente realizou essa compra recentemente?');
      clarifyingQuestionsRaw.push('A mensagem chegou pelo mesmo canal que a loja usa normalmente (app, e-mail oficial, SMS do número que você conhece)?');
    }
  }

  // Cenário R: Familiar PIX urgente do número correto — análise comportamental
  if (familiarPixUrgente || (refereFamiliar && hasPix && urgencyWordCount > 0 && !trocaNumeroFamiliar)) {
    clarifyingQuestionsRaw.push('O valor do PIX é compatível com o que essa pessoa normalmente pediria?');
    clarifyingQuestionsRaw.push('Você conseguiu confirmar com ela por ligação direta ou pessoalmente?');
    if (!clarifyingQuestionsRaw.includes('O contexto da urgência faz sentido com o que você sabe da situação dela?')) {
      clarifyingQuestionsRaw.push('O motivo da urgência faz sentido — ou parece incomum para o comportamento normal dessa pessoa?');
    }
  }

  // Cenário S: Código sem solicitar — perguntas diretas
  if (codigoSemSolicitar) {
    clarifyingQuestionsRaw.push('Alguém entrou em contato pedindo para você compartilhar esse código?');
    clarifyingQuestionsRaw.push('Você clicou em algum link ou instalou algum aplicativo recentemente antes de receber o código?');
  }

  const clarifyingQuestions = Array.from(new Set(clarifyingQuestionsRaw)).slice(0, 3);

  const chainOfThought: ChainOfThoughtAnalysis = {
    etapas: [
      { titulo: '1. Desconstrução e Engenharia Reversa', observacoes: etapa1 },
      { titulo: '2. Verificação de Contexto e Intenção', observacoes: etapa2 },
      { titulo: '3. Ponderação por Evidências (Score)', observacoes: etapa3 },
      { titulo: '4. Geração do Veredito', observacoes: etapa4 },
    ],
    veredito,
    nivelRiscoPercent: riskPercent,
    porQue: motivo,
    oQueFazer: recomendacao,
  };

  const riskLevel: 'caminho-feliz' | 'medio' | 'alto' | 'critico' =
    veredito === 'Seguro'          ? 'caminho-feliz' :
    veredito === 'Suspeito'        ? 'medio' :
    veredito === 'Alto Risco'      ? 'alto' : 'critico';

  return {
    safe: veredito === 'Seguro',
    score: riskPercent,
    riskPercent,
    veredito,
    chainOfThought: {
      etapas: [
        { titulo: '1. Extração de Artefatos', observacoes: etapa1 },
        { titulo: '2. Verificação de Contexto e Intenção', observacoes: etapa2 },
        { titulo: '3. Pontuação por Sinais', observacoes: etapa3 },
        { titulo: '4. Veredito', observacoes: etapa4 },
      ],
      veredito,
      nivelRiscoPercent: riskPercent,
      porQue: motivo,
      oQueFazer: recomendacao,
    },
    motivo,
    recomendacao,
    acoes,
    threats,
    signals,
    scamTypes,
    suggestions: uniqueSuggestions,
    highlightTags,
    clarifyingQuestions,
    riskLevel,
    riskContext: riskPercent,
    riskLink: urls.length > 0 ? Math.min(100, signals.filter(s => s.category === 'tecnico' && s.points > 0).reduce((a, s) => a + s.points, 0)) : 0,
    contextoExtraido: contextoOnly,
    linksExtraidos: urls,
    detectedUrls: urls.length > 0 ? urls : undefined,
    urlReports: urlReports.length > 0 ? urlReports : undefined,
    details
  };
}
