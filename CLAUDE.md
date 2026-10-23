# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally
- `npm run format` — format the codebase with Prettier, via the local `.prettierrc.json` (currently empty, so it runs with Prettier's defaults)
- `npm run test` — run the test suite with Vitest (watch mode by default; use `npm run test -- --run` for a single pass)

## Testing

- Test runner is Vitest (configured via the `test` block in `vite.config.ts`, using `jsdom`), plus React Testing Library and `@testing-library/user-event` for component tests. Setup file: `src/test/setup.ts`.
- Default to test-driven development where practical: write or update a test alongside (or before) the implementation change, not as an afterthought.
- Tests live in a `tests/` subfolder next to the code they cover (e.g. `src/components/HeroCard/tests/HeroCard.test.tsx` next to `src/components/HeroCard/HeroCard.tsx`; `src/tests/App.test.tsx` next to `src/App.tsx`).

## Architecture

This is a React 19 + TypeScript + Vite app. Entry point is `src/main.tsx` → `src/App.tsx`.

- `App.tsx` holds top-level app state (selected character names, plus a `resetNonce` used to force-remount combat rows on Reset) and owns the `AVAILABLE_CHARACTERS` / `MAX_CHARACTERS` constants. It renders one `CombatRow` per selected character. Child components are presentational and receive state/callbacks via props — there's no state management library.
- Each component lives in its own folder under `src/components/` (e.g. `src/components/HeroCard/HeroCard.tsx`), with its `.test.tsx` in a `tests/` subfolder and (where it has one) its `.css` file alongside the component. There are no barrel/`index.ts` files — import the component directly from its file, e.g. `./components/HeroCard/HeroCard`.
- `src/components/CharacterSelect/CharacterSelect.tsx` — a `<select>` for adding a character, filtered to characters not already picked and disabled once `maxCharacters` is reached.
- `src/components/CombatRow/CombatRow.tsx` — pairs one `HeroCard` with one `EnemyRow` for a selected character and owns that row's enemy list (name, current/max HP) in local state.
- `src/components/HeroCard/HeroCard.tsx` — the hero side of a combat row; deals preset (1) or custom damage to every enemy in its row via an `onDamageEnemies` callback.
- `src/components/EnemyRow/EnemyRow.tsx` / `src/components/EnemyCard/EnemyCard.tsx` — `EnemyRow` renders the row's enemies plus an "add enemy" form (sets starting/max HP); each `EnemyCard` exposes per-enemy HP +/- buttons and a custom-damage form.
- `HeroCard`, `EnemyCard`, and `EnemyRow` colocate their own CSS file; `CharacterSelect` and `CombatRow` have no CSS file of their own and rely on `App.css`/`index.css`. Global styles live in `src/index.css` and `src/App.css`.

## Code organization

- Favor modular changes over growing existing files: when adding new behavior, prefer a new component folder under `src/components/` (with its own CSS alongside the component and its test in a `tests/` subfolder, following the `HeroCard`/`CharacterSelect` pattern) rather than expanding `App.tsx`. Only keep logic in `App.tsx` when it's truly top-level app state that multiple components need.

## Engineering principles

- **Chesterton's fence**: before removing or changing code that looks odd, pointless, or redundant, understand why it's there first. Check git history/blame and surrounding usage; if there's no clear reason after investigating, it's fine to remove it — but don't rip it out just because the purpose isn't obvious at a glance.
- **Kent Beck's rule**: "for each desired change, make the change easy (warning: this may be hard), then make the easy change." When a change is awkward to make in the current structure, prefer a first step that reshapes the code to make the change natural, then make the change as a second, separate step — rather than contorting the new behavior into the existing shape.

## Build/tooling notes

- Vite uses Rolldown (`vite@^8`) with the React Compiler enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.ts` — this affects dev/build performance, and lint/type rules should account for compiler-friendly patterns (e.g. no manual memoization needed).
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax` are all on. Keep new code compliant with these rather than loosening the config.
- Linting is via `oxlint` (not ESLint); config is in `.oxlintrc.json`. Type-aware lint rules are not currently enabled (would require `oxlint-tsgolint`).
