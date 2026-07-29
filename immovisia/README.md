# Immo'visia

Homepage for a fictional real estate agency in Pau (64000). React 19 + Vite +
TypeScript + Tailwind 4, with the shadcn layout conventions.

```bash
npm install
npm run dev        # dev server
npm run build      # typecheck, bundle, then prerender to static HTML
npm run preview    # serve the build
npm run typecheck
```

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Vite entry, meta tags, JSON-LD `RealEstateAgent` |
| `src/index.css` | `@import "tailwindcss"` plus the design system |
| `src/App.tsx` | Section composition |
| `src/components/sections/` | Intro, Nav, Statement, Listings, Services, Contact, Property, Footer |
| `src/components/SectionLink.tsx` | In-page links that survive hash routing |
| `src/components/ui/` | shadcn components (`@/components/ui`) |
| `src/hooks/useReveal.ts` | Scroll reveal and sticky-nav state |
| `src/data/listings.ts` | Sample inventory |
| `src/assets/` | Self-hosted fonts, Phosphor icon sources |

`components.json` maps `@/components/ui` to `src/components/ui`, which is where
`npx shadcn@latest add <component>` writes. Note TypeScript 6 deprecates
`baseUrl`, so `tsconfig` declares `paths` alone.

## Design decisions

- **Light theme only.** The brief specifies a soft sky blue background, so
  there is no dark variant: inverting it would discard the brand.
- **Tailwind alongside plain CSS.** The design system is the stylesheet carried
  over from the static build, contrast ratios and all. Tailwind is installed
  because the shadcn components consume it; rewriting 965 verified lines into
  utilities would only have risked regressions.
- **One accent** (`--accent: #b3580f`). White on it measures 4.86:1, and it
  measures 4.54:1 as text on the page background, so both clear WCAG AA.
- **Radius rule:** buttons are full pills, everything else uses `--r` (18px).
- **Self-hosted fonts**, which also avoids the GDPR problem French courts have
  flagged with hotlinked Google Fonts.
- **Prerendered.** `npm run build` renders the app to static HTML via
  `src/entry-server.tsx`, then the client hydrates it. Without this a
  client-only SPA shows a blank page with JavaScript disabled, which the static
  version did not.
- **Scroll effects use IntersectionObserver**, never a scroll listener, and
  collapse to static under `prefers-reduced-motion`.

## Routing

Two routes: `/` and `/bien/:id`, one detail page per listing.

**Hash routing** (`#/bien/gan`), chosen so the build stays a set of static files:
no server rewrites, works from a subdirectory, and works inside the single-file
artifact. The cost is SEO, since crawlers do not index hash routes and only `/`
is prerendered.

*To deploy for real:* swap `HashRouter` for `BrowserRouter` in `src/main.tsx`,
extend `prerender.mjs` to loop over `listings` and emit
`dist/bien/<id>/index.html` for each, and set `base: '/'` in `vite.config.ts`.
Every listing then has a real, indexable URL.

Because the hash belongs to the router, in-page anchors cannot be plain
`href="#biens"`: that reads as a navigation to `/biens` and lands on the
not-found panel. `SectionLink` keeps the href, for semantics and for the no-JS
prerender where the browser simply jumps to the element, but intercepts the
click and scrolls, navigating home first when it is on a detail page. Arriving
home with a section target also starts the intro already expanded, otherwise
its scroll lock would immediately undo the jump.

## Listings

Two tabs, `Acheter` and `Louer`, filtering one row per property: photo left,
title with a summary and feature pills in the middle, the location map on the
right, and a call to action opening the detail page. The tabs follow the ARIA
tabs pattern, including left and right arrow keys.

## GlowCard

`src/components/ui/spotlight-card.tsx` renders a card whose border carries a
spotlight following the pointer. The services section uses it with
`glowColor="brand" variant="light"`.

Three defects in the upstream component were fixed to make it work here:

1. **The border ring never painted.** The mask intersected a fully transparent
   layer with an opaque one, which is transparent everywhere. Replaced with two
   opaque layers clipped to padding-box and border-box and subtracted.
2. **The spotlight tracked the wrong place.** It fed viewport coordinates into a
   `background-attachment: fixed` layer, but Chromium sizes that layer against
   the element while positioning it against the viewport, so the glow landed far
   from the cursor. Now element-local, which also drops the fixed-attachment
   repaint cost that janks on iOS.
3. **Per-instance globals.** Each card injected its own copy of the stylesheet
   and its own `pointermove` listener. Both are now shared, with rect reads
   batched into one animation frame.

The `variant` prop is additive: `dark` keeps the original rendering, `light`
retunes the backdrop, brightness and shadow for pale grounds.

### Known limitations

- **Pointer only.** The glow never appears on touch or keyboard focus. Add a
  `:focus-visible` treatment if these cards become interactive.
- The glow is decorative and drops out under forced-colors mode.

## ScrollExpandMedia

`src/components/ui/scroll-expansion-hero.tsx` is the opening sequence, wired up
in `src/components/sections/Intro.tsx`. It carries the brand presentation too:
the wordmark sits over the photo, the photo expands as you scroll, then the
positioning line and the calls to action arrive underneath. There is no separate
hero section any more, so the page opens on one full-height moment rather than
two in a row.

Adapting the upstream block required:

1. **`next/image` replaced with `<img>`.** This is a Vite app, not Next.js, so
   the original import could not resolve at all.
2. **`motion/react` instead of `framer-motion`**, the current package name for
   the same library.
3. **Native event types**, replacing React's synthetic `WheelEvent` and
   `TouchEvent` on `window` listeners and the `as unknown as EventListener`
   casts they forced.
4. **Progress kept in a ref.** The effect listed `scrollProgress` as a
   dependency, so every wheel tick tore down and re-added five window
   listeners. They are now bound once.

Three interaction defects also had to be fixed, because the component pins the
window at `scrollY 0` until it has been expanded:

- **Keyboard was trapped.** Only wheel and touch advanced the animation, so
  keyboard users could never reach the rest of the page. Tab, PageDown, arrows,
  space and End now open it immediately.
- **In-page anchors were dead.** Clicking any nav link did nothing until the
  intro had been expanded. A capture-phase click handler releases the lock
  first.
- **`prefers-reduced-motion` was ignored.** It now skips the lock entirely and
  renders open.

`textBlend` is available but left off here: `mix-blend-difference` made the
first title word muddy where it crossed the media frame.

### Known limitations

- The section still takes over the wheel on first load, which is inherent to
  the effect. Anyone who dislikes that can reach the content with a nav link,
  the keyboard, or by setting reduced motion.
- Merging the hero in means the page's own calls to action only appear once the
  photo has expanded. The nav keeps "Estimer mon bien" visible throughout, so
  there is still a conversion path above the fold.

## TiltCard

`src/components/ui/tilt-card.tsx` wraps the contact panel: it tilts in 3D
towards the pointer and runs light beams along its border.

It is the reusable half of the sign-in-card block. **The sign-in form itself was
not carried over** - email, password, "remember me" and Google sign-in have no
place in an estate agency's enquiry form - and the dark purple treatment was
replaced by the page palette.

Changes against the upstream code:

1. **`next/link` dropped.** This is Vite, not Next.js, so the import could not
   resolve.
2. **`motion/react` instead of `framer-motion`.**
3. **Removed a per-frame state update.** `setMousePosition` re-rendered the
   whole card on every mouse move and its value was never read anywhere. The
   rotation already runs on motion values, off the render path.
4. **Removed `whileFocus` from the wrapper divs.** A `div` is not focusable, so
   it never fired.
5. **Honours `prefers-reduced-motion`**, dropping both the tilt and the beams.
6. **Holds flat while a field inside has focus.** A form that tilts while you
   type is unusable; capture-phase focus handlers freeze it.

Tilt is 7 degrees at the corners rather than the upstream 10, which suits a
form better than a small card.

## LocationMap

`src/components/ui/expanded-map.tsx` sits at the foot of every listing card:
a row showing the district, which expands to a map centred on the property.
Coordinates live in `src/data/listings.ts`.

Changes against the upstream block:

1. **`next/image` replaced with `<img>`.** Vite, not Next.js.
2. **The shadcn theme classes it used did not exist here.** `bg-background`,
   `text-foreground`, `border-border`, `bg-muted` and `text-muted-foreground`
   all need tokens that `shadcn init` writes, and this project never ran it, so
   Tailwind would not have emitted those utilities at all and the card would
   have rendered unstyled. They now use the site's own palette.
3. **Fluid width.** It animated between fixed 240px and 360px, which overflowed
   the narrower listing cards on mobile. Only the height animates now.
4. **`crossOrigin="anonymous"` dropped** from the tiles. It forces a CORS
   request for images that never touch a canvas, so any tile server omitting
   the header fails to load for no reason.
5. **Keyboard access.** The whole card was a `div` with `onClick`, unreachable
   by keyboard. It is a real `<button>` with `aria-expanded`/`aria-controls`.
6. **Attribution.** OpenStreetMap data is ODbL; credit is required wherever
   tiles are shown, and the upstream component had none.
7. **Tiles load on open, not on mount.** Five listings would otherwise have
   pulled 45 tiles on page load.
8. **A fallback panel** when tiles cannot be fetched, instead of a grey
   rectangle pulsing forever.

### Known limitations

- **Tiles are third-party.** They do not load where outbound requests are
  blocked, including the published artifact, which falls back to the
  coordinates panel.
- **Tile usage policy.** `tile.openstreetmap.org` is not intended for
  production traffic and CARTO basemaps have their own terms. A real
  deployment needs its own tile plan.
- Coordinates are approximate district centres, not surveyed addresses.

## Before going live

1. **Replace the images.** Every `src` points at `picsum.photos`, which returns
   an unrelated random photo per seed. Slots and sizes: hero 1000x1250,
   listings 1200x800, 800x1000, 800x1000, 1200x800, 1200x750. The intro needs
   two more: a Pau panorama at 1920x1080 for the background and a local
   property at 1280x720 for the expanding frame.
2. **Wire the contact form.** `Contact.tsx` only drives the success state; it
   posts nothing. See the `TODO` in the submit handler.
3. **Replace the sample content.** The five listings, the 2011 founding date,
   the address and the phone number are invented placeholders.
4. Add a real `Mentions légales` page: the footer link is a stub.
5. **Sort out map tiles.** See the LocationMap limitations above: pick a tile
   provider whose terms cover this traffic, and replace the approximate
   coordinates with the real ones.

## Licences

Fonts and icons are vendored from npm, licences kept alongside them. Outfit and
Manrope are SIL OFL; Phosphor Icons is MIT.
