import React, { useState, useCallback } from 'react';
import { useWindowStore } from '../store/windowStore';

interface ContextMenu {
  x: number;
  y: number;
}

const DESKTOP_ICONS = [
  { id: 'computer', name: '此电脑', icon: '🖥️' },
  { id: 'recycle', name: '回收站', icon: '🗑️' },
  { id: 'explorer', name: '文件资源管理器', icon: '📁' },
  { id: 'notepad', name: '记事本', icon: '📝' },
];

const WALLPAPERS = [
  'linear-gradient(135deg, #0078d4 0%, #00b0f0 40%, #50c8ff 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

export default function Desktop() {
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [wallpaper, setWallpaper] = useState(0);
  const { openWindow } = useWindowStore();

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeMenu = useCallback(() => setContextMenu(null), []);

  const handleIconDblClick = (id: string) => {
    const map: Record<string, [string, string, string]> = {
      computer: ['explorer', '此电脑', '🖥️'],
      recycle: ['explorer', '回收站', '🗑️'],
      explorer: ['explorer', '文件资源管理器', '📁'],
      notepad: ['notepad', '记事本', '📝'],
    };
    const args = map[id];
    if (args) openWindow(...args);
  };

  return (
    <div
      className="desktop"
      style={{ background: WALLPAPERS[wallpaper] }}
      onContextMenu={onContextMenu}
      onClick={closeMenu}
    >
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon) => (
          <div
            key={icon.id}
            className="desktop-icon"
            onDoubleClick={() => handleIconDblClick(icon.id)}
          >
            <span className="desktop-icon-img">{icon.icon}</span>
            <span className="desktop-icon-name">{icon.name}</span>
          </div>
        ))}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ctx-item" onClick={() => { setWallpaper((v) => (v + 1) % WALLPAPERS.length); closeMenu(); }}>
            🖼️ 更换壁纸
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item" onClick={() => { openWindow('settings', '设置', '⚙️'); closeMenu(); }}>
            ⚙️ 显示设置
          </div>
          <div className="ctx-item" onClick={() => { openWindow('settings', '个性化', '⚙️'); closeMenu(); }}>
            🎨 个性化
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item" onClick={() => { openWindow('terminal', '终端', '⬛'); closeMenu(); }}>
            ⬛ 在此处打开终端
          </div>
          <div className="ctx-item" onClick={closeMenu}>
            🔄 刷新
          </div>
        </div>
      )}
    </div>
  );
}
