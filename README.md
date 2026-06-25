# Code components starter repo

A simple starter for your next Webflow code components project.

A single TanStack Router app: each exported component gets its own page, rendered inside the shadow DOM.

Kept intentionally bare bones, easy to extend.

- `src/components` — the core Webflow components.
- `src/routes` — the preview app pages (the index lists every component; `/$slug` previews one).
- `src/base-ui` — components you don't want a preview for. e.g. base components that are shared across components

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3001.

### Webflow Library

To deploy your webflow library, adjust the settings in `webflow.json`

```json
{
  "library": {
    "name": "<Your Library Name>", <-- Change this
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
  }
}
```

Then run `npm run share` and follow the instructions. The command will run a typecheck before the library runs, so you can catch the errors quicker.

## Scripts

- `npm run dev` — start the dev server
- `npm run format` — lint the project
