# Nguyen Phu Quang Portfolio

Single-page cyberpunk portfolio built with Astro, Bun, Tailwind v4, GSAP ScrollTrigger, and typed resume data.

```sh
bun install
bun run dev
bun run build
bun run check
```

## Structure

- `src/data/resume.ts` stores resume-driven content and types.
- `src/pages/index.astro` renders the full portfolio.
- `src/styles/global.css` defines the original solid-color design system.
- `src/scripts/scrollStory.ts` controls GSAP scroll motion and reduced-motion fallback.
