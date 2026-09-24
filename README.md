# WorshipDesk (Church Presenter)

An offline-first, high-performance desktop presentation application built for churches in Ghana and worldwide to deliver seamless scripture projections, hymns display, bilingual scripture dual-views, and multi-monitor OBS/vMix live streaming workflows without requiring an active internet connection.

---

## 📥 Direct Downloads & Executables

You can link your website's **Download** buttons directly to the latest GitHub release assets:

- **📦 Standalone Portable Archive (`.zip`):** [Download WorshipDesk Portable ZIP](https://github.com/Syber-Tek/worshipdesk/releases/latest/download/WorshipDesk-Windows-x64.zip)
- **⚡ Windows Executable Installer (`.exe`):** [Download WorshipDesk Setup (.exe)](https://github.com/Syber-Tek/worshipdesk/releases/latest/download/WorshipDesk-Setup.exe)

---

## 🌟 Comprehensive Feature Set

### 📖 1. Multi-Translation & Dual-Scripture Display (Bilingual Services)
- **Dual-Translation Parallel Mode:** Select a **Primary** translation (e.g. English NIV) and a **Parallel** translation (e.g. Twi Asante / Ewe) to divide presentation screens into 2 distinct side-by-side bordered panels for bilingual services.
- **Offline Bible Library:** Pre-seeded offline SQLite database with **NIV**, **NKJV**, **KJV**, **GNT**, **Ewe**, and **5 Twi Translations** (Asante, Akuapem, DC, Kronkron, Revised).
- **Fast Verse Search:** Instant keyword and scripture reference search (e.g., `John 3:16`, `Nyankopɔn`, `light`, `shepherd`).

### 🎵 2. Presbyterian & Methodist Hymnal Library
- **Subfolder-Based Category Engine:** Categories automatically load directly from your `hymns/` directory subfolders (e.g., `Presby Hymns -Eng`, `Presby Hymns -Twi`, `Methodist Hymns -Eng`, `Methodist Hymns -Twi`, `Presby Liturgy`, `Methodist Liturgy`).
- **Hymn Stanza Deck Engine:** Hymns automatically divide into stanza slides with live stanza position chips (`1 / 5`).
- **Fast Excerpt Search:** Search 855+ hymns by number (e.g., `120`), title, or lyric keywords.

### 🖥️ 3. Multi-Display & Stage Confidence Monitor
- **Multi-Monitor Projection:** Independent presentation output window routed to secondary church projectors, TVs, or OBS/vMix capture windows.
- **Parallel Present Navigation:** Present Next/Prev keeps the parallel (secondary) translation attached, so bilingual dual-view slides stream verse-by-verse seamlessly.
- **Clear Output:** The **Clear** control empties the live projected slide and the staged next slide at once, ready to present a fresh item.
- **Stage Display / Confidence Monitor:** Dedicated 3rd screen view (`Stage Display`) for singers, choir, and pastors featuring:
  - Large projected slide text.
  - Live Digital Clock (`HH:MM:SS AM/PM`).
  - Upcoming **Next Slide Preview** container.
  - Live status indicator badges (`LIVE ON-AIR` / `STANDBY`).
- **Header & Settings ON/OFF Toggle:** Enable or disable stage output on demand with live state synchronization across windows.

### 🎥 4. Dynamic Motion Video & Backgrounds
- **Bundled Motion Loops:** Pre-loaded motion video backgrounds (`Golden Particles`, `Aurora Lights`, `Galaxy Stars`, `Cinematic Clouds`, `Earth Night`).
- **Custom Video & Image File Picker:** Select custom local `.mp4`, `.webm`, `.jpg`, `.png` files for live presentation backgrounds.
- **Adaptive Theme Engine:** Switch between Obsidian Dark, Daylight Light, Custom Image, and Motion Video themes with Cluely design tokens.

### 📋 5. Sunday Service Planner & File Management
- **Order of Service Playlist:** Drag, move up/down, and manage playlist items with status indicators (`live`, `next`, `pending`).
- **Service Plan Files (`.worship` / `.json`):** Save and open complete service plans directly to disk.
- **Recent Plans History:** Instant access to 10 recently opened service plans from the sidebar.

### 📁 6. Automated Offline Data Importers
- **Song Importer (.sng / .txt / .json):** Auto-scans `hymns/` directory subfolders on startup and maps subfolders directly to categories.
- **Bible Data Importers:** Drop `.sql` dumps, `.xml` files (Zefania, OSIS, USFX, Generic XML), or `Twi` book `.txt` files directly into `bibles/` for automatic offline seeding.

---

## 🚀 Development & Packaging

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Local Run
```bash
# Clone repository
git clone https://github.com/Syber-Tek/worshipdesk.git
cd worshipdesk

# Install dependencies
npm install

# Start local desktop app
npm start
```

### Packaging Windows Executable (.exe)
```bash
# Generate standalone packaged desktop application inside out/
npm run package
```

### GitHub Actions Automated Release (.exe & .zip)
Every time a git release tag (e.g. `v1.1.0`) is pushed to GitHub, the `.github/workflows/build-release.yml` pipeline automatically builds the Windows `.exe` installer and `.zip` archive and publishes them to GitHub Releases.

---

## 🛠️ Built With

- **Electron 34** + **Vite 5** + **React 19**
- **Tailwind CSS v4** + **React Icons** + **React Iconly**
- **better-sqlite3** (SQLite WAL Mode)
- **Sonner** Toast Notification System

---

## 📄 License

Distributed under the MIT License.
