# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally
- `npx prettier --write .` — format the codebase (Prettier is the formatter used in this repo; no local `.prettierrc`/script is set up yet, so it runs with Prettier's defaults)

There is no test runner configured in this project yet.

## Architecture

This is a React 19 + TypeScript + Vite app (early stage, minimal setup). Entry point is `src/main.tsx` → `src/App.tsx`.

- `App.tsx` holds all app state (currently just the list of selected character names) and owns the `AVAILABLE_CHARACTERS` / `MAX_CHARACTERS` constants. Child components are presentational and receive state/callbacks via props — there's no state management library.
- `src/components/CharacterSelect.tsx` — a `<select>` for adding a character, filtered to characters not already picked and disabled once `maxCharacters` is reached.
- `src/components/HeroCard.tsx` — renders a single selected character; one `HeroCard` is rendered per selected character in `App.tsx`.
- Each component colocates its own CSS file (e.g. `HeroCard.css` next to `HeroCard.tsx`); global styles live in `src/index.css` and `src/App.css`.

## Code organization

- Favor modular changes over growing existing files: when adding new behavior, prefer a new component/module under `src/components/` (colocated with its own CSS, following the `HeroCard`/`CharacterSelect` pattern) rather than expanding `App.tsx`. Only keep logic in `App.tsx` when it's truly top-level app state that multiple components need.

## Build/tooling notes

- Vite uses Rolldown (`vite@^8`) with the React Compiler enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.ts` — this affects dev/build performance, and lint/type rules should account for compiler-friendly patterns (e.g. no manual memoization needed).
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax` are all on. Keep new code compliant with these rather than loosening the config.
- Linting is via `oxlint` (not ESLint); config is in `.oxlintrc.json`. Type-aware lint rules are not currently enabled (would require `oxlint-tsgolint`).
