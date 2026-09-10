import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "Como funciona a análise de golpes por IA?",
    answer: "Nossa inteligência artificial foi treinada com milhares de exemplos de golpes e fraudes. Ela analisa padrões de linguagem, URLs suspeitas, técnicas de engenharia social e outros indicadores para determinar se um conteúdo é potencialmente perigoso.",
  },
  {
    id: 2,
    question: "Meus dados estão seguros?",
    answer: "Sim! Todos os seus dados são criptografados de ponta a ponta. Não compartilhamos suas informações pessoais com terceiros. As análises compartilhadas na comunidade são completamente anônimas.",
  },
  {
    id: 3,
    question: "Como reportar um golpe?",
    answer: "Clique no botão '+' na aba Comunidade, selecione a categoria do golpe, descreva o que aconteceu e adicione qualquer link ou plataforma relacionada. Seu report ajudará a proteger outros usuários.",
  },
  {
    id: 4,
    question: "O que fazer se a IA errar na análise?",
    answer: "Você pode conversar com um analista humano através do chat. Nossos especialistas revisarão o caso manualmente e fornecerão uma segunda opinião. Use o botão 'Falar com analista' nos resultados.",
  },
  {
    id: 5,
    question: "Posso verificar qualquer tipo de conteúdo?",
    answer: "Sim! Você pode verificar links, mensagens de WhatsApp, emails, SMS, boletos, imagens de conversas suspeitas e muito mais. Cole o texto ou anexe uma captura de tela.",
  },
  {
    id: 6,
    question: "Como recuperar minha senha?",
    answer: "Na tela de login, clique em 'Recuperar senha'. Enviaremos um link de redefinição para seu email cadastrado. O link expira em 1 hora por segurança.",
  },
  {
    id: 7,
    question: "Os reports da comunidade são verificados?",
    answer: "Sim! Nossa equipe revisa todos os reports antes de publicá-los na comunidade. Isso garante que apenas alertas legítimos sejam compartilhados.",
  },
  {
    id: 8,
    question: "Posso excluir meu histórico de análises?",
    answer: "Sim! Vá em Configurações > Privacidade e Segurança e desative 'Salvar Histórico'. Você também pode excluir análises individuais deslizando para a esquerda no histórico.",
  },
];

export function HelpCenter() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[430px] mx-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center gap-4 z-10">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl text-foreground">Central de Ajuda</h1>
        </div>

        <div className="px-6 py-8">
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-6">
            <h3 className="text-accent mb-2">Precisa de ajuda?</h3>
            <p className="text-sm text-foreground mb-4">
              Encontre respostas rápidas para as perguntas mais comuns
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Suporte
            </button>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-4">PERGUNTAS FREQUENTES</h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-5 flex items-start justify-between gap-4 hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-foreground flex-1">{faq.question}</span>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground border-t border-border pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-muted rounded-xl p-5 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Não encontrou o que procurava?
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="text-accent hover:underline"
            >
              Entre em contato com nossa equipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
