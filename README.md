# Luis Fernando — Landing page de fisioterapia em domicílio

Landing page / portfólio em **Next.js 16 (App Router) + TypeScript**, convertida do protótipo
estático em `referencia/index.html` seguindo a especificação de `referencia/prompt.md`.

- **3D:** Three.js (coluna do hero, corpo interativo e globo), carregado sob demanda
- **Smooth scroll:** Lenis
- **Ícones:** Tabler Icons (`@tabler/icons-react`, só os ícones usados entram no bundle)
- **Fontes:** Barlow Condensed (títulos, condensada e em caixa alta) + Inter (texto) via `next/font`,
  auto-hospedadas. A cópia em `src/app/fonts/` (licença OFL) é usada só para gerar a imagem Open Graph.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | O que faz                                    |
| ------------------- | -------------------------------------------- |
| `npm run lint`      | ESLint (config `eslint-config-next`)         |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run build`     | Build de produção (página 100% estática)     |
| `npm run check`     | Os três acima, em sequência                  |
| `npm start`         | Serve o build de produção                    |

Skills do agente: as versões estão em `skills-lock.json`. Depois de clonar, rode
`npx skills experimental_install` para recriar os links em `.claude/skills/`.

## Estrutura

```
src/
  app/            layout (metadata, fontes), page (seções + JSON-LD), OG image, ícone, robots, sitemap
  components/     Navbar, Footer, GlobalEffects, SceneMount, ContactForm…
    sections/     Hero, Marquee, Stats, Specialties, PainMap, Method, BeforeAfter, Testimonials, About, Contact
  scenes/         stage.ts (renderer, luzes, visibilidade, resize), spine.ts, body.ts, globe.ts
  effects/        cursor, ripple, magnetic, tilt, reveal, counter, timeline, particles, smoothScroll,
                  marquee, heroParallax, scrollProgress
  lib/            loop.ts (requestAnimationFrame único), env.ts (reduced motion / mobile / ponteiro)
  data/           content.ts — todos os textos editáveis
  config/         site.ts — nome, telefone, WhatsApp, endereço, URL
  styles/         tokens.css, base.css, effects.css, sections.css
```

Decisões principais:

- **Um único loop de animação** (`lib/loop.ts`): Lenis, cursor, partículas, faixa, carrossel e as
  três cenas 3D se inscrevem nele. Cada cena só renderiza quando está visível
  (IntersectionObserver) e se ajusta ao tamanho do contêiner (ResizeObserver).
- **Efeitos de rolagem** só com `transform`/`translate`/`opacity` (nada que refaça o layout):
  blocos `.reveal` sobem ao entrar na tela, em cascata quando entram juntos; títulos
  `.reveal-mask` sobem de trás de uma máscara; a faixa acelera no sentido da rolagem; o texto
  do hero fica para trás e esmaece (só desktop); e uma linha na navbar mostra o progresso.
- **HTML no servidor, efeitos no cliente:** as seções são Server Components; os efeitos
  globais atuam sobre classes/atributos (`.reveal`, `.mag`, `.card`, `data-split`, `data-count`…).
- **Mobile/touch:** menos partículas e vértebras, `pixelRatio` 1, sem antialias e cursor nativo.
- **`prefers-reduced-motion`: reduz, sem congelar.** No Windows essa preferência vem de
  *Efeitos de animação*, que o modo de melhor desempenho também desliga, então muita gente a
  recebe sem pedir. Por isso a página continua viva (coluna 3D girando, entradas, faixa,
  aurora) e só saem os movimentos grandes ligados à rolagem: Lenis, parallax do hero,
  explosão da coluna e faixa acelerando, além de cursor, ripple e magnetismo. As entradas
  sobem um trajeto menor.
- **Sem JavaScript**, o conteúdo continua visível (fallback em `<noscript>`).

## Antes de publicar

1. Ajuste os dados reais em `src/config/site.ts` (telefone, WhatsApp, CREFITO, endereço).
2. Defina a variável de ambiente **`NEXT_PUBLIC_SITE_URL`** com o domínio final
   (ex.: `https://seudominio.com.br`). Ela gera as URLs absolutas de Open Graph,
   canonical, sitemap e JSON-LD.
3. O formulário só valida e confirma na tela. Para receber os pedidos, integre o
   `onSubmit` de `src/components/ContactForm.tsx` com Formspree, EmailJS ou uma rota de API.

## Publicando

### Vercel (recomendado — criadores do Next.js)

1. Suba o projeto para um repositório no GitHub/GitLab/Bitbucket.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework é
   detectado automaticamente (build `next build`).
3. Em *Settings → Environment Variables*, adicione `NEXT_PUBLIC_SITE_URL`.
4. Deploy. Para domínio próprio: *Settings → Domains*.

Pela CLI: `npm i -g vercel && vercel` (e `vercel --prod` para produção).

### Netlify

1. Em [app.netlify.com](https://app.netlify.com), *Add new site → Import an existing project*
   e escolha o repositório.
2. O Netlify detecta o Next.js e aplica o adaptador oficial automaticamente
   (build `npm run build`, sem configuração extra).
3. Em *Site configuration → Environment variables*, adicione `NEXT_PUBLIC_SITE_URL` e
   refaça o deploy.

Pela CLI: `npm i -g netlify-cli && netlify deploy --build` (e `--prod` para produção).
