# ab1manyu.github.io

Personal portfolio built with React 19, Vite, Tailwind CSS v4 and React Router. It has a home page, a photo gallery, a Kai card deck, a Pokédex battle game and a darts scorer.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                  | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start the Vite dev server          |
| `npm run build`         | Production build to `dist/`        |
| `npm run preview`       | Preview the production build       |
| `npm run lint`          | ESLint                             |
| `npm run format`        | Prettier write                     |
| `npm run format:check`  | Prettier check                     |
| `npm run fetch:pokemon` | Regenerate Pokédex generation JSON |

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) once the re-architecture lands. Until then, code lives under `src/components` (shared UI) and `src/pages` (routes and their feature code).

## Deployment

Deployed on Vercel. `vercel.json` rewrites all routes to `index.html` for SPA routing.
