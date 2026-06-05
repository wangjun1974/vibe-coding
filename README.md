# Windows 11 Desktop Emulator

A Windows 11 desktop environment emulator built as a React single-page application. Features a functional windowed OS with draggable/resizable windows, a taskbar, start menu, and multiple built-in apps.

## Built-in Apps

- **Calculator** — Standard calculator
- **Notepad** — Plain text editor
- **WordPad** — Rich text editor
- **Terminal** — Command-line interface
- **File Explorer** — File browser
- **Browser** — Web browser
- **Settings** — System settings
- **Minesweeper** — Classic minesweeper game
- **Mario** — Mario game

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
cd win11
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Other Commands

```bash
npm run build    # TypeScript compile + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## How It Works

The app simulates a windowed OS environment:

- **App Registry** (`src/appRegistry.ts`) — Central registry for all apps: metadata, components, window defaults, and pinned/desktop shortcuts.
- **Window Store** (`src/store/windowStore.ts`) — Zustand store managing all open windows (position, size, focus, z-index, minimize/maximize).
- **Window Component** (`src/components/Window.tsx`) — Drag and resize logic with 8-direction handles.
- **Desktop** (`src/components/Desktop.tsx`) — Wallpaper cycling, desktop icons, right-click context menu.
- **Taskbar** (`src/components/Taskbar.tsx`) — Pinned apps, open window indicators, system tray, live clock.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute, including how to add a new app.

## License

[MIT](LICENSE)
