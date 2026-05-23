# A-Spec Auto Headquarters · Demo

Demo de landing multi-página para A-Spec Auto HQ (31 Mahan St, West Babylon NY).

## Stack

- HTML estático multi-página
- Tailwind CDN
- Google Fonts: Barlow Condensed + Anton + JetBrains Mono + Inter
- Vanilla JS (loader boot sequence, scroll progress, IntersectionObserver reveals, counter animations, i18n)
- Bilingüe EN/ES con localStorage
- Listo para Vercel

## Diseño único

**Blueprint Engineering Whitepaper aesthetic** — distinto a los 3 anteriores:
- Huntington → editorial magazine
- Global Gas → neon highway collage
- JP Cliprz → brutalist streetwear light
- **A-Spec → blueprint engineering** (technical drawing / spec sheet)

**Características:**
- Paleta navy blueprint (`#0a1929`) + warm paper white + safety orange + cyan + yellow
- Background grid pattern blueprint (dos capas)
- Typography mono + Barlow Condensed display (technical/engineering)
- Cards con corner brackets CAD (`::before` `::after`)
- Schematic dividers con dots tipo dimension lines
- Dimensional callouts (con dots a los lados)
- Spec readout blocks (key/value rows)
- Big dyno-style numerals con animated counter
- Loader boot sequence terminal-style
- Stamps con colores cyan/orange/yellow/green

## Páginas

- `/` — Hero spec sheet + servicios + featured build (Tacoma) + 4-step process + reviews
- `/services` — Catálogo completo organizado por categoría (mech/susp/body/powd/rim/tint/dtal)
- `/builds` — Archive de 9 builds documentados con stamps de fecha + filters
- `/about` — Shop facility + 4 reglas + crew (3 techs) + timeline 2018→2026
- `/contact` — 3 contact cards + form con service tier select + map embebido + hours

## Negocio

- **Phone**: +1 (516) 395-7424
- **Address**: 31 Mahan St, West Babylon, NY 11704
- **Hours**: Mon–Sat 9AM–8PM (Closed Sundays)
- **Instagram**: @a_spec_auto_hq
- **Rating**: 5.0 ★
- **Services**: Mechanical, suspension/coilovers, bodywork, powder coat, rim repair, window tint, detailing, custom builds
- **Idiomas**: English / Español (bilingual mechanics)

## Deploy

```
vercel --prod
```
