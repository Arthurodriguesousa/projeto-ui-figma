import { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, ArrowLeft, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScamCategory =
  | "phishing_bank"
  | "phishing_email_service"
  | "phishing_marketplace"
  | "phone_call_generic"
  | "sms_code_unsolicited"
  | "fake_relative"
  | "marketplace_fraud"
  | "loan_fraud"
  | "whatsapp_clone"
  | "cpf_block_threat"
  | "card_fraud"
  | "car_accident_pressure"
  | "virus_scareware"
  | "forgotten_money"
  | "pix_confirm"
  | "number_spoofing"
  | "already_transferred"
  | "vague";

type QuestionKey =
  | "typed_password"
  | "clicked_link"
  | "installed_app"
  | "made_transfer"
  | "shared_code"
  | "gave_data"
  | "contact_channel"
  | "confirmed_person"
  | "money_in_account"
  | "product_delivered"
  | "lost_access"
  | "contacts_got_messages"
  | "asked_for_money"
  | "has_subscription"
  | "link_in_message"
  | "official_channel"
  | "number_known"
  | "who_called_id"
  | "verified_business";

type FactValue = "yes" | "no" | string;
type KnownFacts = Partial<Record<QuestionKey, FactValue>>;

type ConvState = {
  category: ScamCategory | null;
  knownFacts: KnownFacts;
  riskScore: number;
  pendingQuestions: QuestionKey[];
  turnCount: number;
  resolved: boolean;
  allUserText: string; // texto acumulado do usuário para o scorer de sinais
};

type Message = {
  id: number;
  text: string;
  sender: "user" | "analyst";
  time: string;
};

// ─── Question library ─────────────────────────────────────────────────────────

const QUESTION_TEXTS: Record<QuestionKey, string> = {
  typed_password: "Você digitou sua senha em algum lugar?",
  clicked_link: "Você chegou a clicar no link?",
  installed_app: "Instalou algum aplicativo ou programa?",
  made_transfer: "Você fez algum PIX ou transferência?",
  shared_code: "Você compartilhou algum código de verificação com alguém?",
  gave_data: "Passou algum dado pessoal — CPF, número do cartão, data de nascimento?",
  contact_channel: "Por onde chegou esse contato — WhatsApp, SMS, e-mail ou ligação?",
  confirmed_person: "Você conseguiu ligar diretamente pra essa pessoa no número antigo?",
  money_in_account: "O dinheiro realmente entrou na conta? Conferiu no app do banco — não no print?",
  product_delivered: "Você já entregou o produto?",
  lost_access: "Você ainda consegue abrir o WhatsApp normalmente?",
  contacts_got_messages: "Algum contato seu reportou ter recebido mensagens estranhas vindas de você?",
  asked_for_money: "Eles chegaram a pedir dinheiro, PIX ou transferência?",
  has_subscription: "Você realmente assina esse serviço?",
  link_in_message: "A mensagem tinha algum link pra clicar?",
  official_channel: "Esse pedido apareceu dentro do aplicativo oficial ou veio por mensagem externa?",
  number_known: "O número era salvo na sua agenda ou era desconhecido?",
  who_called_id: "A pessoa disse ser de qual empresa ou órgão?",
  verified_business: "O WhatsApp desse contato tem o selo de conta oficial verificada (ícone azul ou verde ao lado do nome)?",
};

const CATEGORY_QUESTIONS: Record<ScamCategory, QuestionKey[]> = {
  phishing_bank: ["verified_business", "contact_channel", "who_called_id", "link_in_message", "clicked_link", "typed_password", "installed_app", "gave_data"],
  phishing_email_service: ["has_subscription", "link_in_message", "clicked_link", "typed_password"],
  phishing_marketplace: ["official_channel", "clicked_link", "typed_password", "gave_data"],
  fake_relative: ["confirmed_person", "asked_for_money", "made_transfer", "contact_channel"],
  sms_code_unsolicited: ["shared_code", "who_called_id", "typed_password"],
  whatsapp_clone: ["shared_code", "lost_access", "contacts_got_messages"],
  marketplace_fraud: ["money_in_account", "product_delivered", "contact_channel"],
  card_fraud: ["who_called_id", "typed_password", "installed_app", "made_transfer"],
  cpf_block_threat: ["contact_channel", "gave_data", "installed_app", "made_transfer"],
  loan_fraud: ["contact_channel", "who_called_id", "gave_data", "installed_app"],
  car_accident_pressure: ["confirmed_person", "asked_for_money", "made_transfer"],
  virus_scareware: ["contact_channel", "installed_app", "typed_password"],
  forgotten_money: ["contact_channel", "link_in_message", "gave_data", "typed_password"],
  pix_confirm: ["official_channel", "clicked_link", "made_transfer"],
  number_spoofing: ["asked_for_money", "gave_data", "made_transfer", "installed_app"],
  phone_call_generic: ["who_called_id", "contact_channel", "link_in_message", "clicked_link", "gave_data", "made_transfer", "installed_app"],
  already_transferred: ["made_transfer"],
  vague: ["contact_channel", "who_called_id", "link_in_message", "clicked_link", "typed_password", "gave_data", "made_transfer"],
};

// ─── Category detection ───────────────────────────────────────────────────────

function detectCategory(text: string): ScamCategory {
  const t = text.toLowerCase();

  if (/clon(ar|ou|aram|ei)\s*(meu\s*)?whatsapp|whatsapp.*clon|roub.*whatsapp/.test(t)) return "whatsapp_clone";
  if (/(filh[ao]|sobrinho|mae|mãe|pai|marido|esposa|irm[aã]o?|parente).*(trocou?.*n[uú]mero|novo n[uú]mero|sem acesso|pix.*ajuda|precisa.*pix)/.test(t)) return "fake_relative";
  if (/cpf.*(bloqueado|irregular|cancelado|suspenso)|bloqueio.*cpf/.test(t)) return "cpf_block_threat";
  if (/emprest(imo|aram).*meu nome|fizeram.*emprestimo.*nome/.test(t)) return "loan_fraud";
  if (/(bati|bateu|filho.*bati).*carro|acidente.*carro|carro.*bati/.test(t)) return "car_accident_pressure";
  if (/v[íi]rus|aviso.*vermelho|tela.*vermelho|celular.*infectado|baixar.*antivirus/.test(t)) return "virus_scareware";
  if (/dinheiro.*esquecido|esquecido.*banco|valores.*esquecidos|restituicao/.test(t)) return "forgotten_money";
  if (/c[oó]digo.*(chegou|sms|banco).*sem|recebi.*codigo.*nem.*entrei|sms.*codigo.*n[aã]o.*abri/.test(t)) return "sms_code_unsolicited";
  if (/comprovante.*pix|ja pagou.*comprovante|uber.*buscar.*produto|mandaram.*uber/.test(t)) return "marketplace_fraud";
  if (/pix.*confirmar|confirmar.*pix|mandaram.*negocio.*pix|negocio.*confirmar/.test(t)) return "pix_confirm";
  if (/cartao.*outro estado|usando.*cartao|clonaram.*cartao/.test(t)) return "card_fraud";
  if (/n[uú]mero.*oficial.*estran|parecia.*oficial.*mas|oficial.*mas.*estran/.test(t)) return "number_spoofing";
  if (/(mercado livre|amazon).*(cartao|confirmar|codigo)|confirmar.*(cartao|codigo).*(mercado|amazon)/.test(t)) return "phishing_marketplace";
  if (/netflix.*pagamento|pagamento.*netflix|pagamento.*falhou/.test(t)) return "phishing_email_service";
  if (/j[áa].*transferi|j[áa] fiz.*pix|realizei.*transferencia|mandei.*dinheiro.*golpe/.test(t)) return "already_transferred";
  if (/cliquei.*banco|banco.*link|link.*banco|negocio.*banco|fiz.*besteira.*banco/.test(t)) return "phishing_bank";
  if (/(banco|nubank|bradesco|itau|caixa|santander).*(whatsapp|zap|wpp|mensagem|sms)|whatsapp.*(banco|nubank|bradesco|itau|caixa|santander)/.test(t)) return "phishing_bank";
  if (/(whatsapp|zap|wpp|sms|mensagem).*(link|url)|(link|url).*(whatsapp|zap|wpp|sms)/.test(t)) return "phishing_bank";
  if (/link.*(estranho|suspeito|estranha|esquisito|bizarro)|mensagem.*(suspeita|estranha|estranho|esquisita)/.test(t)) return "phishing_bank";
  if (/receb.*(mensagem|sms).*(estran|suspeito|n[aã]o.*sei|n[aã]o.*conhe)/.test(t)) return "phishing_bank";
  if (/ligaram.*falar|me ligaram|receb.*liga[cç][aã]o.*suspeita/.test(t)) return "phone_call_generic";
  if (/email.*estranho|link.*suspeito|mensagem.*suspeita|sms.*estranho/.test(t)) return "phishing_bank";

  return "vague";
}

// ─── Answer extraction ────────────────────────────────────────────────────────

function extractAnswers(text: string, pending: QuestionKey[]): Partial<KnownFacts> {
  const t = text.toLowerCase();
  const facts: Partial<KnownFacts> = {};

  const has = (pattern: RegExp) => pattern.test(t);

  if (pending.includes("typed_password")) {
    if (has(/n[aã]o.*(digit|senha|col|inser)|sem.*senha|não.*inform.*senha/)) facts.typed_password = "no";
    else if (has(/digit|coloquei|inseri|informei|passei.*senha|coloqu.*senha/)) facts.typed_password = "yes";
  }

  if (pending.includes("clicked_link")) {
    if (has(/n[aã]o.*(cliqu|abri.*link|acess.*link)|nem.*cliqu/)) facts.clicked_link = "no";
    // "pediram pra clicar" / "mandaram pra clicar" = link existe mas usuário não clicou
    else if (has(/pedir|pediram|pediu|mandaram.*clicar|falaram.*clicar|disseram.*clicar/)) {
      facts.link_in_message = "yes"; // confirma existência do link mas não clique
    } else if (has(/cliqu(ei|ou)|entrei.*link|abri.*link|acess.*link/)) facts.clicked_link = "yes";
  }

  if (pending.includes("installed_app")) {
    if (has(/n[aã]o.*(instal|baix)|nem.*instal|nao.*download/)) facts.installed_app = "no";
    else if (has(/instal|baixei|download/)) facts.installed_app = "yes";
  }

  if (pending.includes("made_transfer")) {
    if (has(/n[aã]o.*(transfer|pix|envi|mand)|nem.*mandei|ainda n[aã]o/)) facts.made_transfer = "no";
    else if (has(/transferi|mandei.*pix|fiz.*pix|enviei.*dinheiro|paguei/)) facts.made_transfer = "yes";
  }

  if (pending.includes("shared_code")) {
    if (has(/n[aã]o.*(compartilh|c[oó]digo|pass.*cod)|n[aã]o.*falei.*cod/)) facts.shared_code = "no";
    else if (has(/compartilhei|passei.*c[oó]digo|enviei.*c[oó]digo|falei.*c[oó]digo|mand.*codigo/)) facts.shared_code = "yes";
  }

  if (pending.includes("gave_data")) {
    if (has(/n[aã]o.*(dei|passei|inform|cpf|cart)|sem.*dado/)) facts.gave_data = "no";
    else if (has(/dei.*dado|passei.*cpf|informei.*cpf|n[uú]mero.*cart|falei.*cpf/)) facts.gave_data = "yes";
  }

  if (pending.includes("contact_channel")) {
    if (has(/whatsapp|zap|wpp/)) facts.contact_channel = "WhatsApp";
    else if (has(/sms|mensagem de texto/)) facts.contact_channel = "SMS";
    else if (has(/email|e-mail/)) facts.contact_channel = "e-mail";
    else if (has(/ligo|ligou|liga[cç][aã]o|telefone/)) facts.contact_channel = "ligação";
  }

  if (pending.includes("confirmed_person")) {
    if (has(/n[aã]o.*(conseg|ligu|atend)|nao.*ligu|nao.*atend/)) facts.confirmed_person = "no";
    else if (has(/liguei.*ela|liguei.*ele|falei.*diret|confirm|era ela|era ele|atendeu/)) facts.confirmed_person = "yes";
  }

  if (pending.includes("money_in_account")) {
    if (has(/n[aã]o entrou|nao.*cai|so.*print|s[oó].*comprovante|n[aã]o.*confirm.*banco/)) facts.money_in_account = "no";
    else if (has(/entrou|caiu.*conta|confirm.*app|vi.*app.*banco|recebi mesmo/)) facts.money_in_account = "yes";
  }

  if (pending.includes("product_delivered")) {
    if (has(/n[aã]o.*entreg|ainda n[aã]o|n[aã]o.*mand.*produto/)) facts.product_delivered = "no";
    else if (has(/entregu|j[aá].*mandei|j[aá].*foi|produto.*saiu/)) facts.product_delivered = "yes";
  }

  if (pending.includes("lost_access")) {
    if (has(/perdi.*acesso|n[aã]o.*conseg.*abr|n[aã]o.*entr.*whatsapp|bloqueado|expulso/)) facts.lost_access = "yes";
    else if (has(/ainda.*consigo|t[aá].*normal|consigo.*abr|funciona/)) facts.lost_access = "no";
  }

  if (pending.includes("contacts_got_messages")) {
    if (has(/sim.*receb|receberam|me avis|ligaram.*meu numero|falaram.*msg estranha/)) facts.contacts_got_messages = "yes";
    else if (has(/n[aã]o.*receb|nada|ningue|ninguem/)) facts.contacts_got_messages = "no";
  }

  if (pending.includes("asked_for_money")) {
    if (has(/n[aã]o.*(pediu|pediram).*dinheiro|nao.*cobr|nao pediu/)) facts.asked_for_money = "no";
    else if (has(/pediu.*dinheiro|pediram.*pix|pediram.*transfer|queriam.*dinheiro|cobr/)) facts.asked_for_money = "yes";
  }

  if (pending.includes("has_subscription")) {
    if (has(/n[aã]o.*(assino|tenho|uso)|cancelei|nunca tive|nao.*assino/)) facts.has_subscription = "no";
    else if (has(/sim.*assino|tenho.*assinatura|assino|pago.*todo.*mes|uso sim/)) facts.has_subscription = "yes";
  }

  if (pending.includes("link_in_message")) {
    if (has(/n[aã]o.*link|sem.*link|n[aã]o.*tinha.*link/)) facts.link_in_message = "no";
    else if (has(/tinha.*link|veio.*link|link.*sim|url|clicav|pra.*clicar|clicar.*link|mand.*link|pediu.*link|pediram.*link|link.*clicar/)) facts.link_in_message = "yes";
  }

  if (pending.includes("official_channel")) {
    if (has(/app.*oficial|dentro.*app|pelo.*aplicativo|no.*aplicativo/)) facts.official_channel = "yes";
    else if (has(/link.*externo|whatsapp|sms|email|fora.*app|n[aã]o.*app|mensagem/)) facts.official_channel = "no";
  }

  if (pending.includes("number_known")) {
    if (has(/n[uú]mero.*salvo|era.*contato|era.*banco|n[uú]mero.*oficial|reconheci/)) facts.number_known = "yes";
    else if (has(/n[uú]mero.*estranho|nao.*salvo|desconhecido|n[aã]o.*reconhec|nao era salvo/)) facts.number_known = "no";
  }

  if (pending.includes("who_called_id")) {
    const match = t.match(/banco|serasa|receita federal|policia|governo|operadora|nubank|bradesco|itau|caixa|netflix|spotify|amazon|mercado livre/);
    if (match) facts.who_called_id = match[0];
  }

  if (pending.includes("verified_business")) {
    if (has(/selo|verificado|oficial.*whatsapp|icone.*verde|icone.*azul|check.*verde|conta.*oficial/)) facts.verified_business = "yes";
    else if (has(/n[aã]o.*selo|n[aã]o.*verific|n[aã]o.*oficial|sem.*verifica|n[aã]o tem.*icon|numero.*comum|numero.*normal/)) facts.verified_business = "no";
  }

  return facts;
}

// ─── Signal-based scorer (runs directly on raw text, à prova de falha) ────────

function scoreRawSignals(allText: string): number {
  const t = allText.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  let score = 0;

  // Ações irreversíveis — emergência
  if (has(/transferi|fiz.*pix|mandei.*pix|enviei.*dinheiro|realizei.*transfer/)) score += 7;
  if (has(/compartilhei.*c[oó]digo|passei.*c[oó]digo|enviei.*c[oó]digo|falei.*c[oó]digo/)) score += 6;
  if (has(/digitei.*senha|coloquei.*senha|inseri.*senha|informei.*senha/)) score += 6;

  // Banco + canal informal = quase sempre golpe
  const hasBankName = has(/banco|nubank|bradesco|itau|itaú|caixa|santander|serasa|receita federal|safra|inter|c6/);
  const hasInformalChannel = has(/whatsapp|zap|wpp|sms|mensagem de texto/);
  if (hasBankName && hasInformalChannel) score += 5;

  // Link suspeito
  if (has(/link.*(estranho|suspeito|estranha|esquisito|bizarro|n[aã]o.*conhe)/)) score += 4;
  if (has(/mensagem.*(estranha|suspeita|esquisita|estranho)|email.*(estranho|suspeito)/)) score += 3;
  if (has(/cliquei.*link|link.*cliquei|acessei.*link|abri.*link|entrei.*link/)) score += 3;
  if (has(/link.*banco|banco.*link|link.*pix|link.*transfer/)) score += 4;

  // Instalação suspeita
  if (has(/instalei.*app|baixei.*app|download.*app|instalar.*programa/)) score += 4;

  // Golpes específicos
  if (has(/cpf.*(bloqueado|irregular|suspenso|cancelado)/)) score += 4;
  if (has(/c[oó]digo.*(chegou|recebi).*(sem.*entrar|sem.*abrir|n[aã]o.*fiz|n[aã]o.*abri)/)) score += 5;
  if (has(/(recebi|chegou).*c[oó]digo.*(sem|n[aã]o)/)) score += 5;
  if (has(/uber.*buscar|produto.*entregar.*comprovante/)) score += 5;
  if (has(/emprest(imo|aram).*meu nome|meu nome.*emprestimo/)) score += 4;
  if (has(/falso parente|trocou.*n[uú]mero|novo n[uú]mero.*(pix|dinheiro)/)) score += 5;
  if (has(/clonaram.*whatsapp|whatsapp.*clonado|clon.*whatsapp/)) score += 5;

  // Pressão / urgência
  if (has(/urgente|imediatamente|agora mesmo|bloqueado|suspenso|cancelado|irregular/)) score += 1;

  return Math.min(10, score);
}

// ─── Risk scoring ─────────────────────────────────────────────────────────────

const CATEGORY_BASE_RISK: Record<ScamCategory, number> = {
  already_transferred: 9,
  sms_code_unsolicited: 7,
  whatsapp_clone: 6,
  fake_relative: 6,
  marketplace_fraud: 5,
  phishing_bank: 5,
  cpf_block_threat: 5,
  card_fraud: 5,
  pix_confirm: 5,
  number_spoofing: 5,
  loan_fraud: 4,
  car_accident_pressure: 4,
  forgotten_money: 4,
  phishing_marketplace: 4,
  phishing_email_service: 3,
  virus_scareware: 3,
  phone_call_generic: 3,
  vague: 3,
};

function calculateRisk(category: ScamCategory | null, facts: KnownFacts): number {
  if (!category) return 3;
  let risk = CATEGORY_BASE_RISK[category];

  if (facts.made_transfer === "yes") risk += 5;
  if (facts.shared_code === "yes") risk += 3;
  if (facts.typed_password === "yes") risk += 3;
  if (facts.installed_app === "yes") risk += 2;
  if (facts.gave_data === "yes") risk += 2;
  if (facts.clicked_link === "yes") risk += 1;
  if (facts.lost_access === "yes") risk += 3;
  if (facts.asked_for_money === "yes") risk += 2;
  if (facts.money_in_account === "no") risk += 2;
  if (facts.official_channel === "no") risk += 2;
  if (facts.has_subscription === "no") risk += 2;
  if (facts.contacts_got_messages === "yes") risk += 2;
  if (facts.number_known === "no") risk += 1;
  if (facts.link_in_message === "yes") risk += 1;
  if (facts.product_delivered === "yes" && facts.money_in_account === "no") risk += 3;

  // Penalidades cruzadas — combinações que são quase sempre golpe
  const isAuthClaim = !!facts.who_called_id || category === "phishing_bank" || category === "cpf_block_threat" || category === "card_fraud";
  const isInformalChannel = facts.contact_channel === "WhatsApp" || facts.contact_channel === "SMS";
  if (isInformalChannel && isAuthClaim) risk += 4; // banco/governo não usa WhatsApp/SMS pra contato ativo
  if (facts.link_in_message === "yes" && isAuthClaim) risk += 2; // autoridade + link = red flag
  if (facts.clicked_link === "yes" && isAuthClaim) risk += 1;
  // Independente de autoridade: link via WhatsApp/SMS já é suspeito por si só
  if (isInformalChannel && facts.link_in_message === "yes") risk += 3;
  if (isInformalChannel && facts.clicked_link === "yes") risk += 2;
  // Link estranho sem contexto claro também levanta risco
  if (facts.link_in_message === "yes" && (category === "phishing_bank" || category === "vague")) risk += 2;
  if (facts.verified_business === "no") risk += 3; // WhatsApp sem verificação oficial = alto risco
  if (facts.verified_business === "yes") risk -= 2; // conta verificada reduz, mas não elimina risco

  // Reductions — só reduzem risco, nunca abaixo do base da categoria
  const base = CATEGORY_BASE_RISK[category];
  if (facts.typed_password === "no") risk -= 1;
  if (facts.shared_code === "no") risk -= 1;
  if (facts.made_transfer === "no") risk -= 0; // transferência não feita não reduz — situação ainda é suspeita
  if (facts.installed_app === "no") risk -= 0;
  if (facts.gave_data === "no") risk -= 0;
  if (facts.clicked_link === "no") risk -= 0;
  if (facts.official_channel === "yes") risk -= 1;
  if (facts.has_subscription === "yes") risk -= 1; // assina o serviço → menos suspeito
  if (facts.confirmed_person === "yes") risk -= 2; // confirmou identidade → reduz, mas não zera
  if (facts.asked_for_money === "no") risk -= 0;
  if (facts.money_in_account === "yes") risk -= 1;

  // Nunca cai abaixo do base da categoria — respostas negativas não absolvem
  return Math.max(base, Math.min(10, Math.round(risk)));
}

// ─── Initial responses ────────────────────────────────────────────────────────

function getInitialContext(category: ScamCategory, userText: string): string {
  const t = userText.toLowerCase();
  switch (category) {
    case "whatsapp_clone":
      return "Entendi — isso pode ser sério. Vamos investigar.";
    case "fake_relative":
      return "Atenção: esse padrão é muito comum em golpes de falso parente. Antes de qualquer ação, preciso entender melhor.";
    case "cpf_block_threat":
      return "Pode respirar — CPF não é bloqueado por SMS ou ligação. Mas vamos verificar o que aconteceu.";
    case "loan_fraud":
      return "Entendi. Pode ser golpe ou situação real — preciso de mais informações pra saber.";
    case "car_accident_pressure":
      return "Calma. Esse tipo de situação é muito usado pra criar pressão emocional. Vamos entender antes de agir.";
    case "virus_scareware":
      return "Esse tipo de aviso quase sempre é falso — existe pra te assustar. Vamos verificar.";
    case "forgotten_money":
      return "Esse é um golpe muito comum, especialmente com o tema de \"valores esquecidos\". Vamos checar.";
    case "sms_code_unsolicited":
      return "⚠️ Atenção — código chegando sem você ter feito nada é sinal de alerta alto. Alguém pode estar tentando acessar sua conta.";
    case "marketplace_fraud":
      return "Cuidado — esse é um golpe clássico de marketplace com comprovante falso.";
    case "pix_confirm":
      return "Preciso entender melhor o que aconteceu antes de concluir.";
    case "card_fraud":
      return "Pode ser fraude real ou engenharia social. Vamos investigar.";
    case "number_spoofing":
      return "Boa percepção — número oficial não garante nada. Números podem ser falsificados.";
    case "phishing_marketplace":
      return t.includes("amazon")
        ? "Esse pedido existe de verdade na Amazon — mas também é imitado em golpes. A diferença está no canal."
        : "Depende muito de onde esse pedido veio. Vamos verificar.";
    case "phishing_email_service":
      return "Pode ser legítimo ou phishing — e-mails de \"pagamento falhou\" são muito usados em golpes.";
    case "phishing_bank": {
      const hasWhatsApp = t.includes("whatsapp") || t.includes("zap") || t.includes("wpp");
      const hasBank = /banco|nubank|bradesco|itau|caixa|santander/.test(t);
      if (hasWhatsApp && hasBank)
        return "⚠️ Atenção — banco não entra em contato por WhatsApp pedindo qualquer ação. Se não for um canal oficial verificado, a probabilidade de golpe é alta. Vamos investigar.";
      return "Entendi. Vamos apurar o que aconteceu.";
    }
    case "already_transferred":
      return "⚠️ Situação urgente. Ainda pode ser possível reverter.\n\nFaça AGORA:\n1. Ligue pro seu banco (número no verso do cartão)\n2. Informe que foi fraude e peça bloqueio da transação\n3. Registre B.O. em delegaciaonline.mj.gov.br\n\nEnquanto faz isso, me conta: qual banco e quanto faz que transferiu?";
    case "phone_call_generic":
      return "Entendi. Pra avaliar se foi golpe, preciso de alguns detalhes.";
    default:
      return "Entendi que algo te deixou desconfiado. Me conta mais — não precisa organizar, fala como quiser.";
  }
}

// ─── Acknowledgment of new answers ───────────────────────────────────────────

function buildAcknowledgment(
  newFacts: Partial<KnownFacts>,
  oldRisk: number,
  newRisk: number,
  category: ScamCategory | null
): string {
  // Emergency triggers
  if (newFacts.made_transfer === "yes") {
    return "⚠️ Isso muda tudo — ainda há chance de reverter.\n\nFaça agora:\n1. Ligue pro banco imediatamente (número no verso do cartão)\n2. Informe fraude e peça bloqueio da transação\n3. Depois registre B.O. em delegaciaonline.mj.gov.br\n\n";
  }
  if (newFacts.shared_code === "yes") {
    return "⚠️ Com o código compartilhado, sua conta pode estar comprometida agora.\n\nAja imediatamente:\n1. Abra o WhatsApp → Configurações → Conta → Verificação em duas etapas → Ative com um PIN\n2. Se perdeu o acesso: reinstale o WhatsApp e recupere pelo seu número\n\n";
  }
  if (newFacts.typed_password === "yes") {
    return "⚠️ Senha digitada em site não oficial é sério — podem acessar sua conta.\n\nAgora:\n1. Acesse o app OFICIAL do banco e troque a senha\n2. Ligue pra central de fraudes do banco\n3. Confira se há transações suspeitas\n\n";
  }
  if (newFacts.product_delivered === "yes" && newFacts.money_in_account === "no") {
    return "⚠️ Você entregou o produto sem o dinheiro realmente ter entrado — isso é o golpe do comprovante falso.\n\nRegistre boletim de ocorrência em delegaciaonline.mj.gov.br e guarde todas as conversas como prova.\n\n";
  }

  // Risk increased
  if (newRisk > oldRisk + 1) {
    if (newFacts.contact_channel === "WhatsApp" || newFacts.contact_channel === "SMS")
      return "Banco ou órgão oficial nunca entra em contato por WhatsApp ou SMS pedindo ação — isso já é um sinal vermelho forte.\n\n";
    if (newFacts.link_in_message === "yes") return "Link enviado por quem diz ser banco ou empresa é um dos vetores mais comuns de golpe.\n\n";
    if (newFacts.money_in_account === "no") return "Exatamente o que suspeitava — comprovante falso é o golpe clássico de marketplace.\n\n";
    if (newFacts.official_channel === "no") return "Pedido fora do app oficial é sinal vermelho claro.\n\n";
    if (newFacts.has_subscription === "no") return "Importante: você não assina esse serviço, então esse e-mail definitivamente não é legítimo.\n\n";
    if (newFacts.installed_app === "yes") return "App instalado por orientação externa é risco alto — pode dar acesso remoto ao seu celular.\n\n";
    if (newFacts.gave_data === "yes") return "Dados pessoais compartilhados aumentam o risco — podem ser usados em outros golpes.\n\n";
    if (newFacts.contacts_got_messages === "yes") return "Contatos recebendo mensagens confirma que o WhatsApp foi comprometido.\n\n";
    if (newFacts.asked_for_money === "yes") return "Pedido de dinheiro é uma confirmação forte de golpe.\n\n";
    if (newFacts.clicked_link === "yes") return "O clique no link abre uma janela de risco, mesmo sem ter digitado nada ainda.\n\n";
    return "Isso aumenta a suspeita.\n\n";
  }

  // Risk decreased
  if (newRisk < oldRisk - 1) {
    if (newFacts.confirmed_person === "yes") return "Ótimo que conseguiu confirmar diretamente — isso desmonta o golpe.\n\n";
    if (newFacts.typed_password === "no") return "Bom — sem senha digitada, o risco cai bastante.\n\n";
    if (newFacts.official_channel === "yes") return "Dentro do app oficial é um sinal positivo.\n\n";
    if (newFacts.has_subscription === "yes") return "Faz sentido você ter recebido — você tem a assinatura ativa.\n\n";
    if (newFacts.shared_code === "no") return "Ótimo que não compartilhou o código — isso protegeu sua conta.\n\n";
    if (newFacts.asked_for_money === "no") return "Sem pedido de dinheiro por enquanto — vamos continuar investigando.\n\n";
    if (newFacts.money_in_account === "yes") return "Se você conferiu direto no app do banco, o pagamento parece real.\n\n";
    return "Isso reduz o risco.\n\n";
  }

  // Neutral — just acknowledge specific answers
  const notes: string[] = [];
  if (newFacts.contact_channel) notes.push(`Chegou por ${newFacts.contact_channel} — anotado.`);
  if (newFacts.number_known === "no") notes.push("Número desconhecido na agenda é um ponto de atenção.");
  if (newFacts.number_known === "yes") notes.push("Número salvo na agenda, mas isso não garante que é legítimo — números podem ser falsificados.");
  if (newFacts.who_called_id) notes.push(`Se identificaram como "${newFacts.who_called_id}".`);
  if (newFacts.link_in_message === "yes") notes.push("Link presente na mensagem — isso já é um elemento de risco.");
  if (newFacts.link_in_message === "no") notes.push("Sem link na mensagem — ponto positivo.");
  if (newFacts.lost_access === "no") notes.push("Ainda tem acesso — o clone pode não ter sido concluído.");
  if (newFacts.installed_app === "no") notes.push("Sem instalação de app — risco menor.");
  if (newFacts.clicked_link === "no") notes.push("Não clicou no link — bom.");

  return notes.length > 0 ? notes[0] + "\n\n" : "";
}

// ─── Final assessment ─────────────────────────────────────────────────────────

function buildFinalAssessment(category: ScamCategory | null, facts: KnownFacts, risk: number): string {
  const isScam = risk >= 5;
  const riskLabel = risk >= 8 ? "muito alto" : risk >= 5 ? "moderado a alto" : "baixo";

  if (!isScam) {
    return `Com base no que você me contou, o risco é ${riskLabel}. Parece que pode ser uma situação legítima, mas mantenha o cuidado.\n\nSe surgir qualquer pedido de senha, código, transferência ou instalação de app — desconfie imediatamente. Tem mais alguma coisa que te deixou na dúvida?`;
  }

  const tips: string[] = [];
  if (facts.installed_app === "yes") tips.push("Desinstale o app suspeito e faça varredura com antivírus");
  if (facts.gave_data === "yes") tips.push("Monitore seu CPF em serasa.com.br e registrosim.com.br");
  if (facts.clicked_link === "yes") tips.push("Monitore suas contas bancárias nos próximos dias");
  tips.push("Bloqueie o número/contato suspeito");
  tips.push("Alerte familiares sobre esse tipo de golpe");
  if (risk >= 7) tips.push("Registre boletim de ocorrência em delegaciaonline.mj.gov.br");

  return `Com base em tudo que me contou, isso tem ${riskLabel} de ser um golpe — risco ${risk}/10.\n\nRecomendações:\n${tips.map((t) => `✓ ${t}`).join("\n")}\n\nPrecisa de ajuda com algum passo específico?`;
}

// ─── Format pending questions ─────────────────────────────────────────────────

function formatPendingQuestions(pending: QuestionKey[], max = 3): string {
  const slice = pending.slice(0, max);
  if (slice.length === 0) return "";
  return slice.map((k) => `• ${QUESTION_TEXTS[k]}`).join("\n");
}

// ─── Main build response ──────────────────────────────────────────────────────

function buildResponse(
  state: ConvState,
  userText: string
): { response: string; newState: ConvState } {
  // First turn
  if (state.turnCount === 0) {
    const category = detectCategory(userText);
    const pending: QuestionKey[] = [...(CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS.vague)];
    const risk = calculateRisk(category, {});

    if (category === "already_transferred") {
      const newState: ConvState = { category, knownFacts: { made_transfer: "yes" }, riskScore: 9, pendingQuestions: [], turnCount: 1, resolved: false };
      return { response: getInitialContext(category, userText), newState };
    }

    // Extrai fatos já presentes na primeira mensagem
    const firstFacts = extractAnswers(userText, pending);
    const initialFacts: KnownFacts = { ...firstFacts };
    const answeredFirst = Object.keys(firstFacts) as QuestionKey[];
    const remainingPending = pending.filter((q) => !answeredFirst.includes(q));
    // Risco = max(scoring por categoria/fatos, scoring direto de sinais no texto)
    const initialRisk = Math.max(calculateRisk(category, initialFacts), scoreRawSignals(userText));

    const context = getInitialContext(category, userText);
    const questions = formatPendingQuestions(remainingPending, 3);
    const response = questions
      ? `${context}\n\nPra entender melhor:\n${questions}`
      : context;
    const newState: ConvState = { category, knownFacts: initialFacts, riskScore: initialRisk, pendingQuestions: remainingPending, turnCount: 1, resolved: false, allUserText: userText };
    return { response, newState };
  }

  const { category, knownFacts, riskScore, pendingQuestions, allUserText } = state;

  // Extract new answers
  const newFacts = extractAnswers(userText, pendingQuestions);
  const updatedFacts: KnownFacts = { ...knownFacts, ...newFacts };
  const accumulatedText = allUserText + " " + userText;
  const categoryFloor = CATEGORY_BASE_RISK[category ?? "vague"];
  // Risco: máximo entre score atual, sinais brutos, e o base da categoria
  // Respostas "não" nunca levam risco abaixo do que a situação em si já indica
  const newRisk = Math.max(calculateRisk(category, updatedFacts), scoreRawSignals(accumulatedText), categoryFloor);

  // Remove answered questions
  const answeredKeys = Object.keys(newFacts) as QuestionKey[];
  const remaining = pendingQuestions.filter((q) => !answeredKeys.includes(q));

  const newState: ConvState = {
    ...state,
    knownFacts: updatedFacts,
    riskScore: newRisk,
    pendingQuestions: remaining,
    turnCount: state.turnCount + 1,
    allUserText: accumulatedText,
  };

  // Emergency — stop asking questions
  const emergency =
    newFacts.made_transfer === "yes" ||
    newFacts.shared_code === "yes" ||
    newFacts.typed_password === "yes" ||
    (newFacts.product_delivered === "yes" && updatedFacts.money_in_account === "no");

  if (emergency) {
    const ack = buildAcknowledgment(newFacts, riskScore, newRisk, category);
    newState.resolved = true;
    return { response: ack.trimEnd(), newState };
  }

  // Build acknowledgment
  const ack = buildAcknowledgment(newFacts, riskScore, newRisk, category);

  // All questions answered
  if (remaining.length === 0) {
    newState.resolved = true;
    const assessment = buildFinalAssessment(category, updatedFacts, newRisk);
    return { response: ack + assessment, newState };
  }

  // Still questions left — ask up to 2 more
  const nextQuestions = formatPendingQuestions(remaining, 2);
  const bridges = [
    "Mais algumas coisas:",
    "Continuando:",
    "Agora me diz:",
    "Pra completar o quadro:",
  ];
  const bridge = bridges[state.turnCount % bridges.length];

  const response = `${ack}${bridge}\n${nextQuestions}`;
  return { response, newState };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Chat() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Me conta o que aconteceu — pode falar do jeito que quiser, sem precisar organizar. Tô aqui pra ajudar.",
      sender: "analyst",
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [convState, setConvState] = useState<ConvState>({
    category: null,
    knownFacts: {},
    riskScore: 0,
    pendingQuestions: [],
    turnCount: 0,
    resolved: false,
    allUserText: "",
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputMessage.trim() || isTyping) return;

    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      time: now,
    };

    const currentInput = inputMessage;
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const { response, newState } = buildResponse(convState, currentInput);
      setConvState(newState);
      const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: response, sender: "analyst", time: replyTime },
      ]);
      setIsTyping(false);
    }, 1100 + Math.random() * 600);
  };

  const getRiskBadge = () => {
    const { riskScore, category, turnCount } = convState;
    if (!category || turnCount === 0) return null;

    if (riskScore >= 8)
      return (
        <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full font-medium">
          <AlertTriangle className="w-3 h-3" /> Risco alto · {riskScore}/10
        </span>
      );
    if (riskScore >= 5)
      return (
        <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full font-medium">
          <AlertTriangle className="w-3 h-3" /> Suspeito · {riskScore}/10
        </span>
      );
    if (riskScore > 0)
      return (
        <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full font-medium">
          <CheckCircle className="w-3 h-3" /> Risco baixo · {riskScore}/10
        </span>
      );
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Cabeçalho fixo */}
      <header
        className="flex-shrink-0"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "2px solid #D1D5DB",
          padding: "16px 20px",
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center rounded-xl transition-colors"
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EEF4FF")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Voltar"
          >
            <ArrowLeft style={{ width: 24, height: 24, color: "#111827" }} strokeWidth={2.5} />
          </button>

          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#EEF4FF",
            }}
            aria-hidden="true"
          >
            <Shield style={{ width: 22, height: 22, color: "#1E3A5F" }} strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 style={{ color: "#111827", fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
                Assistente Anti-Golpe
              </h1>
              {getRiskBadge()}
            </div>
            <p
              className="flex items-center gap-1.5"
              style={{ color: "#16A34A", fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#16A34A" }}
                aria-hidden="true"
              />
              {isTyping ? "Digitando..." : "Online"}
            </p>
          </div>
        </div>
      </header>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-[430px] mx-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "analyst" && (
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    backgroundColor: "#EEF4FF",
                    marginRight: 8,
                    marginTop: 4,
                  }}
                  aria-hidden="true"
                >
                  <Shield style={{ width: 18, height: 18, color: "#1E3A5F" }} strokeWidth={2.5} />
                </div>
              )}
              <div
                className="rounded-2xl"
                style={{
                  maxWidth: message.sender === "user" ? "85%" : "80%",
                  padding: "12px 16px",
                  backgroundColor: message.sender === "user" ? "#1E3A5F" : "#F3F4F6",
                  border: message.sender === "analyst" ? "1.5px solid #D1D5DB" : "none",
                  borderBottomRightRadius: message.sender === "user" ? "4px" : undefined,
                  borderBottomLeftRadius: message.sender === "analyst" ? "4px" : undefined,
                  wordWrap: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <p
                  className="whitespace-pre-line"
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: message.sender === "user" ? "#FFFFFF" : "#111827",
                  }}
                >
                  {message.text}
                </p>
                <span
                  className="block"
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    color: message.sender === "user" ? "rgba(255,255,255,0.7)" : "#6B7280",
                    textAlign: message.sender === "user" ? "right" : "left",
                  }}
                >
                  {message.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  backgroundColor: "#EEF4FF",
                  marginRight: 8,
                }}
                aria-hidden="true"
              >
                <Shield style={{ width: 18, height: 18, color: "#1E3A5F" }} strokeWidth={2.5} />
              </div>
              <div
                className="rounded-2xl"
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#F3F4F6",
                  border: "1.5px solid #D1D5DB",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <div className="flex gap-1 items-center" style={{ height: 20 }}>
                  <span
                    className="rounded-full animate-bounce"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#9CA3AF",
                      animationDelay: "0ms",
                    }}
                  />
                  <span
                    className="rounded-full animate-bounce"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#9CA3AF",
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="rounded-full animate-bounce"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#9CA3AF",
                      animationDelay: "300ms",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Campo de digitação fixo */}
      <div
        className="flex-shrink-0"
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "2px solid #D1D5DB",
          padding: "12px 16px 20px",
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center gap-2">
          <button
            className="flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Anexar arquivo"
          >
            <Paperclip style={{ width: 22, height: 22, color: "#6B7280" }} strokeWidth={2} />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Me conta o que aconteceu..."
            disabled={isTyping}
            aria-label="Digite sua mensagem"
            className="flex-1 rounded-xl outline-none transition-colors"
            style={{
              height: 48,
              minHeight: 48,
              padding: "0 16px",
              fontSize: 15,
              backgroundColor: "#F0F4F8",
              border: "2px solid #D1D5DB",
              color: "#111827",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1E3A5F";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <button
            className="flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Gravar áudio"
          >
            <Mic style={{ width: 22, height: 22, color: "#6B7280" }} strokeWidth={2} />
          </button>

          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isTyping}
            aria-label="Enviar mensagem"
            className="flex items-center justify-center rounded-xl transition-all flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              minWidth: 48,
              backgroundColor: !inputMessage.trim() || isTyping ? "#9CA3AF" : "#1E3A5F",
              color: "#FFFFFF",
              cursor: !inputMessage.trim() || isTyping ? "not-allowed" : "pointer",
              opacity: !inputMessage.trim() || isTyping ? 0.6 : 1,
            }}
          >
            <Send style={{ width: 20, height: 20 }} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
