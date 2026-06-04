import { useState, useEffect } from 'react';
import { PINNED_APPS } from '../appRegistry';
import { useWindowStore } from '../store/windowStore';

interface Props {
  onStartClick: () => void;
  startOpen: boolean;
}

export default function Taskbar({ onStartClick, startOpen }: Props) {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindowStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });

  const handleAppClick = (appId: string, name: string, icon: string) => {
    const existing = windows.filter((w) => w.app === appId && !w.isMinimized);
    if (existing.length > 0) {
      focusWindow(existing[0].id);
    } else {
      openWindow(appId, name, icon);
    }
  };

  return (
    <div className="taskbar">
      <div className="taskbar-center">
        <button
          className={`start-btn ${startOpen ? 'active' : ''}`}
          onClick={onStartClick}
          title="开始"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M0 0h11v11H0zm13 0h11v11H13zM0 13h11v11H0zm13 0h11v11H13z"/>
          </svg>
        </button>

        <button className="taskbar-btn" title="搜索">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>

        <div className="taskbar-divider" />

        {PINNED_APPS.map((app) => {
          const winOpen = windows.some((w) => w.app === app.id);
          const focused = windows.some((w) => w.app === app.id && w.isFocused);
          return (
            <button
              key={app.id}
              className={`taskbar-app ${winOpen ? 'open' : ''} ${focused ? 'focused' : ''}`}
              onClick={() => handleAppClick(app.id, app.name, app.icon)}
              title={app.name}
            >
              <span>{app.icon}</span>
              {winOpen && <div className="app-indicator" />}
            </button>
          );
        })}

        {windows
          .filter((w) => !PINNED_APPS.some((a) => a.id === w.app))
          .map((w) => (
            <button
              key={w.id}
              className={`taskbar-app open ${w.isFocused ? 'focused' : ''}`}
              onClick={() => {
                if (w.isFocused && !w.isMinimized) minimizeWindow(w.id);
                else focusWindow(w.id);
              }}
              title={w.title}
            >
              <span>{w.icon}</span>
              <div className="app-indicator" />
            </button>
          ))}
      </div>

      <div className="taskbar-right">
        <button className="sys-tray-btn" title="网络">🌐</button>
        <button className="sys-tray-btn" title="声音">🔊</button>
        <button className="sys-tray-btn" title="电池">🔋</button>
        <div className="clock">
          <div className="clock-time">{formatTime(time)}</div>
          <div className="clock-date">{formatDate(time)}</div>
        </div>
        <button className="notification-btn" title="通知中心">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
