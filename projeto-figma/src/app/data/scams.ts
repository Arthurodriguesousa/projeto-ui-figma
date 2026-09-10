export type ScamReport = {
  id: number;
  title: string;
  time: string;
  reports: number;
  category: string;
  severity: "Alta" | "Média" | "Baixa";
  description: string;
  tips: string[];
  reporter: string;
};

export const scamReports: ScamReport[] = [
  {
    id: 1,
    title: "Link Suspeito de Phishing Bancário",
    time: "Há 2h",
    reports: 12,
    category: "Phishing",
    severity: "Alta",
    description:
      "Mensagem SMS contendo link encurtado que direciona para uma página falsa idêntica ao site do banco, solicitando login, senha e token. Os criminosos capturam essas informações para realizar transferências não autorizadas.",
    tips: [
      "Nunca clique em links recebidos por SMS ou WhatsApp solicitando login bancário",
      "Acesse sempre o app oficial do banco digitando o endereço manualmente",
      "Verifique se o domínio do site é o oficial antes de inserir credenciais",
      "Ative a autenticação de dois fatores em sua conta bancária",
    ],
    reporter: "Carlos M.",
  },
  {
    id: 2,
    title: "Boleto Falso de Cobrança",
    time: "Há 3 min",
    reports: 5,
    category: "Boleto",
    severity: "Alta",
    description:
      "Boletos enviados por email simulando cobranças de empresas conhecidas como concessionárias e operadoras. O código de barras direciona o pagamento para contas de terceiros.",
    tips: [
      "Confira sempre o beneficiário do boleto antes de pagar",
      "Verifique o valor e data de vencimento com a empresa emissora",
      "Desconfie de boletos recebidos por email sem solicitação prévia",
      "Use o app do banco para validar a autenticidade do boleto",
    ],
    reporter: "Ana P.",
  },
  {
    id: 3,
    title: "Mensagem WhatsApp Clonagem",
    time: "Há 5h",
    reports: 8,
    category: "WhatsApp",
    severity: "Alta",
    description:
      "Criminosos se passam por funcionários de operadoras solicitando código de verificação de 6 dígitos enviado por SMS, usado para clonar a conta do WhatsApp e aplicar golpes nos contatos.",
    tips: [
      "Nunca compartilhe códigos de verificação com ninguém",
      "Ative a verificação em duas etapas no WhatsApp",
      "Desconfie de ligações solicitando códigos de segurança",
      "Avise familiares caso receba pedidos estranhos de dinheiro",
    ],
    reporter: "Lucas R.",
  },
  {
    id: 4,
    title: "PIX Falso - Golpe do Emprego",
    time: "Há 1 dia",
    reports: 23,
    category: "PIX",
    severity: "Alta",
    description:
      "Falsa oferta de emprego que solicita pagamento via PIX para taxa de cadastro, exames ou uniforme. Após o pagamento, o suposto recrutador desaparece.",
    tips: [
      "Empresas sérias nunca cobram taxas para contratação",
      "Pesquise o nome da empresa em sites como Reclame Aqui",
      "Desconfie de ofertas com salários muito acima do mercado",
      "Não faça PIX para pessoas físicas em processos seletivos",
    ],
    reporter: "Marina S.",
  },
  {
    id: 5,
    title: "Email Falso da Receita Federal",
    time: "Há 2 dias",
    reports: 31,
    category: "Email",
    severity: "Média",
    description:
      "Email se passando pela Receita Federal informando irregularidades no CPF e solicitando regularização através de link malicioso que instala vírus ou rouba dados.",
    tips: [
      "A Receita Federal não envia emails com links de regularização",
      "Consulte seu CPF apenas no site oficial gov.br",
      "Não baixe anexos de emails suspeitos",
      "Mantenha seu antivírus sempre atualizado",
    ],
    reporter: "Ricardo F.",
  },
  {
    id: 6,
    title: "Golpe do Falso Sequestro",
    time: "Há 3 dias",
    reports: 15,
    category: "Telefone",
    severity: "Alta",
    description:
      "Ligações alegando sequestro de familiares para forçar pagamento imediato via PIX. Os criminosos usam gritos e choros pré-gravados para criar pânico.",
    tips: [
      "Mantenha a calma e tente contatar o familiar por outro meio",
      "Combine uma palavra-código com a família para emergências",
      "Nunca faça PIX sob pressão emocional",
      "Procure a polícia imediatamente em casos suspeitos",
    ],
    reporter: "Fernanda L.",
  },
];
