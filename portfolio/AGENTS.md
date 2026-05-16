# Agent Memory

## Project
- Nguyen Phu Quang portfolio. Backend/distributed-systems recruiter impact + premium cyberpunk frontend.
- Stack: Astro 6, Bun, Tailwind v4 `@tailwindcss/vite`, GSAP ScrollTrigger, Lucide Astro, simple-icons, Fontsource.
- SvelteKit removed by user. Never restore Svelte app.
- Work on `main` unless user says otherwise.

## Commands
- Install: `bun install`
- Dev: `bun run dev`
- Check: `bun run check`
- Build: `bun run build`
- Verify scene/SEO: `bun run verify:scenes`
- Preview: `bun run preview` or serve `dist`.
- `bun run build` runs `prebuild`: `node scripts/generate-og.mjs` -> `public/og/*.png`.

## Docs Rule
- Library/framework/API/CLI/cloud docs: Context7 first.
- Resolve: `npx ctx7@latest library <name> "<user question>"`
- Fetch: `npx ctx7@latest docs <libraryId> "<user question>"`
- Run Context7 outside Codex sandbox when network needed. Quota error: tell user, no silent fallback.

## Current Design
- Colors only: `#050608`, `#111318`, `#1B1F27`, `#F4F7FB`, `#9AA4B2`, `#00E5B0`, `#4D7CFF`, `#FF355E`, `#F5C542`.
- No gradients. No WorldQuant colors. WorldQuant = interaction reference only.
- Cyberpunk/HUD: solid fills, clipped corners, SVG/data-URI grid, hard borders, scanlines, square logo plates.

## Architecture
- `src/data/resume.ts`: profile/metrics/experience/projects/skills/contact. Edit content here first.
- `src/data/seo.ts`: 12 scene SEO entries, routes, nav labels, timeline labels, URL helpers. `SITE_URL` default `http://localhost:4321`.
- `src/components/PortfolioStory.astro`: shared pinned story UI for `/` + all scene routes.
- `src/components/SeoHead.astro`: title/description/canonical/OG/Twitter/JSON-LD.
- `src/components/BrandIcon.astro`: simple-icons + uploaded logos.
- `src/pages/index.astro`: `/` intro shell.
- `src/pages/[scene].astro`: static scene routes from `routedSceneSeoItems`.
- `src/pages/robots.txt.ts`: robots + sitemap URL.
- `src/pages/sitemap.xml.ts`: sitemap all scene routes.
- `src/styles/global.css`: tokens, full-screen scenes, mobile, reduced-motion.
- `src/scripts/scrollStory.ts`: one GSAP master pin, component reveals, active nav/timeline, route jumps, history push/back/forward, reduced-motion.
- `scripts/generate-og.mjs`: dependency-free PNG OG generator.
- `scripts/verify-scenes.mjs`: scene/SEO guard, route links, OG files, no gradients/WorldQuant visuals.
- `public/llms.txt`: LLM summary + route list.
- `public/llm.txt`: pointer to `/llms.txt`.

## Scene Order
- 12 scenes:
  1. `/` -> `#intro`
  2. `/ai-flow/` -> `#ai-flow`
  3. `/experience/` -> `#experience`
  4. `/tymex-metrics/` -> `#metrics`
  5. `/renesas/` -> `#experience-renesas`
  6. `/renesas-metrics/` -> `#metrics-renesas`
  7. `/success/` -> `#experience-success`
  8. `/rag-llm/` -> `#projects`
  9. `/rux/` -> `#project-rux`
  10. `/skills/` -> `#skills`
  11. `/skills-delivery/` -> `#skills-delivery`
  12. `/contact/` -> `#contact`

## UX Rules
- Routes canonical for SEO/social. Hashes internal scene IDs only.
- Direct route load renders same pinned story, jumps to matching scene after GSAP init.
- Nav/right timeline use route URLs + `data-scene-target`; in-app clicks animate scene + `history.pushState`.
- Back/forward jumps scene.
- Top nav labels: Intro, AI Flow, Experience, Projects, Skills, Contact. Timeline can show Skills 01/Skills 02.
- Vertical scroll only. Background/frame still. Animate child components only: text/chips/cards/icons/borders/counters.
- `prefers-reduced-motion`: no forced pin/scrub; readable vertical layout.
- Mobile: no overlap/horizontal scroll. Internal scene overflow only safety.

## SEO/OG
- `SITE_URL` env controls canonical base; local default `http://localhost:4321`.
- Each scene has unique route/title/description/keywords/`og:image`/canonical/Twitter/JSON-LD.
- OG images: `public/og/*.png` -> `dist/og/*.png`.
- Outputs: `robots.txt`, `sitemap.xml`, `llms.txt`, `llm.txt`.

## Verification
- Before final claim:
  - `bun run verify:scenes`
  - `bun run check`
  - `bun run build`
- Browser QA routes: `/`, `/renesas/`, `/renesas-metrics/`, `/skills/`, `/contact/`.
- Confirm active scene, timeline highlight, route URL, no console errors, no horizontal overflow.

## Last Verified State
- `bun run verify:scenes`: pass.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: pass; 12 pages built; 12 PNG OG images.
- Browser QA pass: `/`, `/renesas/`, `/renesas-metrics/`, `/skills/`, `/contact/`, in-place `/renesas/` -> `/contact/`.
