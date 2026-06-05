# Contributing

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/wangjun1974/vibe-coding.git
cd vibe-coding/win11
npm install
npm run dev
```

## Workflow

1. Fork the repository and create a branch from `main`.
2. Name your branch descriptively: `feat/my-app`, `fix/window-resize`, etc.
3. Make your changes, ensuring `npm run lint` and `npm run build` pass.
4. Open a Pull Request against `main`.

## Adding a New App

This is the most common type of contribution. Follow these three steps:

### 1. Create the component

Create `win11/src/components/apps/MyApp.tsx`:

```tsx
export default function MyApp() {
  return (
    <div style={{ padding: 16 }}>
      <h2>My App</h2>
    </div>
  );
}
```

### 2. Register the app

Add an entry to `APP_REGISTRY` in `win11/src/appRegistry.ts`:

```ts
myapp: {
  component: lazy(() => import('./components/apps/MyApp')),
  name: 'My App',
  icon: '🎯',
  pinned: true,            // show in taskbar & start menu
  defaultWidth: 600,
  defaultHeight: 400,
  minWidth: 300,
  minHeight: 200,
},
```

### 3. (Optional) Add a desktop shortcut

Add an entry to `DESKTOP_SHORTCUTS` in the same file:

```ts
{ appId: 'myapp', label: 'My App' },
```

### Checklist before submitting

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] The app opens, renders correctly, and can be closed
- [ ] Window drag, resize, minimize, and maximize all work
- [ ] No console errors

## Code Style

- TypeScript with strict mode
- Functional React components
- Keep app components self-contained in `src/components/apps/`
- Shared state goes through the Zustand window store
- No external UI libraries — use inline styles or CSS modules

## Reporting Bugs

Open an issue using the **Bug Report** template. Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS

## Suggesting Features

Open an issue using the **Feature Request** template to discuss before implementing.
