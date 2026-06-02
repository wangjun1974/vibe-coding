import { create } from 'zustand';
import type { WindowState } from '../types';

let zCounter = 100;

interface WindowStore {
  windows: WindowState[];
  openWindow: (app: string, title: string, icon: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number, x: number, y: number) => void;
}

const APP_DEFAULTS: Record<string, { width: number; height: number; minWidth: number; minHeight: number }> = {
  calculator: { width: 320, height: 500, minWidth: 280, minHeight: 420 },
  notepad: { width: 600, height: 480, minWidth: 400, minHeight: 300 },
  terminal: { width: 680, height: 420, minWidth: 400, minHeight: 280 },
  explorer: { width: 800, height: 520, minWidth: 500, minHeight: 360 },
  settings: { width: 760, height: 540, minWidth: 560, minHeight: 400 },
  browser: { width: 900, height: 600, minWidth: 500, minHeight: 400 },
  minesweeper: { width: 320, height: 440, minWidth: 300, minHeight: 420 },
  mario: { width: 800, height: 560, minWidth: 640, minHeight: 500 },
  wordpad: { width: 780, height: 560, minWidth: 480, minHeight: 360 },
};

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],

  openWindow: (app, title, icon) => {
    const defaults = APP_DEFAULTS[app] || { width: 640, height: 480, minWidth: 320, minHeight: 240 };
    const id = `${app}-${Date.now()}`;
    const offset = Math.floor(Math.random() * 80);
    set((state) => ({
      windows: [
        ...state.windows.map((w) => ({ ...w, isFocused: false })),
        {
          id,
          title,
          icon,
          app,
          x: 120 + offset,
          y: 60 + offset,
          width: defaults.width,
          height: defaults.height,
          minWidth: defaults.minWidth,
          minHeight: defaults.minHeight,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          zIndex: ++zCounter,
        },
      ],
    }));
  },

  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, isMinimized: false, zIndex: ++zCounter }
          : { ...w, isFocused: false }
      ),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      ),
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height, x, y } : w
      ),
    })),
}));
