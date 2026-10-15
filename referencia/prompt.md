Crie uma landing page / portfólio de alto impacto visual para o fisioterapeuta
"Dr. Rafael Moura", especialista em fisioterapia esportiva e reabilitação de coluna.
Objetivo: impressionar à primeira vista e converter visitantes em agendamentos.

Se existir um arquivo prototipo-2.html na pasta, use-o como referência visual e
funcional, preservando todos os efeitos, e refatore para a estrutura abaixo.

## Stack e estrutura
- Vite + JavaScript puro (sem framework), Three.js via npm, Lenis para smooth scroll.
- Estrutura:
  /index.html
  /src/main.js            (inicialização)
  /src/scenes/spine.js    (coluna 3D do hero)
  /src/scenes/body.js     (corpo humano 3D interativo)
  /src/scenes/globe.js    (globo 3D do contato)
  /src/effects/*.js       (cursor, magnético, tilt, reveal, scramble, partículas)
  /src/styles/*.css       (tokens, base, seções)
- Um único loop de requestAnimationFrame; cada cena 3D só renderiza quando visível
  (IntersectionObserver) e se redimensiona no resize.

## Identidade visual
- Fundo #0B1220, verde-água #2DD4BF, azul #38BDF8, violeta de apoio #A78BFA.
- Títulos em "Space Grotesk", corpo em "Inter", tags em monospace.
- Glassmorphism (fundo translúcido, borda fina, backdrop-filter blur).
- Ícones: Tabler Icons webfont.

## Seções (nesta ordem)
1. Navbar fixa: transparente no topo, vira glass ao rolar. Links com scroll suave.
2. Hero (100vh): título "Movimento sem dor" com reveal palavra por palavra + "começa aqui"
   com gradiente animado fluindo. Subtítulo, CTAs "Agendar avaliação" (com brilho
   deslizante) e "Onde dói?". Fundo com 3 manchas de aurora animadas e partículas em
   constelação (canvas 2D) que fogem do mouse.
   À direita, cena Three.js:
   - coluna vertebral estilizada (vértebras = cilindros + wireframe + processos
     espinhosos e transversos + discos claros), curvatura em S;
   - 3 anéis orbitais (TorusGeometry) com esferas percorrendo cada um;
   - hélice dupla de partículas com AdditiveBlending;
   - icosaedros em wireframe flutuando;
   - parallax de mouse na coluna e na câmera;
   - efeito "explosão": conforme o hero sai da tela (intersectionRatio), as vértebras
     se afastam e giram; ao voltar, se reencaixam.
3. Faixa marquee inclinada (skewY -3deg) com as especialidades em loop infinito.
4. Números: 3 cards com anéis SVG de progresso + contadores animados
   (12+ anos, 3.200 pacientes, 98% satisfação).
5. Especialidades: 4 cards glass (Coluna, Esportiva, Pós-operatório, Pilates clínico)
   com tilt 3D, brilho radial que segue o cursor e ícone com translateZ que "salta".
6. "Onde dói?" — corpo humano 3D translúcido (low-poly com cilindros/esferas +
   arestas), coluna visível por dentro. Hotspots pulsantes: cervical, ombro, lombar,
   joelho, tornozelo. Arrastar gira o corpo; clicar (raycaster) ou usar os chips
   seleciona a região, gira o corpo até ela e anima o painel lateral com título,
   descrição do tratamento e CTA.
7. Método: linha do tempo vertical que se desenha (com glow) conforme cada etapa
   entra na tela: Avaliação → Diagnóstico funcional → Tratamento → Alta e prevenção.
8. Antes e depois: slider arrastável comparando postura (SVG "antes" com cabeça
   projetada e cifose x "depois" alinhado).
9. Depoimentos: carrossel CSS 3D em cilindro (6 cards), gira sozinho, pausa no hover,
   botões anterior/próximo.
10. Sobre: avatar com moldura conic-gradient girando, bio, badges de certificações.
11. Contato: formulário com validação inline (nome, WhatsApp com DDD, tratamento) e
    globo 3D wireframe com pontos, pin pulsante em São Paulo e arcos animados
    (QuadraticBezierCurve3 + setDrawRange) para outras capitais.
12. Botão WhatsApp flutuante fixo com pulsação. Rodapé com CREFITO.

## Efeitos globais
- Cursor customizado (anel que cresce em elementos clicáveis) + rastro de 7 pontos.
- Ripple ao clicar em qualquer ponto da página.
- Botões magnéticos.
- Texto "scramble" nas tags de seção ao entrarem na tela.

## Requisitos
- Responsivo; no mobile e em telas touch: menos partículas/vértebras, pixelRatio 1,
  sem antialias, cursor nativo.
- Respeitar prefers-reduced-motion (desliga animações contínuas, mostra conteúdo).
- SEO: title, meta description, Open Graph, JSON-LD do tipo Physiotherapist.
- Acessibilidade: aria-labels em botões de ícone, contraste adequado, foco visível.
- Textos em português do Brasil, código comentado.
- Ao final, rode o build, verifique erros no console e me diga como publicar
  (Vercel ou Netlify).
