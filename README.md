# WorshipDesk (Church Presenter)

An offline-first, high-performance desktop presentation application built for churches in Ghana and worldwide to deliver seamless scripture projections, hymns display, bilingual scripture dual-views, and multi-monitor OBS/vMix live streaming workflows without requiring an active internet connection.

---

## 📥 Direct Downloads & Executables

Downloads are published to the **public** [`worshipdesk-releases`](https://github.com/Syber-Tek/worshipdesk-releases) repository, so no GitHub account is needed to grab a build. (The source repository is private; only the release feed is public.)

- **Latest release page (recommended):** [Download WorshipDesk](https://github.com/Syber-Tek/worshipdesk-releases/releases/latest)

Point a website **Download** button at that page. Direct `/releases/latest/download/<filename>` links are deliberately not hardcoded here, because every asset name carries the version and would break on the next release. If you need direct asset links, build them from these patterns:

| Platform | Asset name pattern | Example (v1.1.0) |
| --- | --- | --- |
| Windows installer | `WorshipDesk-Setup-<version>.exe` | `WorshipDesk-Setup-1.1.0.exe` |
| Windows portable | `WorshipDesk-<version>.zip` | `WorshipDesk-1.1.0.zip` |
| macOS (Apple Silicon) | `WorshipDesk-<version>-arm64.dmg` | `WorshipDesk-1.1.0-arm64.dmg` |
| macOS (Intel) | `WorshipDesk-<version>-x64.dmg` | `WorshipDesk-1.1.0-x64.dmg` |
| Linux | `WorshipDesk-<version>-x86_64.AppImage` / `.deb` / `.rpm` | `WorshipDesk-1.1.0-x86_64.AppImage` |

### In-App Updates

WorshipDesk updates itself from **Settings → About & Updates**.

- **Checks run automatically** in installed builds: 45 seconds after launch, then every 6 hours. Turn this off with the **Automatic update checks** toggle on the same page — the choice is remembered between restarts.
- **Downloads and installs stay manual.** Nothing is fetched or applied without you asking, and a downloaded update is applied the next time you quit normally, so an update can never interrupt a service in progress.
- Automatic checks are skipped in development (`npm start`); only installed builds phone home.
- Updates come from the public [`worshipdesk-releases`](https://github.com/Syber-Tek/worshipdesk-releases) repository, so the app is fully functional offline once installed.
- **Windows** installs and applies updates in place.
- **macOS** builds are not code-signed, so macOS will not let the app replace itself. On macOS the button opens the releases page instead — download the `.dmg` for your Mac (Apple Silicon = `-arm64`, Intel = `-x64`) and drag it over the old copy.

---

## 🌟 Comprehensive Feature Set

### 📖 1. Multi-Translation & Dual-Scripture Display (Bilingual Services)
- **Dual-Translation Parallel Mode:** Select a **Primary** translation (e.g. English NIV) and a **Parallel** translation (e.g. Twi Asante / Ewe) to divide presentation screens into 2 distinct side-by-side bordered panels for bilingual services.
- **Book-Locked Pairing:** The parallel pane always stays on the *same* book as the primary, in either direction — English `John` pairs with Twi `Yohane`, Twi `Nnwom` pairs with English `Psalms`. Books are matched by canonical position rather than by name, so localized names cannot drift apart.
- **Dual Attribution Line:** The projector prints a formatted reference with a configurable position (top, bottom, or bottom-right).
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
- **Theme-Aware Output:** The projector STANDBY screen and scrollbars follow the app theme in both light and dark mode. The Stage Display stays dark by design, since it is read from a distance on stage.

### 🎥 4. Dynamic Motion Video & Backgrounds
- **Bundled Motion Loops:** Pre-loaded motion video backgrounds (`Golden Particles`, `Aurora Lights`, `Galaxy Stars`, `Cinematic Clouds`, `Earth Night`).
- **Custom Video & Image File Picker:** Select custom local `.mp4`, `.webm`, `.jpg`, `.png` files for live presentation backgrounds.
- **Adaptive Theme Engine:** Switch between Obsidian Dark, Daylight Light, Custom Image, and Motion Video themes with Cluely design tokens.

### 📋 5. Sunday Service Planner & File Management
- **Order of Service Playlist:** Drag, move up/down, and manage playlist items with status indicators (`live`, `next`, `pending`).
- **Service Plan Files (`.worship` / `.json`):** Save and open complete service plans directly to disk.
- **Recent Plans History:** Instant access to 10 recently opened service plans from the sidebar.
- **Responsive Throughout:** The Dashboard, Service Planner, and Settings all lay themselves out against the space actually available (measured with container queries, since the icon and live rails already take ~320px), rather than against the raw window width. The Dashboard's four metric cards hold a 2x2 grid and only collapse to a single column when the window is genuinely too small.
- **Consolidated Settings:** Ten tabs cover every setting. Backup & Export lives inside **Content & Backup** rather than taking a tab of its own.

### 📁 6. Automated Offline Data Importers
- **Song Importer (.sng / .txt / .json):** Auto-scans the bundled `hymns/` library on startup and maps subfolders directly to categories.
- **Bible Data Importers:** Drop `.sql` dumps, `.xml` files (Zefania, OSIS, USFX, Generic XML), or `Twi` book `.txt` files for automatic offline seeding.

> **Where do I put my own Bible / song files?**
> The bundled `bibles/` and `hymns/` folders ship *inside* the app and are read-only,
> so your own files go in the app data folder instead:
> - **Windows:** `%APPDATA%\WorshipDesk\` (`C:\Users\<you>\AppData\Roaming\WorshipDesk\`)
> - **macOS:** `~/Library/Application Support/WorshipDesk/`
> - **Linux:** `~/.config/WorshipDesk/`
>
> Drop songs into `hymns/<Category>/` and Bibles into `bibles/` (XML files go in
> `bibles/xml/`). Both the bundled library and your folder are scanned on every
> start, so a "Rescan" picks up anything you added.

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

> If local packaging fails with `Could not find any Visual Studio installation to use`,
> that is a native rebuild of `better-sqlite3` failing, not a config error. Build with
> `npm run package -- --config.npmRebuild=false` to skip the rebuild, and do not commit
> `npmRebuild: false` to `electron-builder.yml` — CI builds the native module properly.

### GitHub Actions Automated Release (.exe, .dmg, .deb, .rpm, .AppImage)
Every time a release tag (e.g. `v1.1.0`) is pushed, the `.github/workflows/build-release.yml` pipeline builds the artifacts and publishes them to the **public** `worshipdesk-releases` repo, which is also the auto-update feed. Windows publishes the NSIS installer plus a portable zip; macOS publishes separate `-arm64` and `-x64` DMGs so both architectures can coexist.

### AI Agent Tooling (`opencode.json`)
This repo ships an [opencode](https://opencode.ai) config with three dev tools:

| Tool | Kind | Purpose |
| --- | --- | --- |
| **reponova** | MCP server | Knowledge graph of this codebase (11 graph tools: search, impact, path, outline). Config in `reponova.yml`. |
| **shadcn** | MCP server | Browse/search the shadcn/ui component registry. |
| **ponytail** | opencode plugin | "Lazy senior dev" ruleset — minimal, non-over-engineered changes. |

The MCP servers are installed once outside the repo (so they never leak into the packaged app):

```bash
npm install reponova --prefix "$USERPROFILE/.config/opencode/mcp/reponova" --omit=optional
npm install shadcn   --prefix "$USERPROFILE/.config/opencode/mcp/shadcn"   --omit=optional
npm install @reponova/lang-javascript \
  --prefix "$USERPROFILE/.config/opencode/mcp/reponova" --omit=optional --legacy-peer-deps
```

Then rebuild the knowledge graph after code changes:

```bash
node "$USERPROFILE/.config/opencode/mcp/reponova/node_modules/reponova/dist/cli/index.js" build
```

> `opencode.json` references these installs by absolute path, so teammates must
> adjust the two `command` paths to match their own home directory. Graph output
> lands in `reponova-out/` (git-ignored).

---

## 🛠️ Built With

- **Electron 34** + **Vite 5** + **React 19**
- **Tailwind CSS v4** + **React Icons** + **React Iconly**
- **better-sqlite3** (SQLite WAL Mode)
- **Sonner** Toast Notification System

---

## 📄 License

Distributed under the MIT License.
