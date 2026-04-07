# Sprout — Design System & UI Documentation

---

## Brand

```
  Name      :  Sprout
  Tagline   :  Discover activities your kids will love
  Tone      :  Warm, clean, minimal — Airbnb-level polish
  Audience  :  Parents & guardians of children aged 0–16
```

---

## Color Palette

```
  ┌─────────────────────────────────────────────────────────┐
  │                    SPROUT COLOR SYSTEM                   │
  ├──────────┬──────────────┬──────────────────────────────┤
  │  Token   │  Hex         │  Usage                        │
  ├──────────┼──────────────┼──────────────────────────────┤
  │ forest   │  #1E3A1E     │  Primary CTA, headings, pins  │
  │ sage     │  #4C7A3A     │  Hover states, accents        │
  │ leaf     │  #6BA050     │  Decorative dots, highlights  │
  │ mint     │  #D4EAC8     │  Step numbers, info icons     │
  │ cream    │  #FAFAF6     │  Page background              │
  │ parchment│  #F3F1EB     │  Section backgrounds          │
  │ mist     │  #EAE8E2     │  Borders, dividers            │
  │ stone    │  #9A9590     │  Secondary text, labels       │
  │ ink      │  #1C1C1A     │  Body text                    │
  └──────────┴──────────────┴──────────────────────────────┘
```

---

## Typography

```
  Display font :  Fraunces (variable, opsz axis)
                  ─ Used for: headings, hero titles, card names, stats
                  ─ Weight: 300–600, often italic for emphasis

  Body font    :  DM Sans
                  ─ Used for: all body text, labels, buttons, inputs
                  ─ Weight: 300, 400, 500, 600

  Scale:
  ┌──────────────┬────────────────────┬──────────────────┐
  │  Name        │  Size              │  Font            │
  ├──────────────┼────────────────────┼──────────────────┤
  │  Hero title  │  clamp(48–76px)    │  Fraunces 400    │
  │  Page title  │  40px              │  Fraunces 400    │
  │  Section h2  │  clamp(32–48px)    │  Fraunces 400    │
  │  Card title  │  17px              │  Fraunces 400    │
  │  Body        │  15–16px           │  DM Sans 400     │
  │  Label       │  11–12px uppercase │  DM Sans 600     │
  │  Meta text   │  12–13px           │  DM Sans 400     │
  └──────────────┴────────────────────┴──────────────────┘
```

---

## Component Library

### Button Variants

```
  ┌──────────────────────┐  ┌──────────────────────┐
  │   [ Find activities ]│  │   [     ← Back     ] │
  │   bg: #1E3A1E        │  │   border: #1E3A1E    │
  │   text: white        │  │   text: #1E3A1E      │
  │   radius: 100px      │  │   radius: 100px      │
  │   PRIMARY            │  │   OUTLINE            │
  └──────────────────────┘  └──────────────────────┘

  ┌──────────────────────┐
  │   Sign in            │
  │   bg: transparent    │
  │   text: #1C1C1A      │
  │   hover: bg mist     │
  │   GHOST              │
  └──────────────────────┘
```

### Activity Card

```
  ┌─────────────────────────────────────────────────┐
  │ ┌──────────┐                                     │
  │ │          │  ARTS & CRAFTS          ← type tag  │
  │ │  image   │                                     │
  │ │ 110×full │  Tiny Brushstrokes Studio           │
  │ │          │                                     │
  │ │          │  📍 1.2 mi   🕐 12 min drive        │
  │ │          │                                     │
  │ └──────────┘  [Ages 4–12]  [$18 / session]      │
  └─────────────────────────────────────────────────┘
  border: #EAE8E2  radius: 22px  hover: shadow + translate-x
```

### Form Section

```
  ┌─────────────────────────────────────────────────┐
  │  ABOUT YOUR CHILD  ────────────────────────────  │
  │                                                   │
  │  CHILD'S NAME          AGE                        │
  │  ┌──────────────┐     ┌──────────────┐           │
  │  │ e.g. Emma    │     │ Select age ▾ │           │
  │  └──────────────┘     └──────────────┘           │
  │                                                   │
  └─────────────────────────────────────────────────┘
  bg: white  border: #EAE8E2  radius: 22px  p: 32px
```

### Interest Tag

```
  Unselected:                   Selected:
  ┌────────────────┐            ┌────────────────┐
  │ ⚽  Sports     │            │ ⚽  Sports     │
  │ bg: white      │    ──▶     │ bg: #1E3A1E    │
  │ border: #EAE8E2│            │ border: #1E3A1E│
  │ text: #1C1C1A  │            │ text: white    │
  └────────────────┘            └────────────────┘
  radius: 100px  padding: 9px 16px
```

---

## Page Layouts

### Landing Page

```
  ┌───────────────────────────────────────────────┐
  │  NAV  [🌱 Sprout]              [Sign in][CTA] │
  ├───────────────────────────────────────────────┤
  │                                   ░░░░░░░░░░  │
  │  · Kid-friendly, curator-approved ░  green  ░  │
  │                                   ░  blob   ░  │
  │  Discover activities              ░░░░░░░░░░  │
  │  your kids will love                          │
  │                                               │
  │  Find the perfect outing...                   │
  │                                               │
  │  ┌─────────────────────────────────────────┐  │
  │  │ 📍 Enter your city...   [Find activities]│ │
  │  └─────────────────────────────────────────┘  │
  │                                               │
  │  12k+        480         Free                 │
  │  Activities  Cities      Always               │
  ├───────────────────────────────────────────────┤
  │  BROWSE BY INTEREST                           │
  │  [⚽ Sports] [🎨 Arts] [🔬 Science] ...       │
  ├───────────────────────────────────────────────┤
  │  HOW IT WORKS                                 │
  │  ①Tell us  ②Browse  ③Save  ④Go have fun       │
  ├───────────────────────────────────────────────┤
  │  FOOTER                                       │
  └───────────────────────────────────────────────┘
```

### Search Page

```
  ┌───────────────────────────────────────────────┐
  │  NAV                                          │
  ├───────────────────────────────────────────────┤
  │  Find an activity                             │
  │  Tell us about your child...                  │
  │                                               │
  │  ┌─────────────────────────────────────────┐  │
  │  │  ABOUT YOUR CHILD ─────────────────     │  │
  │  │  [Name input]          [Age select]     │  │
  │  └─────────────────────────────────────────┘  │
  │  ┌─────────────────────────────────────────┐  │
  │  │  INTERESTS ─────────────────────────    │  │
  │  │  [⚽][🎨][🔬][🌲][🎵][🐾][🍳][🏊]...  │  │
  │  └─────────────────────────────────────────┘  │
  │  ┌─────────────────────────────────────────┐  │
  │  │  LOCATION & DISTANCE ───────────────    │  │
  │  │  [Location input]                       │  │
  │  │  ●────────────────── 10 miles           │  │
  │  └─────────────────────────────────────────┘  │
  │  ┌─────────────────────────────────────────┐  │
  │  │  TRAVEL TIME ───────────────────────    │  │
  │  │  ●────────────────── 30 min             │  │
  │  └─────────────────────────────────────────┘  │
  │  ┌─────────────────────────────────────────┐  │
  │  │  BUDGET ────────────────────────────    │  │
  │  │  [🆓 Free] [💚 Low] [💛 Medium] [✨Any] │  │
  │  └─────────────────────────────────────────┘  │
  │                          [← Back] [Search →]  │
  └───────────────────────────────────────────────┘
```

### Results Page

```
  ┌───────────────────────────────────────────────┐
  │  NAV                          [← Edit search] │
  ├────────────────────┬──────────────────────────┤
  │  14 activities     │                          │
  │  near San Francisco│     ░░░░░░░░░░░░░░░░░    │
  │  [Sort ▾]          │    ░                  ░  │
  │                    │   ░   [Tiny Brush..]   ░ │
  │  ┌───────────────┐ │  ░       [Exploratorium]░ │
  │  │ [img] Arts    │ │  ░  [Golden Gate Trail] ░ │
  │  │  Tiny Brush.. │ │   ░    [Aqua Cubs]    ░  │
  │  │  📍1.2mi 🕐12m│ │    ░                ░   │
  │  │  [Age 4-12]   │ │     ░░░░░░░░░░░░░░░░    │
  │  └───────────────┘ │                          │
  │  ┌───────────────┐ │    📍 San Francisco, CA  │
  │  │ [img] Outdoors│ │                          │
  │  │  Golden Gate  │ │                          │
  │  └───────────────┘ │                          │
  │        ...         │      MAP PANEL           │
  │                    │   (hidden on mobile)     │
  └────────────────────┴──────────────────────────┘
  Left panel: 420px fixed  │  Right panel: flex-1
```

### Activity Detail Page

```
  ┌───────────────────────────────────────────────┐
  │  [← Back]                        [♡ Save]    │
  │                                               │
  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
  │  ░                  HERO IMAGE              ░  │
  │  ░                                          ░  │
  │  ░  ARTS & CRAFTS                           ░  │
  │  ░  Tiny Brushstrokes Studio                ░  │
  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
  ├──────────────────────────┬────────────────────┤
  │                          │  ┌──────────────┐  │
  │  ABOUT THIS ACTIVITY     │  │ 🎂 Age 4-12  │  │
  │  Lorem ipsum dolor sit   │  │ 💰 $18/sess  │  │
  │  amet consectetur...     │  │ ⏱️  90 min   │  │
  │                          │  │ 📅 Sat & Sun │  │
  │  TAGS                    │  │ 📍 1.2 miles │  │
  │  [Arts] [Painting] [...]  │  └──────────────┘  │
  │                          │                    │
  │  WHAT TO BRING           │  ┌──────────────┐  │
  │  All materials provided. │  │  MINI MAP    │  │
  │                          │  └──────────────┘  │
  │  ┌──────────────────────┐│  243 Clement St    │
  │  │ 🌱 Save activities   ││  [🗺️ Get directions]│
  │  │    Sign up free →    ││                    │
  │  └──────────────────────┘│                    │
  └──────────────────────────┴────────────────────┘
  Main: flex-1  │  Sidebar: 300px  (stacks on mobile)
```

---

## Responsive Breakpoints

```
  ┌────────────────────────────────────────────────────┐
  │  Mobile  (<768px)                                   │
  │  ─ Single column layout throughout                  │
  │  ─ Navbar: compact, labels hidden                   │
  │  ─ Results: list only (map hidden)                  │
  │  ─ Search form: single column fields                │
  │  ─ Budget pills: 2×2 grid                          │
  ├────────────────────────────────────────────────────┤
  │  Tablet / Desktop  (≥768px)  [md breakpoint]        │
  │  ─ Results: split panel (list left, map right)      │
  │  ─ Activity detail: two-column (content + sidebar)  │
  │  ─ Search form: two-column field rows               │
  │  ─ Budget pills: 4-column row                      │
  └────────────────────────────────────────────────────┘
```

---

## Spacing & Radius System

```
  Border radius:
    sm  →  8px   (badges, small elements)
    md  →  14px  (inputs, info rows)
    lg  →  22px  (cards, form sections)
    xl  →  32px  (hero search bar)
    pill→  100px (buttons, tags)

  Shadows:
    sm  →  0 1px  4px rgba(30,58,30,.06)
    md  →  0 4px  20px rgba(30,58,30,.10)
    lg  →  0 12px 48px rgba(30,58,30,.14)
```
