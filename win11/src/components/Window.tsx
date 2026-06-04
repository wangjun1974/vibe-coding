import React, { useRef, useCallback } from 'react';
import { APP_COMPONENTS } from '../appRegistry';
import type { WindowState } from '../types';
import { useWindowStore } from '../store/windowStore';
import './Window.css';

interface Props {
  win: WindowState;
}

export default function Window({ win }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow } =
    useWindowStore();

  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{
    startX: number; startY: number;
    startW: number; startH: number;
    startWinX: number; startWinY: number;
    dir: string;
  } | null>(null);

  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      if ((e.target as HTMLElement).closest('.win-controls')) return;
      focusWindow(win.id);
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        moveWindow(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
      };
      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [win, focusWindow, moveWindow]
  );

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, dir: string) => {
      e.stopPropagation();
      if (win.isMaximized) return;
      focusWindow(win.id);
      resizeRef.current = {
        startX: e.clientX, startY: e.clientY,
        startW: win.width, startH: win.height,
        startWinX: win.x, startWinY: win.y,
        dir,
      };

      const onMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return;
        const { startX, startY, startW, startH, startWinX, startWinY, dir } = resizeRef.current;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nw = startW, nh = startH, nx = startWinX, ny = startWinY;

        if (dir.includes('e')) nw = Math.max(win.minWidth, startW + dx);
        if (dir.includes('s')) nh = Math.max(win.minHeight, startH + dy);
        if (dir.includes('w')) { nw = Math.max(win.minWidth, startW - dx); nx = startWinX + (startW - nw); }
        if (dir.includes('n')) { nh = Math.max(win.minHeight, startH - dy); ny = startWinY + (startH - nh); }

        resizeWindow(win.id, nw, nh, nx, ny);
      };
      const onUp = () => {
        resizeRef.current = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [win, focusWindow, resizeWindow]
  );

  if (win.isMinimized) return null;

  const AppComponent = APP_COMPONENTS[win.app];
  const style: React.CSSProperties = win.isMaximized
    ? { position: 'fixed', left: 0, top: 0, right: 0, bottom: 48, width: 'auto', height: 'auto', zIndex: win.zIndex }
    : { position: 'fixed', left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className={`window ${win.isFocused ? 'focused' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {!win.isMaximized && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => onResizeMouseDown(e, 'n')} />
          <div className="resize-handle s" onMouseDown={(e) => onResizeMouseDown(e, 's')} />
          <div className="resize-handle e" onMouseDown={(e) => onResizeMouseDown(e, 'e')} />
          <div className="resize-handle w" onMouseDown={(e) => onResizeMouseDown(e, 'w')} />
          <div className="resize-handle ne" onMouseDown={(e) => onResizeMouseDown(e, 'ne')} />
          <div className="resize-handle nw" onMouseDown={(e) => onResizeMouseDown(e, 'nw')} />
          <div className="resize-handle se" onMouseDown={(e) => onResizeMouseDown(e, 'se')} />
          <div className="resize-handle sw" onMouseDown={(e) => onResizeMouseDown(e, 'sw')} />
        </>
      )}
      <div className="window-titlebar" onMouseDown={onTitleMouseDown} onDoubleClick={() => toggleMaximize(win.id)}>
        <div className="win-title">
          <span className="win-icon">{win.icon}</span>
          <span className="win-name">{win.title}</span>
        </div>
        <div className="win-controls">
          <button className="win-btn minimize" onClick={() => minimizeWindow(win.id)} title="最小化">
            <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
          </button>
          <button className="win-btn maximize" onClick={() => toggleMaximize(win.id)} title={win.isMaximized ? '还原' : '最大化'}>
            {win.isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                <rect x="0" y="2" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
            )}
          </button>
          <button className="win-btn close" onClick={() => closeWindow(win.id)} title="关闭">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="window-content">
        {AppComponent ? <AppComponent /> : <div style={{ padding: 20 }}>App not found</div>}
      </div>
    </div>
  );
}
