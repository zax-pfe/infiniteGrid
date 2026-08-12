# Infinite Grid — Agent Guide

## Project purpose

This is an online portfolio for a ceramic artist. It is intended to showcase the artist's work through an image-led experience and is being developed with the ambition of eventually being submitted to Awwwards.

The project is still evolving. This guide documents the patterns already used in the codebase; it is not a fixed product or design specification. Follow the existing approach when extending a feature, and discuss or document deliberate architectural changes when introducing a new pattern.

French is appropriate for artist-facing and editorial content. Keep code, technical documentation, and developer-facing communication in English unless the task explicitly requests otherwise.

## Stack and commands

- Next.js 16 with the Pages Router and JavaScript
- SCSS Modules for component styling
- GSAP, Framer Motion, and Lenis for motion and smooth scrolling
- Zustand for shared client state

Use npm and run the relevant checks after changes:

```bash
npm run lint
npm run build
```

Run the production build when practical. If it cannot run because of an environment issue, report the exact blocker.

## Repository conventions

- Routes live in `src/pages`.
- Reusable, domain-oriented UI lives in `src/Components`; keep each component's SCSS Module alongside it.
- Static content records live in `src/data`.
- Images, fonts, and other static assets live in `public`.
- Use the `@/` alias for imports from `src`.
- Use `next/image` for artwork and other raster visual assets. Provide meaningful alt text; decorative imagery should be explicitly treated as decorative.

Do not introduce a second styling system. Extend the existing SCSS Module architecture instead of adding utility-first CSS, CSS-in-JS, or global component styles.

## Existing interaction patterns

- The home page uses an infinite draggable grid. Its positions and per-frame DOM updates are handled with refs and GSAP in `InfiniteGrid`.
- Lenis is configured globally in `src/pages/_app.js`. Infinite scrolling is enabled on most routes and disabled for the `/exhibition` and `/about` routes.
- Framer Motion is used for page and component transitions, including the artwork overlay.
- Zustand holds small pieces of shared UI state, such as the selected artwork and image index. Keep state local unless it must be shared between components.
- Artwork data and exhibition data are static JavaScript objects. The UI selects entries by their IDs and renders their image arrays.

When changing one of these flows, first trace the related component, data source, and shared state. Do not assume these patterns must remain permanent: replace or extend them when the feature calls for it, keeping the change coherent and focused.

## Change checklist

Before handing off a change:

1. Run `npm run lint` and resolve new errors or warnings caused by the change.
2. Run `npm run build` when the environment allows it.
3. Manually verify the user flow affected by the change.
4. For interaction or motion changes, check the relevant click, drag, scroll, transition, or close behavior.
5. Keep edits focused; do not overwrite unrelated user changes in a dirty worktree.
