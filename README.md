# Slay the Spire boardgame encounter life tracker

A browser app for tracking hero and enemy HP during encounters in the Slay the Spire board game. Pick your characters, add enemies, and deal damage with a tap.

<img width="1462" height="834" alt="image" src="https://github.com/user-attachments/assets/73615f5a-0a8c-44ea-a5de-046d04dab0a0" />


## Features

- Select up to a fixed number of characters for the encounter
- Each character gets its own combat row pairing a hero card with its enemy row
- Deal preset or custom damage from a hero to all enemies in its row
- Add enemies with starting/max HP, adjust HP with +/- buttons or custom damage
- Reset the encounter to start fresh

## Getting started

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally
- `npm run format` — format the codebase with Prettier
- `npm run test` — run the test suite with Vitest (watch mode by default; use `npm run test -- --run` for a single pass)

## Tech stack

React 19 + TypeScript + Vite (Rolldown, with the React Compiler enabled). No state management library; component state lives in `App.tsx` and is passed down via props. See `CLAUDE.md` for architecture details.
