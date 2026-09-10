# Design System - App Chati

Sistema de design consistente e acessível para o aplicativo de detecção de golpes online.

---

## 🎨 Paleta de Cores

### Cores Semânticas

```css
/* Primária - Confiança e Navegação */
Primary:     #1976D2  /* Azul confiável */
Primary-fg:  #FFFFFF  /* Texto sobre azul */

/* Feedback de Estado */
Success:     #2E7D32  /* Verde - Seguro/Confirmação */
Warning:     #F57C00  /* Laranja - Alerta/Atenção */
Error:       #D32F2F  /* Vermelho - Crítico/Erro */

/* Base */
Background:  #FFFFFF  /* Fundo principal */
Foreground:  #212121  /* Texto principal */
Muted:       #F5F5F5  /* Fundo secundário */
Muted-fg:    #757575  /* Texto secundário */

/* Bordas e Inputs */
Border:      #E0E0E0  /* Bordas suaves */
Input:       #E0E0E0  /* Borda de input inativo */
```

### Uso de Cores

| Cor | Uso Principal | Nunca Use Para |
|-----|---------------|----------------|
| Azul #1976D2 | Botões primários, links, navegação ativa | Alertas de perigo |
| Verde #2E7D32 | Resultados seguros, sucesso | Avisos ou erros |
| Laranja #F57C00 | Alertas médios, avisos | Confirmações |
| Vermelho #D32F2F | Golpes críticos, erros, ações destrutivas | Ações primárias |
| Cinza #757575 | Texto secundário, metadata | Texto principal |

---

## 📏 Tipografia

### Hierarquia

```css
/* Títulos */
H1:     28px, peso 600, line-height 1.5  /* Título principal da tela */
H2:     20px, peso 600, line-height 1.5  /* Subtítulo de seção */
H3:     18px, peso 600, line-height 1.5  /* Subtítulo de grupo */
H4:     16px, peso 600, line-height 1.5  /* Label destacado */

/* Corpo */
Body:   16px, peso 400, line-height 1.5  /* Texto padrão */
Small:  14px, peso 400, line-height 1.5  /* Texto secundário */
Tiny:   12px, peso 400, line-height 1.5  /* Metadata (usar com moderação) */

/* Interativos */
Button: 16px, peso 600, line-height 1.5  /* Texto de botão */
Label:  16px, peso 600, line-height 1.5  /* Label de formulário */
Input:  16px, peso 400, line-height 1.5  /* Texto digitado */
```

### Boas Práticas

- **Nunca** use fonte menor que 14px (exceto metadata com ícone)
- **Sempre** use peso 600 para destaque (não bold 700)
- **Mantenha** line-height mínimo de 1.5 para legibilidade
- **Evite** CAPS LOCK excessivo (apenas botões de ação)

---

## 🔲 Componentes

### Botões

#### Botão Primário
```tsx
<button className="w-full min-h-[48px] bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl transition-colors font-medium">
  ENTRAR
</button>
```
- **Altura**: 48px (min-h-[48px])
- **Cor**: Azul #1976D2
- **Texto**: Branco, peso 600, 16px
- **Radius**: 12px
- **Hover**: 10% mais escuro

#### Botão Secundário
```tsx
<button className="w-full min-h-[48px] bg-card border-2 border-accent text-accent rounded-xl hover:bg-muted transition-colors font-medium">
  VOLTAR
</button>
```
- **Altura**: 48px
- **Cor**: Branco com borda azul 2px
- **Texto**: Azul #1976D2, peso 600
- **Hover**: Fundo cinza claro

#### Botão Destrutivo
```tsx
<button className="w-full min-h-[48px] bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors font-medium">
  EXCLUIR
</button>
```
- **Altura**: 48px
- **Cor**: Vermelho #D32F2F
- **Texto**: Branco, peso 600
- **Uso**: Apenas ações irreversíveis

#### Link/Botão de Texto
```tsx
<button className="text-accent hover:underline min-h-[44px] inline-flex items-center font-medium">
  Recuperar senha
</button>
```
- **Altura**: 44px (área de toque)
- **Cor**: Azul #1976D2
- **Hover**: Sublinhado

---

### Campos de Formulário

#### Input com Label
```tsx
<div>
  <label className="block mb-2 text-foreground">Email</label>
  <div className="relative">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <input
      type="email"
      placeholder="exemplo@email.com"
      className="w-full min-h-[56px] pl-12 pr-4 bg-input-background border-2 border-input focus:border-accent rounded-xl outline-none transition-colors"
    />
  </div>
</div>
```
- **Altura**: 56px
- **Label**: Sempre visível acima do campo
- **Placeholder**: Complemento, não substituto
- **Ícone**: 20px, posicionado à esquerda
- **Borda**: 2px cinza, foco azul
- **Radius**: 12px

#### Input com Erro
```tsx
<div>
  <label className="block mb-2 text-foreground">Email</label>
  <input
    className="w-full min-h-[56px] border-2 border-destructive rounded-xl ..."
  />
  <p className="text-destructive text-sm mt-1 flex items-center gap-1.5">
    <AlertCircle className="w-4 h-4" aria-hidden="true" />
    <span>Email obrigatório</span>
  </p>
</div>
```
- **Borda**: Vermelha 2px
- **Mensagem**: Ícone + texto (não só cor)
- **Tamanho**: 14px

#### Checkbox
```tsx
<div className="flex items-start gap-3">
  <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
    <input
      type="checkbox"
      id="terms"
      className="w-5 h-5 accent-accent cursor-pointer"
    />
  </div>
  <label htmlFor="terms" className="text-sm text-foreground cursor-pointer pt-2.5">
    Aceito os termos de uso
  </label>
</div>
```
- **Área de toque**: 44x44px (wrapper)
- **Checkbox visual**: 20px
- **Cor**: Azul quando marcado

---

### Cards

#### Card Padrão
```tsx
<div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
  {/* Conteúdo */}
</div>
```
- **Background**: Branco
- **Borda**: 1px cinza #E0E0E0
- **Radius**: 16px
- **Padding**: 24px
- **Sombra**: Suave (opcional)

#### Card Clicável
```tsx
<button className="w-full bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-accent/40 transition-all active:scale-[0.99]">
  {/* Conteúdo */}
</button>
```
- **Altura mínima**: 64px
- **Hover**: Sombra média + borda azul sutil
- **Active**: Scale 99% (feedback tátil)

#### Card de Risco (Resultado da IA)
```tsx
/* CRÍTICO */
<div className="bg-red-50 border-2 border-red-600 rounded-2xl p-6">
  <div className="flex items-start gap-3">
    <ShieldAlert className="w-7 h-7 text-destructive" />
    <div>
      <h3 className="text-xl font-semibold mb-1">Golpe Confirmado</h3>
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white">
        CRÍTICO
      </span>
    </div>
  </div>
</div>

/* SEGURO */
<div className="bg-green-50 border-2 border-green-600 rounded-2xl p-6">
  <div className="flex items-start gap-3">
    <Shield className="w-7 h-7 text-success" />
    <div>
      <h3 className="text-xl font-semibold mb-1">Seguro</h3>
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-white">
        CAMINHO FELIZ
      </span>
    </div>
  </div>
</div>
```
- **Background**: Cor clara (50)
- **Borda**: Cor saturada (600), 2px
- **Ícone**: 28px, cor semântica
- **Badge**: Cor saturada com texto branco
- **Sempre**: Ícone + label + cor

---

### Navegação Inferior

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
  <div className="max-w-lg mx-auto grid grid-cols-4 min-h-[64px]">
    <button
      aria-label="Início"
      aria-current={isActive ? "page" : undefined}
      className="flex flex-col items-center justify-center gap-1 min-h-[64px] min-w-[48px] text-accent font-medium"
    >
      <Home className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
      <span className="text-xs">Início</span>
    </button>
    {/* Outros itens... */}
  </div>
</nav>
```
- **Altura**: 64px
- **Largura mínima por item**: 48px
- **Ícone**: 24px
- **Label**: 12px abaixo do ícone
- **Estado ativo**: Cor azul + peso 2.5 no ícone + font-medium no texto
- **ARIA**: `aria-current="page"` no item ativo

---

## 📐 Espaçamentos

### Sistema de Grid

```css
Padding interno de cards:     16px - 24px
Margem entre cards:           16px
Margem lateral da tela:       24px
Espaçamento entre elementos:  12px - 16px
Gap entre ícone e texto:      8px - 12px
```

### Consistência Vertical

```css
Margem após título principal: 8px
Margem entre seções:          32px
Margem entre campos de form:  16px - 20px
Padding do container:         32px (topo/baixo)
```

---

## 🎭 Estados Interativos

### Estados de Botão

```css
/* Normal */
bg-accent text-accent-foreground

/* Hover */
bg-accent/90

/* Focus (teclado) */
outline: 2px solid var(--ring)
outline-offset: 2px

/* Disabled */
bg-muted text-muted-foreground opacity-60 cursor-not-allowed

/* Active (pressionado) */
scale-[0.98]
```

### Estados de Input

```css
/* Normal */
border-2 border-input

/* Focus */
border-2 border-accent

/* Erro */
border-2 border-destructive

/* Disabled */
bg-muted border-muted cursor-not-allowed
```

---

## ♿ Acessibilidade

### Checklist Obrigatório

- ✅ Contraste mínimo 4.5:1 em textos normais
- ✅ Área de toque mínima 44x44px
- ✅ Labels permanentes em inputs (não apenas placeholder)
- ✅ Feedback de erro com ícone + texto (não só cor)
- ✅ Estados de foco visíveis para navegação por teclado
- ✅ ARIA labels em ícones informativos
- ✅ `aria-hidden="true"` em ícones decorativos
- ✅ Hierarquia semântica de títulos (H1 → H2 → H3)

### ARIA Patterns

```tsx
/* Botão com ícone apenas */
<button aria-label="Fechar">
  <X className="w-4 h-4" />
</button>

/* Ícone decorativo (acompanhado de texto) */
<button>
  <LogOut className="w-5 h-5" aria-hidden="true" />
  Sair da Conta
</button>

/* Navegação com estado ativo */
<button aria-label="Início" aria-current="page">
  <Home className="w-6 h-6" aria-hidden="true" />
  <span>Início</span>
</button>
```

---

## 🖼️ Ícones

### Tamanhos Padronizados

```css
Micro:   16px  /* Inline com texto pequeno */
Small:   20px  /* Dentro de inputs */
Medium:  24px  /* Navegação, cards */
Large:   28px  /* Destaque em resultados */
XLarge:  32px  /* Avatar, logo */
```

### Bibliotecas

**Lucide React**: Ícones principais
```tsx
import { Home, AlertCircle, Shield, Mail } from "lucide-react"
```

**Emojis**: Tags de golpe (consistência visual)
```tsx
🏦 Phishing Bancário
📱 WhatsApp Clonado
💸 Pedido de dinheiro
```

---

## 📱 Responsividade

### Breakpoints

```css
Mobile:     < 640px  (padrão, mobile-first)
Tablet:     640px - 1024px
Desktop:    > 1024px
```

### Layout Mobile-First

```tsx
/* Container com largura máxima */
<div className="max-w-lg mx-auto px-6 py-8">
  {/* Conteúdo */}
</div>

/* Cards empilhados */
<div className="space-y-4">
  <div className="bg-card ...">Card 1</div>
  <div className="bg-card ...">Card 2</div>
</div>

/* Navegação fixa no rodapé */
<nav className="fixed bottom-0 left-0 right-0">
  {/* 4 colunas iguais */}
</nav>
```

### Frame de Referência

- **Primário**: 390x844px (iPhone 12/13)
- **Mínimo**: 360x800px (Android pequeno)
- **Orientação**: Retrato (vertical)

---

## 🧩 Componentes Reutilizáveis

### Badge de Risco

```tsx
const RISK_CONFIG = {
  critico: {
    label: 'CRÍTICO',
    color: 'bg-red-600 text-white',
    icon: ShieldAlert,
  },
  alto: {
    label: 'ALTO',
    color: 'bg-orange-500 text-white',
    icon: AlertTriangle,
  },
  medio: {
    label: 'MÉDIO',
    color: 'bg-yellow-500 text-white',
    icon: AlertCircle,
  },
  seguro: {
    label: 'SEGURO',
    color: 'bg-green-600 text-white',
    icon: CheckCircle,
  },
}

<span className={`text-xs px-2 py-0.5 rounded-full ${RISK_CONFIG.critico.color}`}>
  {RISK_CONFIG.critico.label}
</span>
```

### Tag de Destaque

```tsx
const TAG_CONFIG = {
  urgencia: { label: '🚨 Urgência', color: 'bg-red-100 text-red-700 border-red-200' },
  link: { label: '🔗 Link suspeito', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

<span className={`text-xs px-2 py-0.5 rounded-full border ${TAG_CONFIG.urgencia.color}`}>
  {TAG_CONFIG.urgencia.label}
</span>
```

---

## 🚀 Guia de Implementação

### Ao Criar um Novo Componente

1. **Defina a hierarquia semântica**
   - Use H1 apenas uma vez por tela
   - Siga a ordem H1 → H2 → H3

2. **Garanta acessibilidade**
   - Área de toque mínima 44x44px
   - Labels visíveis em inputs
   - Ícone + texto em feedbacks
   - Estado de foco visível

3. **Use variáveis CSS**
   ```tsx
   className="bg-accent text-accent-foreground"
   /* NÃO hardcode cores: bg-blue-600 */
   ```

4. **Mantenha consistência**
   - Border radius: 12px (botões) ou 16px (cards)
   - Padding: múltiplos de 4px
   - Espaçamento: 16px ou 24px

5. **Teste responsividade**
   - Mobile 360px de largura
   - Zoom 200% no navegador
   - Navegação por teclado (Tab)

---

## 📚 Referências

- `/src/styles/theme.css` - Variáveis CSS do sistema
- `/ACCESSIBILITY.md` - Checklist completo de acessibilidade
- [Lucide Icons](https://lucide.dev/) - Biblioteca de ícones
- [Tailwind CSS v4](https://tailwindcss.com/) - Framework CSS

---

**Última atualização**: 02/06/2026
