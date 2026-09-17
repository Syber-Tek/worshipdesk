# Church Presenter — UI Implementation Prompt

Paste this into your terminal coding agent (inside the Church Presenter project).

---

## Context

You are working inside an existing **Church Presenter** project: an offline-first church
presentation desktop app built with **Electron + React + Vite + JavaScript + Tailwind CSS +
SQLite**. It has a **Control window** (used by the media operator) and a separate
**Presentation window** (shown on the projector/second display to the congregation).

A UI/UX design pass has already been done. Your job in this session is **implementation only**,
following the design direction and stages below. Do not redesign, do not introduce new
frameworks, and do not install dependencies beyond what's already in the project unless you
explain why one is genuinely required and I approve it first.

## Ground rules (follow these throughout, every stage)

1. **Inspect before editing.** Before writing any code, look at the current project structure,
   existing components, routing, and Tailwind config. Tell me what you found and how it maps to
   the plan below before making changes.
2. **State your intent before each change.** For every file you're about to create or modify,
   say which file and why, in one line, before doing it.
3. **Small, incremental changes.** Don't generate the whole app at once. Work stage by stage (see
   below) and stop after each one for me to review.
4. **No unnecessary rewrites.** If something already works, don't restructure it just to match a
   preference. Extend and reuse.
5. **No unjustified dependencies.** Use what's already installed. If you think a new package is
   truly needed, explain the tradeoff (what it buys us vs. rolling it ourselves) and wait for a
   yes before installing.
6. **Keep Electron and React concerns separate.** UI work in this session should stay in the
   renderer/React layer. Don't touch main-process, IPC, or database code unless a stage
   explicitly requires it for the UI to function (e.g. wiring a display-detection stub).
7. **Use realistic placeholder/mock data** wherever real backend functionality (Bible database,
   song library, SQLite queries) doesn't exist yet. Mock data should look like real content (real
   verse text, real hymn titles) so the UI can be judged properly — not "Lorem ipsum" or
   "Item 1, Item 2."
8. **Explain architectural decisions before making them** — e.g. how you're structuring shared
   state between Control and Presentation windows, or how you're organizing components. A
   sentence or two is enough. I want to understand what's being built, not just receive it.
9. **Responsive across desktop resolutions**, with proper hover / active / focus / disabled
   states and keyboard-friendly interaction (tab order, Enter/Space to activate, arrow-key
   navigation through result lists where relevant).
10. **Stop after each stage.** Don't proceed to the next stage until I've looked at the result.

## Design direction to follow

- **Dark-first**, near-black canvas with layered neutral surfaces (page / panel / surface /
  raised) — no gradients, no glassmorphism, minimal shadows, moderate (6–8px) corner radius.
- **One restrained accent color** (warm gold, `#D4A94A`) used only for selection and primary
  actions. A **separate, dedicated red** (`#E5484D`) used *only* for the live/on-air state —
  never reused for anything else, including destructive actions.
- Compact, information-dense layout: 8px spacing base grid, 1px hairline borders, no card
  shadows.
- Three-pane control window shell that stays consistent across screens: icon rail (52px) →
  main content (fluid) → current/next rail (200–240px).
- Presentation output window: huge text (32px+), generous margins, pure black or themed
  background, minimal chrome, no dashboard styling of any kind.
- Full token reference (colors, sizes, spacing, radii) is in the design system below — implement
  it as Tailwind config, not ad hoc inline values, so screens stay consistent as you build them.

### Tailwind tokens to add to `tailwind.config.js`

```js
theme: {
  extend: {
    colors: {
      bg: '#0B0C0E',
      panel: '#151619',
      surface: '#1C1D21',
      raised: '#24262B',
      border: '#2A2C31',
      'border-strong': '#3A3B40',
      text: {
        primary: '#EDEDEE',
        secondary: '#9B9CA3',
        muted: '#6B6C73',
      },
      accent: '#D4A94A',
      live: '#E5484D',
      success: '#6FCF97',
    },
    fontSize: {
      xs: '11px', sm: '12px', base: '13px', md: '14px',
      display: ['40px', { lineHeight: '1.5' }],
      'display-lg': ['56px', { lineHeight: '1.45' }],
    },
    fontWeight: { normal: 400, medium: 500, semibold: 600 },
    spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
    borderRadius: { DEFAULT: '6px', md: '8px', lg: '10px' },
  },
},
```

---

## Stage 1 — Application shell

Build the persistent Control window frame:
- Top bar: session/service name, display connection status indicator, live/on-air indicator.
- Icon rail (Home, Bible, Songs, Plan, Settings) with active-state styling (accent left border,
  no filled background).
- Main content area as a routed/swappable panel (use whatever routing approach the project
  already has, or a simple state-based switch if none exists — tell me which and why).
- Current/next rail, persistent across all screens, showing placeholder current/next content.
- Wire basic navigation between icon rail items and empty/placeholder screens for each section.

Stop here. I'll review the shell before you build into it.

## Stage 2 — Bible interface

- Translation / book / chapter selector chips.
- Search input (keyboard-focused on screen entry).
- Result list (verse reference + preview text, 2-line rows, hover and selected states, arrow-key
  navigable).
- Selected passage panel with Preview / Add to service / Present actions.
- Use realistic mock scripture data (a handful of real, correctly quoted short public-domain-era
  verse references and their real text is fine for UI purposes).

Stop here.

## Stage 3 — Presentation controls

- Current panel (red-bordered when live) and Next panel (neutral, amber dot when something is
  staged), matching the current/next rail from Stage 1 but now fully functional against
  placeholder state.
- Transport controls: Previous, Next, Black, Clear, Present, Stop — equal-width row, clear
  disabled states when nothing is queued.
- Wire these to update the shared current/next state (mock/local state is fine for now; note
  where real IPC to the Presentation window would eventually hook in, but don't build it yet
  unless I ask).

Stop here.

## Stage 4 — Service planner

- Reorderable service item list (drag handle, status dot: pending / next / live).
- Add item flow (can be a simple placeholder modal/dropdown for now).
- Selecting an item loads it into current/next.
- Empty state for a new service.

Stop here.

## Stage 5 — Presentation output window

- Separate fullscreen window/component, visually independent from the Control window (no shared
  chrome).
- Large, centered text block with safe margins, plus a reference/attribution line below.
- Support at least a black/clear state (blank screen) and a themed background option, even if
  only one theme is implemented for now.
- Confirm this renders correctly as a genuinely separate window in the Electron multi-window
  setup, not just a styled div inside the Control window.

Stop here.

## Stage 6 — Settings

- General, Appearance, Display, Presentation, Bible, Content, Languages, Keyboard shortcuts,
  Backup, About — sectioned settings screen (sidebar or tabs, your call, tell me which and why).
- Display settings section should show Control Display / Presentation Display / Detected
  Displays / Fullscreen toggle, using placeholder detection data if real display APIs aren't
  wired up yet.

Stop here.

---

Work through the stages in order. After each stage, summarize what you built, which files you
touched, and any tradeoffs or open questions — then wait for me before continuing.