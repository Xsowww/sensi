# Immo'visia

Homepage for a fictional real estate agency in Pau (64000). Static: no build
step, no framework, no runtime dependencies. Open `index.html` or serve the
folder.

```
python3 -m http.server 8000
```

## Layout

| File | Role |
| --- | --- |
| `index.html` | Markup, JSON-LD `RealEstateAgent` schema, inlined icon sprite |
| `style.css` | Tokens and all component styles |
| `main.js` | Sticky nav, scroll reveal, mobile menu, form validation |
| `assets/fonts/` | Outfit (display) and Manrope (body), variable, latin subset |
| `assets/icons/` | Phosphor source SVGs the inline sprite was built from |

## Design decisions

- **Light theme only.** The brief specifies a soft sky blue background, so
  there is no dark variant: inverting it would discard the brand.
- **One accent** (`--accent: #b3580f`) for every CTA and detail. White on it
  measures 4.86:1, and it measures 4.54:1 as text on the page background, so
  both uses clear WCAG AA.
- **Radius rule:** buttons are full pills, everything else uses `--r` (18px).
- **Self-hosted fonts.** No Google Fonts CDN call, which also keeps the page
  clear of the GDPR problem French courts have flagged with hotlinked fonts.
- **Scroll effects use IntersectionObserver**, never a scroll listener, and
  collapse to static under `prefers-reduced-motion`. Content stays visible
  with JavaScript disabled.

## Before going live

1. **Replace the images.** Every `src` points at `picsum.photos`, which
   returns an unrelated random photo per seed. Real slots and sizes:
   hero 1000x1250, listings 1200x800, 800x1000, 800x1000, 1200x800, 1200x750.
2. **Wire the contact form.** `main.js` only drives the success state; it
   posts nothing. See the `TODO` in the submit handler.
3. **Replace the sample content.** The five listings, the 2011 founding date,
   the address, the phone number and the CPI licence number are all invented
   placeholders.
4. Add a real `Mentions légales` page: the footer link is a stub.

## Licences

Fonts and icons are vendored from npm, licences kept alongside them. Outfit
and Manrope are SIL OFL; Phosphor Icons is MIT.
