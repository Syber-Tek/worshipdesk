# WorshipDesk Feature Roadmap & ProPresenter Parity Plan

This document tracks the major ProPresenter-tier features to build into WorshipDesk step-by-step.

---

## 🎯 ProPresenter Parity Feature Roadmap

### [x] Feature 1: 🎤 Stage Display / Confidence Monitor (3rd Window Output)
- **Description**: Dedicated output window for singers & pastors on stage.
- **Key Capabilities**:
  - Displays **Current Projected Text** in large, easy-to-read typography.
  - Displays **Next Slide Preview Box** so worship leaders know upcoming lyrics ahead of time.
  - Live clock (HH:MM:SS) & Live-On-Air status indicator.
  - Accessible via `window=stage` window launcher in Header / Display Settings.

---

### [ ] Feature 2: 📖 Dual-Translation Scripture Display (Bilingual Services)
- **Description**: Render two Bible translations simultaneously on the projector for bilingual services.
- **Key Capabilities**:
  - Primary Bible Translation (e.g. English NIV / NKJV) + Secondary Bible Translation (e.g. Twi Asante / Ewe 2020).
  - Flexible layout options: **Side-by-Side Dual Columns** or **Stacked Top / Bottom**.
  - Formatted dual attribution line (e.g. `— JOHN 3:16 (NIV / ASANTE TWI) —`).

---

### [ ] Feature 3: 📺 Lower-Thirds Mode for Live Streaming / OBS / ATEM Switchers
- **Description**: Transform projector output into clean broadcast lower-third overlays for streaming.
- **Key Capabilities**:
  - Output Mode Toggle: **Fullscreen Centered** (Default) vs **Lower-Third Banner Bar**.
  - Lower-Third places text cleanly inside the bottom 25% of the screen with optional semi-transparent bar.
  - Green-screen / Transparent background option for OBS, vMix, and ATEM keyers.

---

### [ ] Feature 4: 🎵 Modern Worship Songs & Chorus Structure Editor
- **Description**: Custom song builder for modern worship songs (Elevation, Bethel, Maverick City, etc.).
- **Key Capabilities**:
  - Tagged section builder (**Verse 1**, **Verse 2**, **Chorus**, **Bridge**, **Tag**, **Outro**).
  - Quick-jump section pills during live presentation for spontaneous worship leading.
  - Custom song library persistent storage in SQLite database.

---

## 🚀 Auto-Update (Over-The-Air Updates)

### [ ] Feature 5: 🔄 Automatic In-App Updates
- **Description**: Deliver new versions to users automatically over-the-air via GitHub Releases.
- **Key Capabilities**:
  - Tracks updates from the latest GitHub release and downloads in the background.
  - Prompts the user to restart & install when an update is ready (`electron-updater` + NSIS).
  - Differential downloads (`.blockmap`) so only changed bytes are fetched.
- **Status / Prerequisites**:
  - **ON HOLD** — blocked until repo is made **public** (private repos require shipping a runtime `GH_TOKEN`, which is not acceptable).
  - Once public: add `electron-updater` dependency + `publish` block in `electron-builder.yml` + autoUpdater wiring in `src/main.js`, then bump version per release.
  - The existing `make` script (`--publish never`) and workflow release job already upload `release/*` artifacts, so `latest.yml` + blockmaps will be published automatically.

---

## 🚀 Execution Order
We will implement these features one-by-one upon confirmation:
1. **Feature 1**: Stage Display / Confidence Monitor
2. **Feature 2**: Dual-Translation Scriptures
3. **Feature 3**: Lower-Thirds Mode for Streaming
4. **Feature 4**: Modern Worship Songs & Chorus Editor
5. **Feature 5**: Auto-Update (once repo is public)
