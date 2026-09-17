# WorshipDesk (Church Presenter)

An offline-first, desktop church presentation application built for churches in Ghana and worldwide to deliver seamless scripture projections, hymns display, and multi-monitor OBS/vMix live streaming workflows without requiring an active internet connection.

---

## 🌟 Key Features

- **📖 Multi-Translation Bible Lookup:** Search and switch between **NIV**, **NKJV**, **KJV**, and **Twi** (Asante/Fante) Bibles offline.
- **🎵 Songs & Hymns Library:** Offline SQLite hymn library with batch JSON song collection importer.
- **📋 Sunday Service Planner:** Drag/move order of service playlist items with instant status indicators.
- **🖥️ Multi-Display & Projector Output:** Independent dual-window presentation renderer for church projectors and live-streaming software.
- **🌙 Obsidian Dark / ☀️ Daylight Light / 🖥️ System Theme Sync:** Fully adaptive theme switching designed with Cluely design tokens.
- **📁 Automated Bible Importer:** Drop `.sql` dumps or `Twi` book `.txt` files directly into `bibles/` for automatic startup database seeding.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Launch

```bash
# Clone repository
git clone https://github.com/Syber-Tek/worshipdesk.git
cd worshipdesk

# Start local development server
npm start
```

### Packaging Desktop Executable (.exe)

```bash
npm run package
```

---

## 🛠️ Built With

- **Electron** + **Vite** + **React 19**
- **Tailwind CSS v4** + **React Icons**
- **better-sqlite3** (SQLite WAL Mode)

---

## 📄 License

Distributed under the MIT License.
