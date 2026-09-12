# ARCCHIVE XI Curated Style

I'm building an e-commerce site called ARCCHIVE XI, selling curated,

sourced clothing (mainly from China) — not our own manufactured line.

The reference for layout and feel is cribcultures.com: a clean white

e-commerce template, minimal nav, full-bleed hero image, a product

grid with sold-out badges, a horizontal UGC/proof strip, a brand story

section, and a dark footer.

DESIGN SYSTEM — follow exactly:

- Base: white background (#FFFFFF), near-black text (#0E0E0F). This is

  95% of the site. Every page (home, shop, product, about) uses this

  white base by default.

- Accent material: "chrome" — a metallic gradient from light grey

  (#F2F3F4) through mid grey (#9AA0A6) to dark grey (#5B6066). Chrome

  is used ONLY for: the logo mark, hover states on nav links and

  buttons, thin dividers between sections, and badges. It is never a

  page background.

- Brutalist material: raw concrete/charcoal texture (#B9B7B2 to

  #232321). This is confined to exactly ONE section per page at most —

  typically a "brand story" or "sourced from" block — treated like a

  photograph or a single deliberate scene, not a site-wide theme.

- Typography: one grotesk sans-serif throughout (nav, body, product

  names). No second display typeface — the logo carries the brand

  personality, the type system stays quiet and functional.

- Footer is dark (near-black), matching the reference site — this is

  the one place black is structural, not decorative.

HARD CONSTRAINT: Do not make the overall site dark, black, or

gothic-themed. If you're unsure whether a section should be white or

dark, default to white. Only the one "brand story" section and the

footer are dark. Everything else — nav, hero copy area if used,

product grid, shop page, product detail page — stays on the white base.

Logo: a chrome/metallic "XI" mark inside a thin chrome ring, next to

the wordmark "ARCCHIVE" in a bold sans-serif, all caps, letter-spaced.

I have a source image of the chrome XI mark I'll attach/upload — use

its proportions and metallic gradient as the reference for the mark

wherever it appears in the UI.

Confirm you understand this system before generating any page, and

flag it back to me if a request I make later seems to contradict it

(e.g. if I say "make it more brutalist," ask whether I mean the one

accent section or the whole site).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://arc-xi-threads.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3d6e8ba-f481-44f5-9df7-dc504d1d0704).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
