# Code components starter repo

A simple starter for your next Webflow code components project.

A single TanStack Router app: every component gets its own preview page, rendered inside the shadow DOM.

Kept intentionally bare bones, easy to extend.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3001.

## How the preview works

The preview is a TanStack Router app that auto-discovers your components — you never wire up a route by hand.

Both the index and the preview page glob the components folder at build time:

```ts
const modules = import.meta.glob([
  "../components/*.tsx",
  "!../components/*.webflow.tsx",
]);
```

From that glob:

- **`src/routes/index.tsx`** (`/`) — lists every discovered component as a link. The link text is the component's filename (its "slug").
- **`src/routes/$slug.tsx`** (`/badge`, `/button`, …) — renders a single component on its own page. The `$slug` is the filename, so `src/components/badge.tsx` previews at `/badge`.

Each component is rendered inside a **shadow DOM** (`src/base-ui/shadow-dom.tsx`). This mirrors how Webflow isolates code components on a live site: global styles don't leak in, and your component's styles don't leak out. The compiled Tailwind/global CSS is injected into the shadow root via a constructable stylesheet, so class-based components still render styled inside the boundary.

A component must have a **default export** to be previewed:

```tsx
// src/components/badge.tsx
export default function Badge({ text = "Example" }) {
  return <span>{text}</span>;
}
```

## Structuring your component files

**Everything in `src/components` gets a preview page.**. Drop a `.tsx` file in there and it shows up on the index and gets its own `/$slug` route — no registration needed.

```
src/
  components/          ← one preview page per file
    badge.tsx              → previews at /badge
    badge.webflow.tsx      → NOT previewed (Webflow declaration, see below)
    button.tsx             → previews at /button
  base-ui/             ← shared building blocks, NO preview page
    shadow-dom.tsx
  routes/              ← the preview app itself (index + $slug)
```

### When you _don't_ want a preview page

If a component is a shared building block — something other components use, but that doesn't make sense to preview on its own — put it in **`src/base-ui`** instead of `src/components`. Anything outside `src/components` is invisible to the glob, so it never gets a page.

Rule of thumb:

- **`src/components`** → a thing you want to see and ship as a Webflow component.
- **`src/base-ui`** → a shared dependency, primitive, or helper used by your components.

### Webflow component declarations (`*.webflow.tsx`)

For each component you ship to Webflow, pair it with a `*.webflow.tsx` file that declares its name, props, and metadata:

```tsx
// src/components/badge.webflow.tsx
import Badge from "./badge";
import { declareComponent } from "@webflow/react";

export default declareComponent(Badge, {
  name: "Badge",
  description: "A badge with variants",
  group: "Info",
});
```

These `*.webflow.tsx` files live alongside your components but are **excluded from the preview** (the glob filters out `!../components/*.webflow.tsx`). They're only consumed by the Webflow library build.

## Webflow Library

To deploy your Webflow library, adjust the settings in `webflow.json`:

```json
{
  "library": {
    "name": "<Your Library Name>",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
  }
}
```

Then run `npm run share` and follow the instructions. The command runs a typecheck before the library builds, so you catch errors quicker.

## Scripts

- `npm run dev` — start the dev server
- `npm run share` — typecheck, then import the library into Webflow
- `npm run format` — format the project with Prettier
