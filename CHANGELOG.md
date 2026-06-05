# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-06-05

### Added
- Dark mode theme system and window state persistence
- GitHub Pages deployment
- CI workflow (lint + build on PR)
- LICENSE, README, CONTRIBUTING, issue/PR templates
- Docker support

### Changed
- Consolidated app metadata into single `APP_REGISTRY`
- Split monolithic CSS into per-component files
- Extracted inline styles from Minesweeper and WordPad

### Fixed
- Unified app registry so StartMenu lists all pinned apps
- Removed unused React imports causing build errors
- Removed duplicate CSS reset between index.css and App.css

## [0.0.1] - 2025-06-01

### Added
- Initial Windows 11 desktop emulator
- Core windowed OS: drag, resize, minimize, maximize, focus management
- Taskbar with pinned apps, system tray, and live clock
- Start menu
- Desktop with wallpaper cycling, icons, and right-click context menu
- Built-in apps: Calculator, Notepad, Terminal, File Explorer, Browser, Settings
- Mario and Minesweeper games
- WordPad rich text editor
