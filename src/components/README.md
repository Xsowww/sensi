# React components

> **These files do not run in this repo yet.** `sensi` is a vanilla JS static
> site with no `package.json`, no bundler, no TypeScript and no Tailwind, so
> nothing here is compiled or served. The stack below has to be installed first.

## Where things go

shadcn resolves components through the `@` alias declared in `components.json`.
On a Vite project the default is:

| Alias | Real path |
| --- | --- |
| `@/components` | `src/components` |
| `@/components/ui` | `src/components/ui` |
| `@/lib/utils` | `src/lib/utils.ts` |

`src/components/ui` is the folder the CLI writes into and the folder every
generated import points at, so `@/components/ui/button` resolves only if the
file sits exactly there. Put a component somewhere else and the CLI will still
write its own copy to `ui/` on the next `shadcn add`, leaving two versions.

Note this repo already has a `src/lib/` holding the vanilla JS modules
(`sensitivity.js`, `games.js`). shadcn wants `src/lib/utils.ts` in the same
folder. They can coexist, but consider moving the React app into its own
directory if the two paradigms start colliding.

## Setup

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
```

`vite.config.ts`:

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
```

`src/index.css`:

```css
@import "tailwindcss";
```

Add the alias to `tsconfig.json` **and** `tsconfig.app.json` so both the editor
and the CLI can resolve it:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

TypeScript 6 deprecates `baseUrl`, so omit it. `paths` resolves relative to the
config file on its own; including `baseUrl` fails the build with TS5101.

Then:

```bash
npx shadcn@latest init      # prompts for a base (radix) and a preset (nova)
npm install lucide-react    # icons used by the demo
```

## spotlight-card

`GlowCard` renders a card whose border and backdrop carry a spotlight that
follows the pointer, with the hue shifting across the viewport width.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Optional. Laid out in a `1fr auto` grid |
| `className` | `string` | `''` | Appended last, so it wins |
| `glowColor` | `blue \| purple \| green \| red \| orange` | `blue` | Sets hue base and spread |
| `size` | `sm \| md \| lg` | `md` | Ignored when `customSize` |
| `width` / `height` | `string \| number` | - | Numbers become px. Needs `customSize` |
| `customSize` | `boolean` | `false` | Drops the preset size and aspect ratio |

No image assets are required; the card is a container.

### Known limitations

- **Pointer only.** The glow is driven by `pointermove`, so it never appears on
  touch or keyboard focus. Add a `:focus-visible` treatment if these cards are
  interactive.
- **`background-attachment: fixed`** is what makes the spotlight track in
  viewport space, but Safari on iOS handles it poorly and it forces repaints.
  Check it on a real device before shipping to mobile.
- The glow is decorative and drops out under forced-colors mode.
