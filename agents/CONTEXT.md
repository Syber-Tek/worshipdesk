# Church Presenter - Agent Handoff & Progress Context

## Project Overview
**Church Presenter** is an offline-first desktop application designed primarily for churches in Ghana to present Bible verses, hymns, church songs, custom lyrics, and service playlists during live church services and OBS/vMix workflows.

---

## Tech Stack & Architecture

- **Desktop Framework:** Electron (v34+)
- **Build & Packaging Tool:** Official Electron Forge with Vite plugin (`@electron-forge/plugin-vite`)
- **Frontend UI Framework:** React 19 + Vite 5
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with Cluely-inspired Design Tokens (`#0B0C0E` canvas, `#151619` panel, `#1C1D21` surface, `#D4A94A` gold accent, `#E5484D` live red)
- **Icons:** React Icons (`react-icons/fa6`)
- **Offline Storage:** SQLite (`better-sqlite3`)
- **Multi-Monitor:** Electron Screen API (`screen.getAllDisplays()`, `screen.getPrimaryDisplay()`)
- **IPC Architecture:** 
  - `src/main.js` -> Electron Main Process (Node.js backend, system APIs, Screen API, Native Dialogs, SQLite database)
  - `src/db.js` -> Local SQLite database helper (`bibles`, `books`, `verses`, `hymns` tables + batch transaction importer)
  - `src/preload.js` -> ContextBridge Security Boundary (`nodeIntegration: false`, `contextIsolation: true`)
  - `src/renderer.jsx` / `src/App.jsx` -> React UI Renderer Process

---

## Project File Structure

```text
church-presenter/
├── agents/                       <-- AI Agent handoff & context documentation
│   ├── CONTEXT.md
│   └── Project.md                <-- Official UI & Architecture Stage Specification
├── forge.config.js               <-- Electron Forge desktop packager configuration
├── index.html                    <-- HTML entry mounting React root
├── sample_songs.json             <-- Sample JSON song file for testing offline imports
├── vite.main.config.mjs          <-- Vite config for Main process
├── vite.preload.config.mjs       <-- Vite config for Preload script
├── vite.renderer.config.mjs      <-- Vite config for Renderer UI + Tailwind
├── package.json
└── src/
    ├── App.jsx                   <-- Main Control & Presentation orchestrator
    ├── components/               <-- Modular React Components
    │   ├── Header.jsx            <-- Top status bar & live indicator
    │   ├── IconRail.jsx          <-- 52px left navigation rail
    │   ├── CurrentNextRail.jsx   <-- 230px preview rail & transport controls
    │   ├── PresentationOutputWindow.jsx <-- Standalone window component
    │   ├── modals/
    │   │   └── AddItemModal.jsx  <-- Add service playlist item dialog
    │   └── views/
    │       ├── HomeView.jsx      <-- Dashboard overview
    │       ├── BibleView.jsx     <-- Scripture lookup & reader
    │       ├── SongsView.jsx     <-- Hymns & lyrics library
    │       ├── PlanView.jsx      <-- Service order playlist planner
    │       └── SettingsView.jsx  <-- Sectioned settings screen
    ├── db.js                     <-- SQLite database initialization, Bible & Hymn schema
    ├── renderer.jsx              <-- React entry point
    ├── index.css                 <-- Tailwind CSS v4 imports & Cluely design tokens
    ├── main.js                   <-- Electron Main process & IPC handlers
    └── preload.js                <-- ContextBridge IPC exposure script
```

---

## Essential Commands

| Action | Command |
| :--- | :--- |
| **Start Development Server** | `npm start` |
| **Package Desktop App (`.exe`)** | `npm run package` |
| **Make Distributable Installers** | `npm run make` |

---

## Completed Specification Stages (`agents/Project.md`)

- [x] **Stage 1 — Application Shell:** Constructed persistent Control window frame:
  - Top Bar: Service title (*"Sunday Service Order"*), display connection status (*"Single Display"* or *"Projector Connected"*), and pulse-animated **LIVE ON-AIR** indicator (using dedicated `#E5484D` red).
  - Icon Rail (52px width): Home, Bible, Songs, Plan, Settings with active-state left accent border (`#D4A94A`).
  - Main Content Area: Fluid routed panel for active views.
  - Current/Next Rail (230px width): Persistent preview cards for Current Live Output (red border when on-air) and Next Queued item (amber indicator), plus transport action buttons (`Clear Text`, `Black Screen`, `Go Live`).

- [x] **Stage 2 — Bible Interface:** Implemented scripture search & reader interface:
  - Translation / Book / Chapter selector chips (`KJV`, `NKJV`, `NIV`, `Genesis`, `Psalms`, `John`).
  - Search Input: Auto-focused on screen entry (`useRef`).
  - 2-Line Result List: Displays verse reference & text with hover, selected state, and full **Up/Down Arrow Key Navigation** (`onKeyDown`).
  - Selected Passage Panel: Displays selected scripture card with **Stage as Next**, **Add to Service Playlist**, and **Present Live Now** action buttons.

- [x] **Stage 3 — Presentation Controls:** Implemented live & staged transport controls:
  - Current Panel: Glow-animated red border (`#E5484D`) when live on-air.
  - Next Panel: Surface card with amber dot (`#D4A94A`) showing staged slide.
  - Transport Controls Bar: Equal-width action buttons (`Prev`, `Next`, `Clear`, `Black`, `Present`, `Stop`).

- [x] **Stage 5 — Presentation Output Window:** Created dedicated Presentation Output Window component (`PresentationOutputWindow`) in `src/App.jsx`, wired multi-window instantiation via `src/main.js` (`?window=presentation`), exposed safe IPC listeners (`sendLiveSlide`, `onPresentationUpdate`), and verified clean production packaging.

- [x] **Stage 6 — Settings:** Implemented sectioned Settings screen with sub-sidebar navigation:
  - **10 Dedicated Sub-sections:** General, Appearance, Display & Projector, Presentation, Bible & Scripture, Content & Storage, Languages, Keyboard Shortcuts, Backup & Export, and About App.
  - **Dark & Light Mode Toggle:** Full app-wide dynamic theme switching across canvas, sidebars, panels, preview rails, cards, inputs, and controls (Dark Obsidian `#0B0C0E` vs Light Clean `#F4F5F7`) with quick top header ☀️/🌙 toggle and Stage 6 theme mode card.
  - **Display Settings:** Fully wired to system screen detection (`window.api.getDisplays()`), displaying Control Display details, Presentation Display status (Connected/Single Display), detected monitors list, and auto-fullscreen toggles.
  - **Native Content Import:** Direct button to select JSON song files and trigger SQLite batch imports via native open dialog.
  - **Verified Build:** Verified clean compilation via `npm run package` for `x64 on win32`.

---

## 🛠️ Build Notes & Visual Studio C++ Setup Instructions

### Current Setup (Disk-Space Saved Mode)
- In `forge.config.js`, `rebuildConfig` is configured to bypass `node-gyp` C++ compilation during `npm start` & `npm run package`:
  ```javascript
  rebuildConfig: {
    onlyModules: [],
  }
  ```
- This allows running and packaging the app without requiring Microsoft Visual Studio (~4.5 GB to 7 GB).

### How to Switch back to Microsoft Visual Studio C++ Compilation Later
When disk space is available and you wish to compile native modules from C++ source code:

1. **Install Visual Studio Build Tools 2022**:
   - Download **[Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/)**.
   - During setup, check: **"Desktop development with C++"**.
2. **Re-enable Electron Forge Rebuild**:
   - In `forge.config.js`, revert `rebuildConfig` to default:
     ```javascript
     rebuildConfig: {},
     ```
3. **Run Rebuild**:
   ```cmd
   npx electron-rebuild -f -w better-sqlite3
   ```

