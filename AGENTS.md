# AGENTS.md

This file provides guidance to AI coding agents (e.g. OpenAI Codex) when working with code in this repository.

## Project

A Windows 11 desktop emulator built as a React SPA. The app lives in `win11/`.

## Commands

All commands run from `win11/`:

```bash
npm run dev      # start dev server (Vite)
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint
npm run preview  # preview production build
```

## Architecture

The app simulates a windowed OS environment:

- **`src/store/windowStore.ts`** — Zustand store; single source of truth for all open windows (position, size, focus, z-index, minimize/maximize state). All window operations go through here.
- **`src/types.ts`** — `WindowState` and `AppDef` interfaces.
- **`src/App.tsx`** — Root; renders `Desktop`, a `Window` per open window, optional `StartMenu`, and `Taskbar`.
- **`src/components/Window.tsx`** — Drag/resize logic (8-direction handles via mouse event delegation). Maps `win.app` string → app component via a local `APPS` record.
- **`src/components/Desktop.tsx`** — Wallpaper cycling, desktop icons, right-click context menu.
- **`src/components/Taskbar.tsx`** — Center-aligned pinned apps + open window indicators, live clock, system tray.
- **`src/components/apps/`** — Self-contained app components: `Calculator`, `Notepad`, `Terminal`, `Explorer`, `Settings`, `Browser`.

## Adding a New App

1. Create `src/components/apps/MyApp.tsx`.
2. Add size defaults to `APP_DEFAULTS` in `windowStore.ts`.
3. Register the component in the `APPS` map in `Window.tsx`.
4. Add an entry to `PINNED_APPS` in `Taskbar.tsx` and/or `DESKTOP_ICONS` in `Desktop.tsx`.
