# Architecture

```
src/
  app/        App shell: router, global layout, global styles (index.css, Tailwind @theme)
  routes/     One thin file per URL. Composes a feature into a page. No logic.
  features/   Self-contained domains: home, gallery, kai-cards, pokedex, darts
    <feature>/
      index.js      Public API (the only thing routes import)
      components/   UI used only by this feature
      data/ hooks/ db/ styles/   As needed
  shared/     Feature-agnostic code
    components/     layout, feedback, common, icons
    lib/            pure helpers (textScramble, ...)
  test/       Vitest setup
e2e/          Playwright specs
```

## Dependency rules (enforced by ESLint `no-restricted-imports`)

| From        | May import                             |
| ----------- | -------------------------------------- |
| `routes/`   | `features/*` (via index.js), `shared/` |
| `features/` | its own folder (relative), `shared/`   |
| `shared/`   | `shared/` only                         |
| `app/`      | everything                             |

Features never import each other. If two features need the same thing, move it to `shared/`.

## Conventions

- Use the `@/` alias (maps to `src/`) for imports that cross top-level folders; use relative imports inside a feature.
- Tailwind utilities by default; CSS modules (colocated) for complex animation.
- Data and config live in `data/` files, not inline in components.
- Add a feature: create `features/<name>/` with an `index.js`, add `routes/<Name>.jsx`, register the route in `app/App.jsx`.
