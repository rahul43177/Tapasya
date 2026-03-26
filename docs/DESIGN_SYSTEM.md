# TAPASYA - DESIGN SYSTEM
## Digital Temple Aesthetic

**Last Updated**: March 26, 2026
**Design Philosophy**: Minimalist editorial meets sacred geometry
**Reference**: Google Stitch UI designs

---

## 🎨 VISUAL IDENTITY

### Brand Concept
**"Digital Temple"** — A space of focused devotion and skill mastery, inspired by ancient wisdom and modern minimalism.

**Core Pillars**:
1. **Sacred Geometry**: Yantra patterns, mandalas, circular forms (decorative only)
2. **Editorial Typography**: Large, bold headlines with serif italics
3. **Sharp Minimalism**: Zero border radius everywhere, clean lines, extreme whitespace
4. **Depth through Darkness**: Dark surfaces with warm copper/gold accents

**Visual Tone**:
- Calm and focused (not flashy or distracting)
- Premium and intentional (nothing random)
- Grounded and immersive
- Warm accents (copper/gold, not cold blue tech UI)

---

## 🎯 CORE DESIGN PRINCIPLES

### 1. Simplicity Rule
> **Remove anything that does not directly support focus.**

- Avoid unnecessary decorations
- Use whitespace intentionally
- Prioritize readability over style
- Every element must have a purpose

### 2. Consistency Rule
> **Same patterns everywhere, always.**

- Same spacing system everywhere (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Same typography roles everywhere (Newsreader headlines, Inter body, Space Mono numbers)
- Same component patterns everywhere
- Same color usage everywhere

### 3. Border Radius Rule
> **Zero border radius. Always. No exceptions.**

- All buttons, cards, inputs, modals: `border-radius: 0px`
- Sharp corners create the Digital Temple aesthetic
- This is non-negotiable

### 4. Typography Hierarchy Rule
> **Clear roles for each font family.**

- **Headlines**: Newsreader serif (often italic)
- **Body text**: Inter sans-serif
- **Numbers/Timers**: Space Mono monospace
- Never mix these roles

### 5. Color Usage Rule
> **Primary actions = Copper. Secondary = Gold. Everything else = Dark surfaces.**

- Background: Always dark (#0e0e0e to #353434)
- Primary CTA: Always copper (#E05C00)
- Accents: Gold (#e9c349) sparingly
- Avoid using gradients excessively

---

## 🎨 COLOR PALETTE

### Primary Colors

```css
/* Warm Copper/Orange (Primary Brand Color) */
--brand-copper: #E05C00;        /* TAPASYA logo color */
--primary: #ffb694;             /* Lighter peachy tone */
--primary-container: #ef6712;   /* Vibrant orange */
--on-primary: #571f00;          /* Dark brown for text on primary */

/* Sacred Gold (Secondary/Accent) */
--secondary: #e9c349;           /* Hammered gold */
--secondary-container: #af8d11; /* Darker gold */
--on-secondary: #3c2f00;        /* Text on gold */
```

### Surface Colors (Dark Theme)

```css
/* Background Hierarchy (Darkest to Lightest) */
--surface-container-lowest: #0e0e0e;  /* The void, deepest black */
--background: #141313;                /* Main background */
--surface-dim: #141313;               /* Same as background */
--surface: #141313;                   /* Default surface */
--surface-container-low: #1c1b1b;     /* Slightly elevated */
--surface-container: #201f1f;         /* Cards, panels */
--surface-container-high: #2a2a2a;    /* Hover states */
--surface-container-highest: #353434; /* Borders, dividers */
--surface-bright: #3a3939;            /* Brightest surface */
```

### Text Colors

```css
/* On-Surface (Text on dark backgrounds) */
--on-surface: #e5e2e1;          /* Primary text */
--on-surface-variant: #e1c0b2;  /* Secondary text, subdued */
--on-background: #e5e2e1;       /* Same as on-surface */

/* Outline/Border Colors */
--outline: #a88a7e;             /* Standard borders */
--outline-variant: #594237;     /* Subtle borders, tree lines */
```

### Tertiary/Neutral Colors

```css
--tertiary: #c6c6c7;           /* Cool gray */
--tertiary-container: #909192; /* Medium gray */
--on-tertiary: #2f3132;        /* Text on gray */
```

### Error Colors

```css
--error: #ffb4ab;              /* Error messages */
--error-container: #93000a;    /* Error backgrounds */
--on-error: #690005;           /* Text on error */
```

---

## ✍️ TYPOGRAPHY

### Font Families

```css
/* Headline Font - Serif, Editorial */
font-family: 'Newsreader', serif;
/* Use for: Page titles, section headers, emphasized text */
/* Style: Often italic, large sizes, tracking-tight */

/* Body Font - Clean Sans-Serif */
font-family: 'Inter', sans-serif;
/* Use for: Body text, descriptions, UI labels */

/* Mono Font - For Numbers/Time */
font-family: 'Space Mono', monospace;
/* Use for: Timer, stats, hours, progress numbers */

/* ❌ DO NOT use additional fonts (Cormorant, etc.) */
/* ONLY use: Newsreader, Inter, Space Mono */
```

### Letter Spacing Rules

**⚠️ IMPORTANT**: Use letter spacing (tracking) sparingly

```css
/* Headlines - Tight spacing for impact */
.headline { letter-spacing: -0.02em; } /* tracking-tighter */

/* Labels - Wide spacing for emphasis */
.label-uppercase { letter-spacing: 0.4em; } /* tracking-widest */

/* Body text - NO letter spacing */
.body { letter-spacing: normal; }

/* Mono text - Tight for alignment */
.mono-timer { letter-spacing: -0.05em; }
```

**Usage Guide**:
- Headlines: Tight tracking (-0.02em to -0.01em)
- Labels: Wide tracking (0.15em to 0.4em) - use sparingly!
- Body text: Normal (no tracking)
- Avoid `tracking-widest` everywhere - use only for small labels

### Type Scale

**Standard font sizes** for consistent typography:

| Type | Size (px) | Size (rem) | Usage |
|------|-----------|------------|--------|
| Hero | 64–96px | 4–6rem | Landing page headlines, dashboard hero |
| Section Title | 32–48px | 2–3rem | Page section headers |
| Card Title | 18–24px | 1.125–1.5rem | Card headers, skill names |
| Body | 14–16px | 0.875–1rem | Main body text, descriptions |
| Label | 10–12px | 0.625–0.75rem | Small labels, metadata |

**Example Usage**:
```css
.hero-headline { font-size: 6rem; }      /* 96px */
.section-title { font-size: 3rem; }      /* 48px */
.card-title { font-size: 1.5rem; }       /* 24px */
.body-text { font-size: 1rem; }          /* 16px */
.label-small { font-size: 0.625rem; }    /* 10px */
```

### Headline Styles

```css
/* Hero Headline (Dashboard, Landing) */
.headline-hero {
  font-family: 'Newsreader', serif;
  font-size: 6rem; /* 96px */
  font-weight: 800;
  line-height: 0.9;
  tracking: -0.02em; /* tracking-tighter */
}

/* Section Headline */
.headline-section {
  font-family: 'Newsreader', serif;
  font-size: 3rem; /* 48px */
  font-weight: 700;
  font-style: italic;
  tracking: -0.01em;
}

/* Card Headline */
.headline-card {
  font-family: 'Newsreader', serif;
  font-size: 2rem; /* 32px */
  font-weight: 600;
  font-style: italic;
}
```

### Body Styles

```css
/* Large Body (Descriptions) */
.body-large {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem; /* 18px */
  font-weight: 300;
  line-height: 1.7;
}

/* Body Default */
.body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
}

/* Small Body */
.body-small {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
}
```

### Label Styles

```css
/* Uppercase Labels (Common Pattern) */
.label-uppercase {
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem; /* 10px */
  font-weight: 700;
  letter-spacing: 0.4em; /* tracking-widest */
  text-transform: uppercase;
  opacity: 0.6;
}

/* Button Labels */
.label-button {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; /* 12px */
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

### Mono Styles (Timer, Stats)

```css
/* Timer Display */
.mono-timer {
  font-family: 'Space Mono', monospace;
  font-size: 12rem; /* 192px */
  font-weight: 700;
  line-height: 1;
  tracking: -0.05em;
}

/* Stat Numbers */
.mono-stat {
  font-family: 'Space Mono', monospace;
  font-size: 3rem; /* 48px */
  font-weight: 400;
}
```

---

## 📐 LAYOUT SYSTEM

### Border Radius

```css
/* NO ROUNDED CORNERS - Sharp, architectural aesthetic */
border-radius: 0px;

/* Only exception: Pill shapes for badges */
border-radius: 9999px; /* Full rounds only */
```

### Spacing Scale

**⚠️ CRITICAL**: Use ONLY these values for spacing. Never use arbitrary values.

```css
/* Based on 4px unit - THESE ARE THE ONLY SPACING VALUES ALLOWED */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

**Standard Spacing Values**:
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

**Usage Examples**:
- Padding inside cards: 24px (space-6) or 32px (space-8)
- Gap between components: 16px (space-4) or 24px (space-6)
- Section margins: 48px (space-12) or 64px (space-16)
- Icon-to-text spacing: 8px (space-2) or 12px (space-3)

### Grid System

```css
/* Main Dashboard Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem; /* 32px */
}

/* Bento/Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem; /* 48px */
}
```

---

## 🎭 COMPONENT PATTERNS

### Navigation

#### Top Nav
```html
<nav class="bg-[#141313]/60 backdrop-blur-md fixed top-0 w-full z-50 px-8 py-6">
  <div class="text-2xl font-bold tracking-[0.2em] text-[#E05C00] uppercase">
    TAPASYA
  </div>
  <div class="flex gap-12">
    <a class="text-[#E05C00] border-b-2 border-[#E05C00] pb-1">Dashboard</a>
    <a class="text-[#E1C0B2] opacity-70 hover:text-[#FFB694]">Skills</a>
    <a class="text-[#E1C0B2] opacity-70 hover:text-[#FFB694]">Squad</a>
  </div>
</nav>
```

**Navigation Items**:
- **Dashboard** → Main dashboard with focus timer
- **Skills** → Skills list and management
- **Squad** → Community and leaderboards

#### Side Nav
```html
<aside class="fixed left-0 h-screen w-72 bg-[#0E0E0E] border-r border-[#353434]">
  <div class="px-8 py-12">
    <h3 class="font-headline italic text-lg text-[#E05C00]">Profile</h3>
    <p class="text-[10px] tracking-widest uppercase opacity-50">Level 4 • 570 hrs</p>
  </div>
  <nav>
    <a class="flex items-center gap-4 py-3 border-l-4 border-[#E05C00] text-[#E05C00]">
      <span class="material-symbols-outlined">timer</span>
      <span class="font-headline italic">Focus Timer</span>
    </a>
  </nav>
  <button class="mt-auto w-full py-4 border border-secondary text-secondary">
    Start Session
  </button>
</aside>
```

---

### Buttons

#### Primary CTA (Start Focus)
```html
<button class="py-5 px-8 bg-gradient-to-r from-primary to-primary-container
               text-on-primary font-bold uppercase tracking-widest text-xs
               hover:scale-[1.02] transition-transform duration-500">
  Enter the Flow
</button>
```

#### Secondary Button
```html
<button class="py-4 border border-secondary text-secondary
               font-headline italic hover:bg-secondary
               hover:text-on-secondary transition-all duration-500">
  Start Session
</button>
```

#### Inverted Button
```html
<button class="py-3 px-6 bg-on-surface text-surface font-sans font-semibold
               uppercase tracking-widest text-xs
               hover:opacity-90 transition-opacity">
  Inverted
</button>
```

#### Outlined Button
```html
<button class="py-3 px-6 bg-transparent border border-on-surface text-on-surface
               font-sans font-semibold uppercase tracking-widest text-xs
               hover:bg-on-surface hover:text-surface transition-all duration-200">
  Outlined
</button>
```

#### Ghost Button
```html
<button class="py-3 text-on-surface-variant opacity-70
               hover:opacity-100 hover:text-primary transition-colors">
  View Details
</button>
```

#### Action Icon Button (Small)
```html
<!-- Small square icon-only action button -->
<button class="w-9 h-9 flex items-center justify-center
               bg-surface-container border border-surface-container-highest
               text-on-surface-variant hover:text-primary
               hover:border-primary transition-colors">
  <span class="material-symbols-outlined text-base">edit</span>
</button>
```

---

### Search Input

```html
<div class="flex items-center gap-3 bg-surface-container-high px-4 py-3
            border border-surface-container-highest
            focus-within:border-outline transition-colors">
  <span class="material-symbols-outlined text-on-surface-variant text-lg">search</span>
  <input
    type="text"
    placeholder="Search"
    class="bg-transparent text-on-surface placeholder:text-on-surface-variant
           font-sans text-sm flex-1 outline-none"
  />
</div>
```

---

### Bottom Navigation (Mobile)

```html
<!-- Mobile only — hidden on lg+ -->
<nav class="fixed bottom-0 left-0 right-0 lg:hidden
            bg-surface-container-lowest border-t border-surface-container-highest
            flex items-center justify-around px-4 py-3 z-50">
  <button class="flex flex-col items-center gap-1 text-primary">
    <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">home</span>
    <span class="text-[10px] uppercase tracking-widest font-sans">Home</span>
  </button>
  <button class="flex flex-col items-center gap-1 text-on-surface-variant opacity-60">
    <span class="material-symbols-outlined text-xl">search</span>
    <span class="text-[10px] uppercase tracking-widest font-sans">Search</span>
  </button>
  <button class="flex flex-col items-center gap-1 text-on-surface-variant opacity-60">
    <span class="material-symbols-outlined text-xl">person</span>
    <span class="text-[10px] uppercase tracking-widest font-sans">Profile</span>
  </button>
</nav>
```

---

### Cards

#### Standard Card
```html
<div class="bg-surface-container-lowest p-10 border-l-4 border-secondary-container">
  <h3 class="font-headline text-3xl italic mb-2">Card Title</h3>
  <p class="text-xs uppercase tracking-widest text-on-surface-variant opacity-60">
    Subtitle
  </p>
  <!-- Card content -->
</div>
```

#### Hover Card (Interactive)
```html
<div class="bg-surface relative overflow-hidden group
            border border-secondary/20 p-10
            hover:bg-gradient-to-br hover:from-primary/10
            transition-opacity duration-1000">
  <!-- Card content -->
</div>
```

---

### Progress Indicators

#### Progress Bar
```html
<div class="h-[2px] w-full bg-surface-container-highest relative">
  <div class="absolute h-full bg-secondary w-[75%]"></div>
</div>
```

#### Progress Dots
```html
<div class="flex gap-1">
  <div class="w-2 h-2 bg-primary"></div>
  <div class="w-2 h-2 bg-primary"></div>
  <div class="w-2 h-2 bg-primary"></div>
  <div class="w-2 h-2 bg-surface-container-highest"></div>
  <div class="w-2 h-2 bg-surface-container-highest"></div>
</div>
```

#### Circular Progress (Yantra Style)
```html
<svg class="-rotate-90" viewBox="0 0 100 100">
  <!-- Background ring -->
  <circle cx="50" cy="50" r="45" fill="none"
          stroke="#353434" stroke-width="0.5" />
  <!-- Progress ring with glow -->
  <circle cx="50" cy="50" r="45" fill="none"
          stroke="#e9c349" stroke-width="1.5"
          stroke-dasharray="283" stroke-dashoffset="70"
          class="drop-shadow-[0_0_15px_rgba(233,195,73,0.3)]" />
</svg>
```

---

### Decorative Elements

#### Yantra Watermark
```css
.yantra-watermark {
  background-image: url("data:image/svg+xml,..."); /* Sacred geometry SVG */
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.03;
}
```

#### Mandala Divider
```html
<div class="w-full h-32 flex items-center justify-center opacity-10">
  <svg class="fill-none stroke-primary stroke-[0.5]"
       width="120" height="120" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="35" />
    <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M82 18 L18 82" />
    <rect x="30" y="30" width="40" height="40"
          transform="rotate(45 50 50)" />
  </svg>
</div>
```

#### Corner Anchors
```html
<!-- Top-left corner -->
<div class="absolute top-8 left-8 flex flex-col gap-1 opacity-20">
  <div class="w-8 h-[1px] bg-secondary"></div>
  <div class="w-[1px] h-8 bg-secondary"></div>
</div>
```

---

## 🌊 ANIMATIONS & TRANSITIONS

### Timing Functions

```css
/* Default smooth transition */
transition: all 500ms ease-in-out;

/* Slow, dramatic */
transition: all 1000ms ease-in-out;

/* Quick feedback */
transition: all 200ms ease-out;
```

### Common Animations

```css
/* Hover scale */
hover:scale-[1.02] transition-transform duration-500

/* Fade in */
opacity-0 group-hover:opacity-100 transition-opacity duration-1000

/* Glow effect */
.heatmap-glow {
  box-shadow: 0 0 15px rgba(239, 103, 18, 0.3);
}

/* Gradient background sweep */
.gradient-sweep {
  background: linear-gradient(to right, transparent, rgba(239,103,18,0.1));
  animation: sweep 3s ease-in-out infinite;
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Tailwind defaults */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Layout Adjustments

```css
/* Side nav hidden on mobile */
.side-nav { @apply hidden lg:flex; }

/* Grid stack on mobile */
.dashboard-grid {
  @apply grid-cols-1 lg:grid-cols-12;
}

/* Text size responsive */
.headline-hero {
  @apply text-6xl md:text-8xl lg:text-9xl;
}
```

---

## 🎯 DESIGN TOKENS (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#ffb694',
        'primary-container': '#ef6712',
        'secondary': '#e9c349',
        'secondary-container': '#af8d11',
        'background': '#141313',
        'surface': '#141313',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353434',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#e1c0b2',
        'outline': '#a88a7e',
        'outline-variant': '#594237',
      },
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        ritual: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px',
      },
      letterSpacing: {
        'tight': '-0.01em',
        'tighter': '-0.02em',
        'widest': '0.4em',
      },
    },
  },
}
```

---

## 🎨 MATERIAL SYMBOLS (Icons)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

### Icon Style
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  color: #af8d11; /* Gold by default */
}

/* Filled icons for active states */
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1;
}
```

### Common Icons
- `self_improvement` → Meditation/Focus
- `menu_book` → Skills/Knowledge
- `groups` → Squad/Community
- `fireplace` → Start ritual/session
- `notifications` → Alerts
- `account_circle` → Profile
- `auto_awesome` → Achievements
- `lock` → Locked content
- `check_circle` → Completed

---

## 📝 CONTENT VOICE & TONE

### Vocabulary

**Use** (Standard but Elevated):
- Dashboard
- Skills
- Squad / Community
- Session / Focus Session
- Profile
- Mastery Heatmap
- Deep Work
- Focus Timer
- Start Session
- Level (Beginner, Competent, etc.)

### Tone
- **Focused**: Direct and purposeful
- **Minimalist**: Say more with less
- **Motivational**: Encouraging but not pushy
- **Premium**: Elevated language without being pretentious

---

## ✅ DESIGN CHECKLIST

When designing new screens:

- [ ] Use only colors from the defined palette (copper/gold/dark surfaces)
- [ ] Apply 0px border-radius (SHARP CORNERS EVERYWHERE)
- [ ] Use Newsreader italic for headlines
- [ ] Use Space Mono for all numbers and timers
- [ ] Use Inter for body text
- [ ] Include Material Symbols icons (outlined style)
- [ ] Implement dark surface hierarchy correctly
- [ ] Add subtle yantra/mandala decorative elements (optional)
- [ ] Use uppercase tracking-widest for labels (sparingly)
- [ ] Include subtle animations (300ms-500ms)
- [ ] Maintain intentional whitespace
- [ ] Test on dark background (#141313)
- [ ] Ensure text contrast minimum 0.6 opacity

---

**END OF DESIGN SYSTEM**

Reference this document for all UI implementation.
