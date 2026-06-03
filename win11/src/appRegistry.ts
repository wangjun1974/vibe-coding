export interface AppMeta {
  id: string;
  name: string;
  icon: string;
}

export const PINNED_APPS: AppMeta[] = [
  { id: 'explorer', name: '文件资源管理器', icon: '📁' },
  { id: 'browser', name: '浏览器', icon: '🌐' },
  { id: 'notepad', name: '记事本', icon: '📝' },
  { id: 'terminal', name: '终端', icon: '⬛' },
  { id: 'calculator', name: '计算器', icon: '🔢' },
  { id: 'settings', name: '设置', icon: '⚙️' },
  { id: 'minesweeper', name: '扫雷', icon: '💣' },
  { id: 'mario', name: '超级马里奥', icon: '🍄' },
  { id: 'wordpad', name: '写字板', icon: '📝' },
];
