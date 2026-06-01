import React, { useState } from 'react';

const BOOKMARKS = [
  { name: 'Anthropic', url: 'https://anthropic.com', icon: '🤖' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { name: 'MDN', url: 'https://developer.mozilla.org', icon: '📚' },
  { name: 'React', url: 'https://react.dev', icon: '⚛️' },
];

export default function Browser() {
  const [url, setUrl] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const navigate = (target: string) => {
    let normalized = target.trim();
    if (!normalized.startsWith('http')) normalized = `https://${normalized}`;
    setUrl(normalized);
    setInput(normalized);
    setHistory((h) => [...h.slice(0, histIdx + 1), normalized]);
    setHistIdx((i) => i + 1);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const goBack = () => {
    if (histIdx > 0) { setHistIdx((i) => i - 1); setUrl(history[histIdx - 1]); setInput(history[histIdx - 1]); }
  };
  const goForward = () => {
    if (histIdx < history.length - 1) { setHistIdx((i) => i + 1); setUrl(history[histIdx + 1]); setInput(history[histIdx + 1]); }
  };

  return (
    <div className="browser-app">
      <div className="browser-toolbar">
        <button className="br-btn" onClick={goBack} disabled={histIdx <= 0}>‹</button>
        <button className="br-btn" onClick={goForward} disabled={histIdx >= history.length - 1}>›</button>
        <button className="br-btn" onClick={() => navigate(url)} title="刷新">↻</button>
        <div className="url-bar">
          <span className="url-secure">🔒</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(input)}
            placeholder="搜索或输入网址"
          />
        </div>
        <button className="br-btn">⋯</button>
      </div>

      {!url && (
        <div className="browser-newtab">
          <div className="newtab-logo">🌐</div>
          <div className="newtab-search">
            <input
              placeholder="搜索"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value;
                  navigate(`https://www.bing.com/search?q=${encodeURIComponent(v)}`);
                }
              }}
            />
          </div>
          <div className="newtab-bookmarks">
            {BOOKMARKS.map((b) => (
              <div key={b.url} className="bookmark-item" onClick={() => navigate(b.url)}>
                <div className="bookmark-icon">{b.icon}</div>
                <div className="bookmark-name">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {url && (
        <div className="browser-frame">
          {loading ? (
            <div className="browser-loading">
              <div className="loading-spinner" />
              <div>正在加载...</div>
            </div>
          ) : (
            <div className="browser-blocked">
              <div style={{ fontSize: 64 }}>🌐</div>
              <h2>{url}</h2>
              <p style={{ color: '#666' }}>由于浏览器安全策略（X-Frame-Options），<br />部分网站无法在 iframe 中显示。</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="open-external">
                在新标签页中打开 ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
