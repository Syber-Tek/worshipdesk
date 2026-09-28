# WorshipDesk Feature Roadmap & ProPresenter Parity Plan

This document tracks the major ProPresenter-tier features to build into WorshipDesk step-by-step.

Candidate features that are *not* yet scheduled live in
[`FEATURE_BACKLOG.md`](./FEATURE_BACKLOG.md) — the short list worth building now,
plus the options deliberately being left alone.

---

## 🎯 ProPresenter Parity Feature Roadmap

### [x] Feature 1: 🎤 Stage Display / Confidence Monitor (3rd Window Output)
- **Description**: Dedicated output window for singers & pastors on stage.
- **Delivered**:
  - Displays **Current Projected Text** in large, easy-to-read typography.
  - Displays **Next Slide Preview Box** so worship leaders know upcoming lyrics ahead of time.
  - Live clock (HH:MM:SS) & Live-On-Air status indicator.
  - Accessible via `window=stage` window launcher in Header / Display Settings.
- **Note**: intentionally stays dark in both app themes — it is a confidence monitor read from a distance on stage, not app chrome.

---

### [x] Feature 2: 📖 Dual-Translation Scripture Display (Bilingual Services)
- **Description**: Render two Bible translations simultaneously on the projector for bilingual services.
- **Delivered**:
  - Primary Bible Translation (e.g. English NIV / NKJV) + Parallel translation (e.g. Twi Asante / Ewe) as **side-by-side bordered panels**.
  - Formatted dual attribution line, with a configurable position (`top` / `bottom` / `bottom-right`).
  - **Parallel Present Navigation**: Present Next/Prev carries the secondary translation across slides.
  - **Book-locked pairing**: the parallel pane always resolves the *same* book as the primary, in either direction (English `John` <-> Twi `Yohane`). Resolution is by canonical position, not by book-name string, so localized names cannot drift.
  - 10 installed translations: KJV, NIV, NKJV, GNT, Ewe, and 5 Twi (Asante, Akuapem, DC, Kronkron, Revised).
- **Still open**: the stacked top/bottom layout variant (only side-by-side ships today).

---

### [ ] Feature 3: 📺 Lower-Thirds Mode for Live Streaming / OBS / ATEM Switchers
- **Description**: Transform projector output into clean broadcast lower-third overlays for streaming.
- **Key Capabilities**:
  - Output Mode Toggle: **Fullscreen Centered** (Default) vs **Lower-Third Banner Bar**.
  - Lower-Third places text cleanly inside the bottom 25% of the screen with optional semi-transparent bar.
  - Green-screen / Transparent background option for OBS, vMix, and ATEM keyers.
- **Status**: not started. The projector window already has a per-slide `attributionPosition` control and a transparent-capable canvas, which is the natural hook for a lower-third mode.

---

### [ ] Feature 4: 🎵 Modern Worship Songs & Chorus Structure Editor
- **Description**: Custom song builder for modern worship songs (Elevation, Bethel, Maverick City, etc.).
- **Key Capabilities**:
  - Tagged section builder (**Verse 1**, **Verse 2**, **Chorus**, **Bridge**, **Tag**, **Outro**).
  - Quick-jump section pills during live presentation for spontaneous worship leading.
  - Custom song library persistent storage in SQLite database.
- **Status**: not started. The `.sng` / `.txt` / `.json` song importer and the SQLite song table already exist, so this is an authoring UI over a working store.

---

## 🚀 Auto-Update (Over-The-Air Updates)

### [x] Feature 5: 🔄 Automatic In-App Updates
- **Description**: Deliver new versions to users automatically over-the-air via GitHub Releases.
- **Delivered**:
  - **Automatic checks are opt-in** for installed builds: switch on, then check 45 seconds after launch and every 6 hours. Off by default, so the app contacts nothing until you ask it to.
  - Persistent **Automatic update checks** switch in `Settings -> About & Updates`; the preference is stored per user and survives restarts.
  - Manual **Check for Updates** remains available, plus download and install controls.
  - `autoDownload` is off, so nothing is fetched or installed without the user asking. A downloaded update is applied on the next normal quit, so it can never interrupt a service.
  - Differential downloads via `.blockmap` metadata published next to the installers.
  - Served from the **public** `worshipdesk-releases` repo — the source repo stays private, so no runtime `GH_TOKEN` is shipped.
- **Known limits**:
  - The check only runs in packaged builds; `npm start` never phones home.
  - macOS builds are unsigned, so the app cannot replace itself there — the button opens the releases page instead.
  - The network path only completes once a release with valid `latest.yml` is published.

---

## Interface & Layout Work (Completed)

Not part of the numbered features above, but shipped:

- **Settings consolidated to 10 tabs** — Backup & Export now lives inside Content & Backup instead of taking its own tab.
- **Container-query responsive layouts** across Settings, the Service Planner, and the Dashboard. Because the icon and live rails already consume ~320px, breakpoints are measured against the content column rather than the viewport.
- **Dashboard metric cards hold a 2x2 grid**, dropping to a single column only when the window is genuinely too small (they previously went 4-across on a normal window).
- **Flat app shell** — all shell/workspace corner rounding removed.
- **Themed projector STANDBY** and theme-aware scrollbars in both light and dark mode.
- **Dynamic version** in General settings, read from the app rather than hardcoded.

---

## 🚀 Execution Order
Remaining work, in the order we intend to tackle it:
1. **Feature 3**: Lower-Thirds Mode for Streaming
2. **Feature 4**: Modern Worship Songs & Chorus Editor
3. **Feature 2 (remainder)**: stacked top/bottom bilingual layout

**Maintenance**, not features: the `68a9baa` commit still carries Dashboard changes that were later reverted; splitting it out of branch history is pending.
