# HAI COFE — Editorial Coffee & Tea Landing

Multi-page site for **HAI COFE**. The visual system and motion follow the analysis in [andtea_ui_analysis.md](./andtea_ui_analysis.md). All effect code was rewritten as ES modules, and every brand asset (logo, cups, icons, photos) is original HAI COFE material.

## Stack
- Vite 6 (MPA): `index`, `about`, `drinks`, `news`, `news-detail`
- Locomotive Scroll v4 + `@barba/core` (MIT, installed from npm)
- Vanilla JS/CSS, one shared rAF loop that pauses itself with IntersectionObserver

## Effects implemented
- Loader + SPA page transitions (Barba)
- Smooth scroll, parallax, and `.esin` reveal on enter
- Logo shrinks on scroll and switches to outline on hover; wave menu button morphs into X; slide-in drawer
- Hero circular text whose spin speeds up with scroll velocity
- Pinned rotary product showcase with N items (dynamic angles, background color change, snap, skip button, mobile dots)
- Image scale-in reveal, curved text that scrubs with scroll, cursor-following ellipse in the news list
- Marquee rail track and Core DNA reveal (About)
- Auto cup slider, cream slider, and sticky accordion menu (Drinks)
- News category filter, copy-link toast (News)
- WCAG fixes: AA contrast for functional text, 44px touch targets, `prefers-reduced-motion`, semantic buttons

## Run
```bash
npm install
npm run dev       # http://localhost:5173
npm run build && npm run preview
```

## Regenerate assets
```bash
node scripts/generate-assets.mjs   # SVG logo, cups, icons, garnishes
node scripts/generate-news.mjs     # news.html + news-detail.html
```

