# Windows 11 Desktop Emulator

[![CI](https://github.com/wangjun1974/vibe-coding/actions/workflows/ci.yml/badge.svg)](https://github.com/wangjun1974/vibe-coding/actions/workflows/ci.yml)
[![Deploy](https://github.com/wangjun1974/vibe-coding/actions/workflows/deploy.yml/badge.svg)](https://github.com/wangjun1974/vibe-coding/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Windows 11 desktop environment emulator built as a React single-page application. Features a functional windowed OS with draggable/resizable windows, a taskbar, start menu, and multiple built-in apps.

**[Live Demo](https://wangjun1974.github.io/vibe-coding/)**

## Features

- Draggable and resizable windows with 8-direction handles
- Taskbar with pinned apps, open window indicators, system tray, and live clock
- Start menu
- Desktop with wallpaper cycling, icons, and right-click context menu
- Dark mode support
- Window state persistence

## Built-in Apps

| App | Description |
|-----|-------------|
| Calculator | Standard calculator |
| Notepad | Plain text editor |
| WordPad | Rich text editor with formatting toolbar |
| Terminal | Command-line interface |
| File Explorer | File browser |
| Browser | Web browser |
| Settings | System settings (theme, wallpaper) |
| Minesweeper | Classic minesweeper game |
| Mario | Mario game |

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm) with the included `.nvmrc`)

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

### Run with Docker

```bash
docker build -t win11 .
docker run -p 8080:80 win11
```

Open http://localhost:8080 in your browser.

## Tech Stack

- [React 19](https://react.dev/) — UI framework
- [TypeScript 6](https://www.typescriptlang.org/) — Type safety
- [Vite 8](https://vite.dev/) — Build tool and dev server
- [Zustand](https://zustand.docs.pmnd.rs/) — State management

## Architecture

```
win11/src/
├── appRegistry.ts          # Central app registry (metadata, components, defaults)
├── store/
│   ├── windowStore.ts      # Window state (position, size, focus, z-index)
│   └── themeStore.ts       # Theme state (dark mode)
├── components/
│   ├── Window.tsx           # Drag/resize logic, 8-direction handles
│   ├── Desktop.tsx          # Wallpaper, icons, context menu
│   ├── Taskbar.tsx          # Pinned apps, system tray, clock
│   ├── StartMenu.tsx        # Start menu overlay
│   └── apps/                # Self-contained app components
├── App.tsx                  # Root: composes Desktop, Windows, Taskbar
└── types.ts                 # WindowState interface
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute, including a step-by-step guide for adding a new app.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE)
