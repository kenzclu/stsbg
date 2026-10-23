# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally
- `npm run format` — format the codebase with Prettier, via the local `.prettierrc.json` (currently empty, so it runs with Prettier's defaults)

There is no test runner configured in this project yet.

## Architecture

This is a React 19 + TypeScript + Vite app. Entry point is `src/main.tsx` → `src/App.tsx`.

- `App.tsx` holds top-level app state (selected character names, plus a `resetNonce` used to force-remount combat rows on Reset) and owns the `AVAILABLE_CHARACTERS` / `MAX_CHARACTERS` constants. It renders one `CombatRow` per selected character. Child components are presentational and receive state/callbacks via props — there's no state management library.
- `src/components/CharacterSelect.tsx` — a `<select>` for adding a character, filtered to characters not already picked and disabled once `maxCharacters` is reached.
- `src/components/CombatRow.tsx` — pairs one `HeroCard` with one `EnemyRow` for a selected character and owns that row's enemy list (name, current/max HP) in local state.
- `src/components/HeroCard.tsx` — the hero side of a combat row; deals preset (1) or custom damage to every enemy in its row via an `onDamageEnemies` callback.
- `src/components/EnemyRow.tsx` / `src/components/EnemyCard.tsx` — `EnemyRow` renders the row's enemies plus an "add enemy" form (sets starting/max HP); each `EnemyCard` exposes per-enemy HP +/- buttons and a custom-damage form.
- Most components colocate their own CSS file (`HeroCard.css`, `EnemyCard.css`, `EnemyRow.css`); `CharacterSelect` and `CombatRow` have no CSS file of their own and rely on `App.css`/`index.css`. Global styles live in `src/index.css` and `src/App.css`.

## Code organization

- Favor modular changes over growing existing files: when adding new behavior, prefer a new component/module under `src/components/` (colocated with its own CSS, following the `HeroCard`/`CharacterSelect` pattern) rather than expanding `App.tsx`. Only keep logic in `App.tsx` when it's truly top-level app state that multiple components need.

## Build/tooling notes

- Vite uses Rolldown (`vite@^8`) with the React Compiler enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.ts` — this affects dev/build performance, and lint/type rules should account for compiler-friendly patterns (e.g. no manual memoization needed).
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax` are all on. Keep new code compliant with these rather than loosening the config.
- Linting is via `oxlint` (not ESLint); config is in `.oxlintrc.json`. Type-aware lint rules are not currently enabled (would require `oxlint-tsgolint`).
