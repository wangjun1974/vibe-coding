import React, { useState } from 'react';
import { PINNED_APPS, type AppMeta } from '../appRegistry';
import { useWindowStore } from '../store/windowStore';

interface Props {
  onClose: () => void;
}

export default function StartMenu({ onClose }: Props) {
  const [search, setSearch] = useState('');
  const { openWindow } = useWindowStore();

  const filtered = PINNED_APPS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const launch = (app: AppMeta) => {
    openWindow(app.id, app.name, app.icon);
    onClose();
  };

  return (
    <div className="start-menu">
      <div className="start-search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#888">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索应用、设置和文档"
        />
      </div>

      {!search && (
        <>
          <div className="start-section-title">已固定</div>
          <div className="start-apps-grid">
            {PINNED_APPS.map((app) => (
              <button key={app.id} className="start-app-item" onClick={() => launch(app)}>
                <span className="start-app-icon">{app.icon}</span>
                <span className="start-app-name">{app.name}</span>
              </button>
            ))}
          </div>

          <div className="start-section-title">推荐</div>
          <div className="start-recommended">
            <div className="rec-item">
              <span>📄</span>
              <div>
                <div className="rec-name">欢迎使用</div>
                <div className="rec-meta">刚才</div>
              </div>
            </div>
            <div className="rec-item">
              <span>🖼️</span>
              <div>
                <div className="rec-name">桌面壁纸</div>
                <div className="rec-meta">今天</div>
              </div>
            </div>
          </div>
        </>
      )}

      {search && (
        <div className="start-search-results">
          {filtered.map((app) => (
            <button key={app.id} className="search-result-item" onClick={() => launch(app)}>
              <span className="search-result-icon">{app.icon}</span>
              <div>
                <div className="search-result-name">{app.name}</div>
                <div className="search-result-meta">应用</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="search-empty">没有找到"{search}"的结果</div>
          )}
        </div>
      )}

      <div className="start-footer">
        <div className="start-user">
          <div className="avatar">👤</div>
          <span>用户</span>
        </div>
        <button className="power-btn" title="电源">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
