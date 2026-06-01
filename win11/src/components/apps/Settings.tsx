import React, { useState } from 'react';

const SECTIONS = [
  { id: 'system', name: '系统', icon: '💻' },
  { id: 'bluetooth', name: '蓝牙和设备', icon: '📡' },
  { id: 'network', name: '网络和Internet', icon: '🌐' },
  { id: 'personalize', name: '个性化', icon: '🎨' },
  { id: 'apps', name: '应用', icon: '📦' },
  { id: 'accounts', name: '账户', icon: '👤' },
  { id: 'time', name: '时间和语言', icon: '🕐' },
  { id: 'privacy', name: '隐私和安全性', icon: '🔒' },
  { id: 'update', name: 'Windows 更新', icon: '🔄' },
];

export default function Settings() {
  const [section, setSection] = useState('system');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [wifi, setWifi] = useState(true);

  const renderContent = () => {
    switch (section) {
      case 'system':
        return (
          <div className="settings-content">
            <h2>系统</h2>
            <div className="settings-card">
              <div className="settings-device">
                <div className="device-icon">🖥️</div>
                <div>
                  <div className="device-name">DESKTOP-WIN11</div>
                  <div className="device-spec">Windows 11 专业版</div>
                  <div className="device-spec">处理器: Intel Core i7 模拟器</div>
                  <div className="device-spec">内存: 16.0 GB RAM</div>
                </div>
              </div>
            </div>
            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🖥️ 显示</div>
                  <div className="s-item-desc">显示器、亮度、夜间模式</div>
                </div>
                <span className="s-chevron">›</span>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🔔 通知</div>
                  <div className="s-item-desc">来自应用和其他发件人的通知</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">⚡ 电源和睡眠</div>
                  <div className="s-item-desc">屏幕和睡眠设置</div>
                </div>
                <span className="s-chevron">›</span>
              </div>
            </div>
          </div>
        );
      case 'personalize':
        return (
          <div className="settings-content">
            <h2>个性化</h2>
            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🌙 深色模式</div>
                  <div className="s-item-desc">切换应用的颜色主题</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🖼️ 背景</div>
                  <div className="s-item-desc">图片、纯色或幻灯片放映</div>
                </div>
                <span className="s-chevron">›</span>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🎨 主题色</div>
                  <div className="s-item-desc">Windows 和应用的主题色</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['#0078d4', '#e74856', '#0099bc', '#7a7574'].map((c) => (
                    <div key={c} style={{ width: 20, height: 20, borderRadius: 4, background: c, cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="settings-content">
            <h2>网络和 Internet</h2>
            <div className="settings-list">
              <div className="settings-item">
                <div>
                  <div className="s-item-title">📶 Wi-Fi</div>
                  <div className="s-item-desc">{wifi ? '已连接: Home-Network' : '已断开'}</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🔗 以太网</div>
                  <div className="s-item-desc">未连接</div>
                </div>
                <span className="s-chevron">›</span>
              </div>
              <div className="settings-item">
                <div>
                  <div className="s-item-title">🔥 热点</div>
                  <div className="s-item-desc">通过移动热点共享Internet连接</div>
                </div>
                <span className="s-chevron">›</span>
              </div>
            </div>
          </div>
        );
      case 'update':
        return (
          <div className="settings-content">
            <h2>Windows 更新</h2>
            <div className="settings-card" style={{ background: '#dff0d8', border: '1px solid #c3e6cb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 600 }}>你是最新版本</div>
                  <div style={{ color: '#666', fontSize: 13 }}>上次检查时间: 今天</div>
                </div>
              </div>
            </div>
            <div className="settings-list">
              <div className="settings-item">
                <div className="s-item-title">更新历史记录</div>
                <span className="s-chevron">›</span>
              </div>
              <div className="settings-item">
                <div className="s-item-title">高级选项</div>
                <span className="s-chevron">›</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="settings-content">
            <h2>{SECTIONS.find((s) => s.id === section)?.name}</h2>
            <div className="settings-card" style={{ padding: 40, textAlign: 'center', color: '#888' }}>
              此设置页面正在建设中 🚧
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-app">
      <div className="settings-sidebar">
        <div className="settings-user">
          <div className="settings-avatar">👤</div>
          <div>
            <div style={{ fontWeight: 600 }}>用户</div>
            <div style={{ fontSize: 12, color: '#888' }}>本地账户</div>
          </div>
        </div>
        {SECTIONS.map((s) => (
          <div
            key={s.id}
            className={`settings-nav-item ${section === s.id ? 'active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </div>
        ))}
      </div>
      <div className="settings-main">{renderContent()}</div>
    </div>
  );
}
