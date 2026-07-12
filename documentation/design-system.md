# Design System

This document is the authoritative frontend design system for the hackathon. Use it as the single source of truth for all UI components, layouts, and visual treatments across the entire project.

> Style direction: hand-drawn, friendly SaaS, warm and polished. Script headlines for emotion, strong sans-serif UI for function, and a small set of accent colors used carefully.

---

## 1. Design principles

- Use one primary brand color for primary actions and brand emphasis.
- Use teal, orange, coral, and sky blue only as accent colors inside illustrations, underlines, markers, and highlights.
- Keep the interface clean, readable, and slightly playful.
- Reserve Caveat for large emotional headlines and handwritten asides only.
- Use Inter for all functional UI text, buttons, paragraphs, navigation, and data.

---

## 2. Design tokens

```css
:root {
  /* Brand colors */
  --purple:      #714B67;
  --purple-dark: #5B3A53;
  --purple-tint: #F1EBEF;

  --teal:        #00A09D;
  --teal-dark:   #007E7B;

  --orange:      #F5A623;
  --orange-dark: #DB8F13;

  --coral:       #F2726F;
  --blue:        #3AB0E6;

  /* Neutrals */
  --ink:         #1B1B2E;
  --ink-soft:    #46465A;
  --gray-600:    #6B6B76;
  --gray-300:    #C8C8D0;
  --gray-150:    #E9E9EE;
  --gray-100:    #F4F4F7;
  --gray-50:     #FAFAFB;
  --white:       #FFFFFF;
  --footer-bg:   #1E1E2E;

  /* Typography */
  --font-script: 'Caveat', 'Segoe Script', cursive;
  --font-sans:   'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  --shadow-card: 0 4px 24px rgba(27,27,46,0.07);
  --shadow-card-hover: 0 10px 32px rgba(27,27,46,0.12);
  --shadow-btn: 0 2px 8px rgba(113,75,103,0.30);

  --container: 1180px;
}
```

### Token usage rules

- Use `--purple` for primary actions, logo marks, and brand emphasis.
- Use `--teal`, `--orange`, `--coral`, and `--blue` for highlights, accents, and illustrations.
- Use neutrals for body text, borders, surfaces, and layout structure.
- Keep the visual system consistent across all screens and components.

---

## 3. Reset and base styles

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
img { max-width: 100%; display: block; }
button { font-family: inherit; }

body {
  font-family: var(--font-sans);
  color: var(--ink-soft);
  background: var(--white);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.wrap {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 24px;
}
```

---

## 4. Page scaffold and layout system

```css
.ds-hero {
  padding: 96px 24px 64px;
  text-align: center;
  background: linear-gradient(180deg, #fff 0%, var(--gray-50) 100%);
  border-bottom: 1px solid var(--gray-150);
}

.ds-hero h1 {
  font-family: var(--font-script);
  font-weight: 700;
  font-size: clamp(2.6rem, 6vw, 4.6rem);
  color: var(--ink);
  margin: 0 0 8px;
}

.ds-hero p {
  font-size: 1.1rem;
  color: var(--gray-600);
  max-width: 560px;
  margin: 0 auto;
}

.ds-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--gray-150);
}

.ds-nav .wrap {
  display: flex;
  gap: 20px;
  padding: 14px 24px;
  overflow-x: auto;
}

.ds-nav a {
  font-size: .85rem;
  font-weight: 600;
  color: var(--ink-soft);
  text-decoration: none;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: var(--radius-pill);
}

.ds-nav a:hover {
  background: var(--purple-tint);
  color: var(--purple);
}

.section {
  padding: 64px 24px;
  border-bottom: 1px solid var(--gray-150);
}

.section.alt {
  background: var(--gray-50);
}

.section h2 {
  font-family: var(--font-script);
  font-size: 2.4rem;
  color: var(--ink);
  margin: 0 0 6px;
}

.section .lede {
  color: var(--gray-600);
  max-width: 640px;
  margin: 0 0 36px;
  font-size: .98rem;
}

.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
}
```

---

## 5. Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `--purple` | `#714B67` | Primary CTA, logo mark |
| `--purple-dark` | `#5B3A53` | Hover, active |
| `--purple-tint` | `#F1EBEF` | Pale background tint |
| `--teal` | `#00A09D` | Secondary accent, success, AI, sync |
| `--teal-dark` | `#007E7B` | Darker teal state |
| `--orange` | `#F5A623` | Marker, arrows, sparkle |
| `--orange-dark` | `#DB8F13` | Darker orange state |
| `--coral` | `#F2726F` | Strike-through, conversion emphasis |
| `--blue` | `#3AB0E6` | Underlines, links in illustrations |
| `--ink` | `#1B1B2E` | Headlines, primary text |
| `--ink-soft` | `#46465A` | Secondary text |
| `--gray-600` | `#6B6B76` | Body copy |
| `--gray-300` | `#C8C8D0` | Borders, subdued UI |
| `--gray-150` | `#E9E9EE` | Light border / surface |
| `--gray-100` | `#F4F4F7` | Neutral button surfaces |
| `--gray-50` | `#FAFAFB` | Page section backgrounds |
| `--white` | `#FFFFFF` | Base surface |
| `--footer-bg` | `#1E1E2E` | Footer background |

---

## 6. Typography

### Type system

- Use `Caveat` for large, emotional, headline-style phrases.
- Use `Inter` for all UI and body copy.
- Never use script typography for nav, buttons, or dense body copy.

```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

--font-script: 'Caveat', cursive;
--font-sans:   'Inter', sans-serif;
```

### Type samples

- Display / xl — Caveat 700 · 64px
  - All your business, one platform
- Display / lg — Caveat 700 · 44px
  - Accounting made effortless
- Display / md — Caveat 600 · 32px
  - Never miss a follow-up
- Heading / sans — Inter 700 · 22px
  - All the features done right
- Body — Inter 400 · 16px
  - Imagine one AI-native platform for all your operations — fast, complete, and simple.
- Caption — Inter 500 · 13px
  - Free, forever, with unlimited users.

---

## 7. Buttons

### Button variants

```html
<button class="btn btn-primary">Start now – it's free</button>
<button class="btn btn-secondary">Meet an advisor</button>
<a href="#" class="btn btn-ghost">
  See all features
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
</a>
<button class="btn btn-primary btn-sm">Try it free</button>
<button class="btn btn-primary" disabled>Disabled</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: .92rem;
  padding: 13px 26px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}

.btn:active { transform: translateY(1px); }

.btn-primary {
  background: var(--purple);
  color: #fff;
  box-shadow: var(--shadow-btn);
}

.btn-primary:hover { background: var(--purple-dark); }

.btn-secondary {
  background: var(--gray-100);
  color: var(--purple);
}

.btn-secondary:hover { background: var(--gray-150); }

.btn-ghost {
  background: transparent;
  color: var(--purple);
  padding: 13px 4px;
}

.btn-ghost:hover { gap: 12px; }

.btn-ghost svg { transition: transform .15s ease; }

.btn-sm {
  padding: 9px 18px;
  font-size: .82rem;
}

.btn[disabled] {
  opacity: .45;
  cursor: not-allowed;
}
```

### Button rules

- Use one filled primary action per view.
- Use secondary buttons for quieter or supporting actions.
- Use ghost buttons for low-emphasis links and inline navigation.

---

## 8. Hand-drawn text effects

These effects should be used sparingly to emphasize one word or phrase per headline.

```html
<div class="type-sample sans" style="font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:28px;">
  All your business on <span class="marker">one platform</span>.
</div>

<div class="type-sample sans" style="font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:28px;">
  Simple, efficient, yet <span class="u-blue">affordable</span>!
</div>

<div class="type-sample sans" style="font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:28px;">
  <span class="strike-swap"><span class="old">Level up</span></span> your quality of <span class="u-teal">work</span>
</div>

<div class="type-sample sans" style="font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:8px;">
  All the <span class="circle-word">features</span> done <span class="u-blue">right</span>.
</div>
```

```css
.marker {
  position: relative;
  padding: 0 6px;
  white-space: nowrap;
  z-index: 1;
}

.marker::before {
  content: "";
  position: absolute;
  left: -3px;
  right: -3px;
  top: 18%;
  bottom: 4%;
  background: var(--orange);
  z-index: -1;
  border-radius: 6px 10px 8px 12px / 10px 6px 12px 8px;
  transform: rotate(-0.8deg);
  opacity: 0.85;
}

.underline-accent {
  position: relative;
  padding-bottom: 4px;
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 3px;
}

.u-blue {
  box-shadow: inset 0 -3px 0 -1px var(--blue);
  text-decoration: underline;
  text-decoration-color: var(--blue);
  text-decoration-thickness: 3px;
  text-underline-offset: 5px;
}

.u-orange {
  text-decoration: underline;
  text-decoration-color: var(--orange);
  text-decoration-thickness: 3px;
  text-underline-offset: 5px;
}

.u-teal {
  text-decoration: underline wavy var(--teal);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.strike-swap {
  position: relative;
  display: inline-block;
}

.strike-swap .old {
  color: var(--gray-600);
  position: relative;
}

.strike-swap .old::after {
  content: "";
  position: absolute;
  left: -6%;
  right: -6%;
  top: 48%;
  height: 3px;
  background: var(--coral);
  transform: rotate(-3deg);
}

.circle-word {
  position: relative;
  display: inline-block;
  padding: 0 6px;
  z-index: 1;
}

.circle-word::after {
  content: "";
  position: absolute;
  inset: -6px -10px;
  border: 2.5px solid var(--teal);
  border-radius: 54% 46% 52% 48% / 55% 48% 52% 45%;
  transform: rotate(-1.5deg);
  z-index: -1;
}
```

---

## 9. Badges and tags

```html
<div class="star-badge">
  <svg viewBox="0 0 24 24">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/>
  </svg>
</div>
<span class="pill-tag">GST compliant</span>
<span class="pill-tag teal">98% recognition</span>
```

```css
.star-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.star-badge svg {
  width: 16px;
  height: 16px;
  fill: var(--orange);
}

.pill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .75rem;
  font-weight: 600;
  background: var(--purple-tint);
  color: var(--purple);
  padding: 5px 12px;
  border-radius: var(--radius-pill);
}

.pill-tag.teal {
  background: #E3F5F4;
  color: var(--teal-dark);
}
```

---

## 10. Hand-drawn icon set

Use one consistent icon language: thick organic outlines, a consistent ink stroke, and one flat accent fill per icon.

### Icon 1 — First call phone

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 28C14 18 20 12 32 12C44 12 50 18 52 28" stroke="#1B1B2E" stroke-width="3" stroke-linecap="round"/>
  <path d="M8 26C8 22.5 12.5 22 15 24C18 26.4 18 31.5 15 34C12.5 36 8 34.5 8 30Z" fill="#3AB0E6" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M56 26C56 22.5 51.5 22 49 24C46 26.4 46 31.5 49 34C51.5 36 56 34.5 56 30Z" fill="#3AB0E6" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M18 42C18 36 46 36 46 42C46 46.5 40 48 32 48C24 48 18 46.5 18 42Z" fill="#E9E9EE" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="32" cy="42" r="4" fill="#F5A623" stroke="#1B1B2E" stroke-width="2"/>
  <path d="M26 14L28 8M38 14L36 8" stroke="#1B1B2E" stroke-width="2.5" stroke-linecap="round"/>
</svg>
```

### Icon 2 — Demo document

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 8H40L48 18V54C48 56.2 46.2 58 44 58H16C13.8 58 12 56.2 12 54V12C12 9.8 13.8 8 16 8Z" fill="#F2726F" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M38 8V18H48" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M20 28H40M20 36H40M20 44H32" stroke="#1B1B2E" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### Icon 3 — Quotation calendar

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="12" y="14" width="40" height="38" rx="6" fill="#F5A623" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M12 26H52" stroke="#1B1B2E" stroke-width="3"/>
  <path d="M22 10V18M42 10V18" stroke="#1B1B2E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="20" cy="34" r="2.5" fill="#1B1B2E"/><circle cx="32" cy="34" r="2.5" fill="#1B1B2E"/><circle cx="44" cy="34" r="2.5" fill="#1B1B2E"/>
  <circle cx="20" cy="44" r="2.5" fill="#1B1B2E"/><circle cx="32" cy="44" r="2.5" fill="#1B1B2E"/><circle cx="44" cy="44" r="2.5" fill="#1B1B2E"/>
</svg>
```

### Icon 4 — Verified check

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" fill="#00A09D" stroke="#1B1B2E" stroke-width="3"/>
  <path d="M22 32L29 39L43 23" stroke="#1B1B2E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Icon 5 — Email / reminder

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="16" width="44" height="32" rx="4" fill="#F2726F" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M10 20L32 34L54 20" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M14 44L26 32M50 44L38 32" stroke="#1B1B2E" stroke-width="3"/>
</svg>
```

### Icon 6 — Live chat

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 40V16C12 13.8 13.8 12 16 12H48C50.2 12 52 13.8 52 16V36C52 38.2 50.2 40 48 40H22L12 48V40Z" fill="#00A09D" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="22" cy="26" r="3" fill="#1B1B2E"/><circle cx="32" cy="26" r="3" fill="#1B1B2E"/><circle cx="42" cy="26" r="3" fill="#1B1B2E"/>
</svg>
```

### Icon 7 — Vibrating SMS

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="10" width="28" height="44" rx="6" fill="#3AB0E6" stroke="#1B1B2E" stroke-width="3" stroke-linejoin="round"/>
  <rect x="22" y="14" width="20" height="30" rx="2" fill="#FFFFFF" stroke="#1B1B2E" stroke-width="2"/>
  <circle cx="32" cy="49" r="2.5" fill="#1B1B2E"/>
  <path d="M10 24C12 26 12 30 10 32M54 24C52 26 52 30 54 32" stroke="#1B1B2E" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### Icon 8 — VoIP badge

```svg
<svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" fill="#E3F5F4" stroke="#00A09D" stroke-width="3"/>
  <path d="M22 24C24 20 40 20 42 24C44 28 42 32 38 32C34 32 34 38 34 40" stroke="#1B1B2E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="34" cy="45" r="2" fill="#1B1B2E"/>
</svg>
```

---

## 11. Enriched app icon tiles

Each tile pairs a tinted background square with a two-tone flat glyph.

```html
<div class="app-card">
  <div class="app-icon" style="background:#EAE6EE;">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="4" fill="#714B67"/>
      <circle cx="11" cy="11" r="3" fill="#F5A623"/>
      <circle cx="21" cy="21" r="3" fill="#00A09D"/>
      <line x1="8" y1="24" x2="24" y2="8" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    </svg>
  </div>
  <h5 class="app-title">Accounting</h5>
</div>
```

```css
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.app-card {
  background: var(--white);
  border: 1px solid var(--gray-150);
  border-radius: var(--radius-md);
  padding: 20px 12px;
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: all .2s ease;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.app-card .app-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.1), 0 4px 10px rgba(0,0,0,.03);
}

.app-card .app-title {
  font-size: .82rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}
```

### App tile examples

- Accounting
- Knowledge
- Sign
- CRM
- Studio
- Subscriptions
- Artificial intelligence
- Discuss
- Documents
- Project
- Timesheets
- Helpdesk

---

## 12. Screenshot frame

```html
<div class="screen-frame" style="max-width:520px;">
  <div class="bar"><i></i><i></i><i></i></div>
  <div class="body">
    <div style="font-size:.75rem;color:var(--gray-600);margin-bottom:6px;">Dashboard</div>
    <div style="display:flex;gap:12px;">
      <div style="flex:1;background:var(--gray-100);border-radius:8px;height:70px;"></div>
      <div style="flex:1;background:var(--gray-100);border-radius:8px;height:70px;"></div>
    </div>
  </div>
</div>
```

```css
.screen-frame {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--gray-150);
  overflow: hidden;
}

.screen-frame .bar {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-150);
}

.screen-frame .bar i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--gray-300);
  display: block;
}

.screen-frame .body {
  padding: 26px;
}
```

---

## 13. Follow-up process flow

Use a hand-drawn process map with a dashed connector and per-step pills.

```html
<div class="sales-flow-container">
  <div class="flow-visual">
    <div class="flow-connector-line"></div>
    <div class="flow-row">
      <div class="flow-node">
        <div class="node-icon-wrapper">...</div>
        <p class="node-title">First call</p>
      </div>
      <div class="flow-node">
        <span class="node-duration">3 days</span>
        <div class="node-icon-wrapper">...</div>
        <p class="node-title">Schedule a demo</p>
      </div>
      <div class="flow-node">
        <span class="node-duration">2 days</span>
        <div class="node-icon-wrapper">...</div>
        <p class="node-title">Make a quotation</p>
      </div>
      <div class="flow-node">
        <span class="node-duration">3 days</span>
        <div class="node-icon-wrapper">...</div>
        <p class="node-title">Follow-up quote</p>
      </div>
    </div>
  </div>
</div>
```

```css
.sales-flow-container {
  background: var(--gray-50);
  border: 1px solid var(--gray-150);
  border-radius: var(--radius-lg);
  padding: 48px 24px;
  position: relative;
  overflow: hidden;
}

.flow-header { text-align: center; margin-bottom: 48px; }
.flow-header h3 {
  font-family: var(--font-script);
  font-size: 2.5rem;
  color: var(--ink);
  margin: 0 0 10px;
}

.flow-visual {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.flow-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 24px;
  position: relative;
  z-index: 2;
}

.flow-row.centered { justify-content: center; gap: 48px; }

.flow-connector-line {
  position: absolute;
  top: 40px;
  left: 10%;
  right: 10%;
  height: 2px;
  border-top: 2px dashed var(--gray-300);
  z-index: 1;
}

.flow-node {
  flex: 1;
  min-width: 120px;
  max-width: 160px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.flow-node .node-icon-wrapper {
  width: 72px;
  height: 72px;
  background: var(--white);
  border: 1px solid var(--gray-150);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: var(--shadow-card);
  transition: all .2s ease;
}

.flow-node:hover .node-icon-wrapper {
  transform: scale(1.1);
  box-shadow: var(--shadow-card-hover);
}

.flow-node .node-duration {
  position: absolute;
  top: -24px;
  font-size: .72rem;
  font-weight: 500;
  color: var(--gray-600);
  background: var(--gray-150);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.flow-node .node-title {
  font-family: var(--font-script);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}
```

---

## 14. Speech-bubble callouts

```html
<div class="callout">
  <div class="avatar">🙂</div>
  <div class="bubble">Wait! There is more!</div>
</div>
```

```css
.callout {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  max-width: 460px;
}

.callout .avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--purple-tint);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--purple);
  font-weight: 700;
}

.callout .bubble {
  position: relative;
  background: var(--white);
  border: 1px solid var(--gray-150);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-size: .85rem;
  color: var(--ink-soft);
  box-shadow: var(--shadow-card);
}

.callout .bubble::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 16px;
  width: 12px;
  height: 12px;
  background: var(--white);
  border-left: 1px solid var(--gray-150);
  border-bottom: 1px solid var(--gray-150);
  transform: rotate(45deg);
}
```

---

## 15. Testimonial

```html
<div class="testimonial">
  <div class="quote">
    <span class="quote-mark">&ldquo;</span>
    A process that used to take four days now takes three hours, with a better experience for our clients.
  </div>
  <div class="person">
    <div class="av"></div>
    <div>
      <div class="name">Sample Name</div>
      <div class="role">Head of Finance, Client Co.</div>
    </div>
  </div>
</div>
```

```css
.testimonial {
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.testimonial .quote {
  font-size: 1.05rem;
  color: var(--ink);
  max-width: 600px;
}

.testimonial .quote-mark {
  font-family: var(--font-script);
  color: var(--orange);
  font-size: 2.4rem;
  line-height: 0.4;
  display: block;
  margin-bottom: 10px;
}
```

---

## 16. Navigation bar

```html
<div class="navbar-demo">
  <div class="logo">
    <span class="dot" style="background:var(--purple);"></span>
    <span class="dot" style="background:var(--teal);margin-left:-4px;"></span>
    <span class="dot" style="background:var(--orange);margin-left:-4px;"></span>
    brand
  </div>
  <div class="links">
    <a href="#">Apps</a>
    <a href="#">Industries</a>
    <a href="#">Community</a>
    <a href="#">Pricing</a>
    <a href="#">Help</a>
  </div>
  <div class="right">
    <a href="#" class="signin">Sign in</a>
    <button class="btn btn-primary btn-sm">Try it free</button>
  </div>
</div>
```

```css
.navbar-demo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 24px;
  background: var(--white);
  border: 1px solid var(--gray-150);
  border-radius: var(--radius-md);
}

.navbar-demo .logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  color: var(--ink);
  font-size: 1.1rem;
}

.navbar-demo .logo .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.navbar-demo .links {
  display: flex;
  gap: 26px;
}

.navbar-demo .links a {
  color: var(--ink-soft);
  text-decoration: none;
  font-size: .88rem;
  font-weight: 500;
}

.navbar-demo .right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.navbar-demo .signin {
  font-size: .88rem;
  font-weight: 600;
  color: var(--ink-soft);
  text-decoration: none;
}
```

---

## 17. Toggle switch

```html
<div class="toggle" onclick="this.classList.toggle('on')">
  <div class="track"></div>
  <div class="label">Imagine without it</div>
</div>
```

```css
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle .track {
  width: 42px;
  height: 24px;
  background: var(--gray-300);
  border-radius: var(--radius-pill);
  position: relative;
  transition: background .2s;
}

.toggle .track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.25);
}

.toggle.on .track { background: var(--teal); }
.toggle.on .track::after { transform: translateX(18px); }

.toggle .label {
  font-size: .85rem;
  color: var(--ink-soft);
  font-weight: 500;
}
```

---

## 18. Doodle accents

```html
<div class="doodle-row">
  <svg class="doodle" width="90" height="60" viewBox="0 0 90 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <path d="M6 8 C 40 6, 60 20, 70 46"/>
    <path d="M58 40 L70 46 L66 32"/>
  </svg>
  <svg class="doodle" width="40" height="40" viewBox="0 0 40 40" fill="var(--orange)">
    <path d="M20 2 L23 15 L36 18 L23 21 L20 34 L17 21 L4 18 L17 15 Z"/>
  </svg>
  <svg class="doodle" width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <path d="M4 34 C 20 34, 30 10, 54 6"/>
    <path d="M44 4 L54 6 L48 16"/>
  </svg>
</div>
```

```css
.doodle-row {
  display: flex;
  gap: 40px;
  align-items: center;
  flex-wrap: wrap;
}

.doodle {
  color: var(--purple);
}
```

---

## 19. Footer

```html
<div class="footer-demo">
  <div class="cols">
    <div><h5>Community</h5><a href="#">Tutorials</a><a href="#">Documentation</a></div>
    <div><h5>Services</h5><a href="#">Hosting</a><a href="#">Support</a></div>
    <div><h5>About us</h5><a href="#">Our company</a><a href="#">Brand assets</a></div>
  </div>
  <div class="brand">brand</div>
</div>
```

```css
.footer-demo {
  background: var(--footer-bg);
  color: #fff;
  border-radius: var(--radius-lg);
  padding: 40px 32px;
}

.footer-demo .cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 24px;
  margin-bottom: 28px;
}

.footer-demo h5 {
  font-size: .85rem;
  margin: 0 0 12px;
  color: #fff;
}

.footer-demo a {
  display: block;
  color: #A9A9BB;
  text-decoration: none;
  font-size: .82rem;
  margin-bottom: 8px;
}

.footer-demo .brand {
  text-align: center;
  font-weight: 800;
  letter-spacing: .5px;
  opacity: .85;
}
```

---

## 20. Small interaction helpers

```js
function copyBlock(btn) {
  const pre = btn.parentElement.querySelector('pre');
  navigator.clipboard.writeText(pre.textContent);
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = original, 1000);
}

function activateNodeInfo(stepTitle, stepRuleText) {
  const logBox = document.getElementById('flowLog');
  logBox.innerHTML = `<span style="font-weight:700;color:var(--purple);">${stepTitle}:</span> <span style="color:var(--ink-soft);">${stepRuleText}</span>`;
  logBox.style.borderColor = 'var(--purple)';
  logBox.style.background = 'var(--purple-tint)';
  setTimeout(() => {
    logBox.style.borderColor = 'var(--gray-150)';
    logBox.style.background = 'var(--white)';
  }, 3000);
}
```

---

## 21. Final usage guidance

- Follow this document exactly for the hackathon UI.
- Keep spacing, color use, typography, and component patterns consistent.
- Use the same design language across landing pages, dashboards, cards, forms, and modals.
- Keep the experience friendly and polished, not overly corporate.
- When in doubt, use the nearest existing component pattern from this document instead of inventing a new one.
