import type { FC } from 'react';
import Calculator from './components/apps/Calculator';
import Notepad from './components/apps/Notepad';
import Terminal from './components/apps/Terminal';
import Explorer from './components/apps/Explorer';
import Settings from './components/apps/Settings';
import Browser from './components/apps/Browser';
import Minesweeper from './components/apps/Minesweeper';
import Mario from './components/apps/Mario';
import WordPad from './components/apps/WordPad';

export interface AppWindowDefaults {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

export interface AppDefinition extends AppWindowDefaults {
  id: string;
  name: string;
  icon: string;
  component: FC;
}

export interface AppMeta {
  id: string;
  name: string;
  icon: string;
}

export interface DesktopShortcut {
  id: string;
  appId: string;
  name?: string;
  icon?: string;
}

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: 'explorer',
    name: '文件资源管理器',
    icon: '📁',
    component: Explorer,
    width: 800,
    height: 520,
    minWidth: 500,
    minHeight: 360,
  },
  {
    id: 'browser',
    name: '浏览器',
    icon: '🌐',
    component: Browser,
    width: 900,
    height: 600,
    minWidth: 500,
    minHeight: 400,
  },
  {
    id: 'notepad',
    name: '记事本',
    icon: '📝',
    component: Notepad,
    width: 600,
    height: 480,
    minWidth: 400,
    minHeight: 300,
  },
  {
    id: 'terminal',
    name: '终端',
    icon: '⬛',
    component: Terminal,
    width: 680,
    height: 420,
    minWidth: 400,
    minHeight: 280,
  },
  {
    id: 'calculator',
    name: '计算器',
    icon: '🔢',
    component: Calculator,
    width: 320,
    height: 500,
    minWidth: 280,
    minHeight: 420,
  },
  {
    id: 'settings',
    name: '设置',
    icon: '⚙️',
    component: Settings,
    width: 760,
    height: 540,
    minWidth: 560,
    minHeight: 400,
  },
  {
    id: 'minesweeper',
    name: '扫雷',
    icon: '💣',
    component: Minesweeper,
    width: 320,
    height: 440,
    minWidth: 300,
    minHeight: 420,
  },
  {
    id: 'mario',
    name: '超级马里奥',
    icon: '🍄',
    component: Mario,
    width: 800,
    height: 560,
    minWidth: 640,
    minHeight: 500,
  },
  {
    id: 'wordpad',
    name: '写字板',
    icon: '📝',
    component: WordPad,
    width: 780,
    height: 560,
    minWidth: 480,
    minHeight: 360,
  },
];

export const PINNED_APPS: AppMeta[] = APP_REGISTRY.map(({ id, name, icon }) => ({
  id,
  name,
  icon,
}));

export const APP_COMPONENTS: Record<string, FC> = Object.fromEntries(
  APP_REGISTRY.map((app) => [app.id, app.component])
);

export const APP_DEFAULTS: Record<string, AppWindowDefaults> = Object.fromEntries(
  APP_REGISTRY.map(({ id, width, height, minWidth, minHeight }) => [
    id,
    { width, height, minWidth, minHeight },
  ])
);

export const DESKTOP_SHORTCUTS: DesktopShortcut[] = [
  { id: 'computer', appId: 'explorer', name: '此电脑', icon: '🖥️' },
  { id: 'recycle', appId: 'explorer', name: '回收站', icon: '🗑️' },
  { id: 'explorer', appId: 'explorer' },
  { id: 'notepad', appId: 'notepad' },
];

export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((app) => app.id === id);
}
