# Claude Memory

## Goal
Maintain Nguyen Phu Quang portfolio. Recruiter-first backend/distributed-systems story + premium cyberpunk frontend interaction.

## Current State
- Astro/Bun project replaced deleted SvelteKit app.
- User wants `main`.
- Single pinned full-screen story: 12 scenes.
- Route-backed SEO active, same pinned story UX.
- Static routes: `/`, `/ai-flow/`, `/experience/`, `/tymex-metrics/`, `/renesas/`, `/renesas-metrics/`, `/success/`, `/rag-llm/`, `/rux/`, `/skills/`, `/skills-delivery/`, `/contact/`.
- Each route has unique SEO head, canonical, OG/Twitter meta, JSON-LD, generated OG PNG.
- Direct route load jumps matching scene after GSAP init.
- Nav/timeline clicks animate in-place + `history.pushState`.
- Back/forward jumps matching scene.
- Top nav says `Skills`, not `Skills 01`; right timeline may show detailed labels.

## Non-Negotiables
- Own color scheme, not WorldQuant colors.
- WorldQuant = interaction pacing/reference only.
- No gradients.
- No stock photos.
- No emoji UI icons. Use Lucide, simple-icons, uploaded logos, code/SVG graphics.
- Solid colors + hard-edge HUD/cyberpunk graphics.
- Background/frame stays still; animate child components only.
- Motion required; respect `prefers-reduced-motion`.

## Key Files
- `src/data/resume.ts`: content.
- `src/data/seo.ts`: scene routes/meta/nav/timeline/`SITE_URL`.
- `src/components/PortfolioStory.astro`: shared story UI.
- `src/components/SeoHead.astro`: SEO/meta/OG/Twitter/JSON-LD.
- `src/components/BrandIcon.astro`: icons/logos.
- `src/pages/index.astro`: `/`.
- `src/pages/[scene].astro`: scene routes.
- `src/pages/robots.txt.ts`: robots.
- `src/pages/sitemap.xml.ts`: sitemap.
- `src/styles/global.css`: visual system + responsive layouts.
- `src/scripts/scrollStory.ts`: GSAP + route-aware nav.
- `scripts/generate-og.mjs`: PNG OG generation.
- `scripts/verify-scenes.mjs`: scene/SEO guard.
- `public/llms.txt`, `public/llm.txt`: LLM summary.

## Commands
- `bun install`
- `bun run dev`
- `bun run verify:scenes`
- `bun run check`
- `bun run build`
- Build runs `node scripts/generate-og.mjs` before `astro build`.

## Docs
- Context7 for library/framework/API/CLI/cloud:
`npx ctx7@latest library <name> "<question>"`
then:
`npx ctx7@latest docs <libraryId> "<question>"`

## Scene Routes
- `/` -> `#intro`
- `/ai-flow/` -> `#ai-flow`
- `/experience/` -> `#experience`
- `/tymex-metrics/` -> `#metrics`
- `/renesas/` -> `#experience-renesas`
- `/renesas-metrics/` -> `#metrics-renesas`
- `/success/` -> `#experience-success`
- `/rag-llm/` -> `#projects`
- `/rux/` -> `#project-rux`
- `/skills/` -> `#skills`
- `/skills-delivery/` -> `#skills-delivery`
- `/contact/` -> `#contact`

## Verified Baseline
- `bun run verify:scenes`: pass.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: pass; 12 pages; 12 PNG OG images.
- Browser QA: `/`, `/renesas/`, `/renesas-metrics/`, `/skills/`, `/contact/`, in-app `/renesas/` -> `/contact/`; correct active scene, no console errors, no horizontal overflow.

## Preview Note
- Codex Windows detached Astro dev may die.
- Workaround: serve built `dist` via local static server for QA, or run `bun run dev` foreground manually.
