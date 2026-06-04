import React, { useState } from 'react';
import './Explorer.css';

interface FSNode { name: string; type: 'folder' | 'file'; size?: string; modified?: string }

const FS: Record<string, FSNode[]> = {
  '/': [
    { name: '此电脑', type: 'folder' },
    { name: '桌面', type: 'folder' },
    { name: '下载', type: 'folder' },
    { name: '文档', type: 'folder' },
    { name: '图片', type: 'folder' },
  ],
  '/此电脑': [
    { name: '本地磁盘 (C:)', type: 'folder' },
    { name: '本地磁盘 (D:)', type: 'folder' },
  ],
  '/桌面': [
    { name: '记事本.lnk', type: 'file', size: '1 KB', modified: '2024-01-01' },
    { name: '计算器.lnk', type: 'file', size: '1 KB', modified: '2024-01-01' },
  ],
  '/下载': [
    { name: 'setup.exe', type: 'file', size: '128 MB', modified: '2024-03-15' },
    { name: 'photo.jpg', type: 'file', size: '4.2 MB', modified: '2024-03-20' },
    { name: '文档.pdf', type: 'file', size: '2.1 MB', modified: '2024-03-22' },
  ],
  '/文档': [
    { name: '工作报告', type: 'folder' },
    { name: 'readme.txt', type: 'file', size: '2 KB', modified: '2024-02-10' },
    { name: '项目计划.docx', type: 'file', size: '45 KB', modified: '2024-03-01' },
  ],
  '/图片': [
    { name: '截图', type: 'folder' },
    { name: '壁纸', type: 'folder' },
    { name: 'photo001.jpg', type: 'file', size: '3.8 MB', modified: '2024-01-15' },
  ],
};

const SIDEBAR = [
  { name: '主文件夹', icon: '🏠', path: '/' },
  { name: '桌面', icon: '🖥️', path: '/桌面' },
  { name: '下载', icon: '⬇️', path: '/下载' },
  { name: '文档', icon: '📄', path: '/文档' },
  { name: '图片', icon: '🖼️', path: '/图片' },
  { name: '此电脑', icon: '💻', path: '/此电脑' },
];

export default function Explorer() {
  const [path, setPath] = useState('/');
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const items = FS[path] || [];
  const pathParts = path === '/' ? ['主文件夹'] : path.split('/').filter(Boolean);

  const navigate = (p: string) => { setPath(p); setSelected(null); };

  const handleDblClick = (item: FSNode) => {
    if (item.type === 'folder') {
      const next = path === '/' ? `/${item.name}` : `${path}/${item.name}`;
      if (FS[next]) navigate(next);
    }
  };

  const fileIcon = (item: FSNode) => {
    if (item.type === 'folder') return '📁';
    const ext = item.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') return '📄';
    if (ext === 'pdf') return '📕';
    if (ext === 'jpg' || ext === 'png') return '🖼️';
    if (ext === 'exe') return '⚙️';
    if (ext === 'docx') return '📘';
    if (ext === 'lnk') return '🔗';
    return '📄';
  };

  return (
    <div className="explorer-app">
      <div className="explorer-toolbar">
        <button className="ex-btn" onClick={() => navigate('/')} title="向上">⬆</button>
        <div className="breadcrumb">
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="bc-sep">›</span>}
              <span
                className="bc-part"
                onClick={() => {
                  if (i === 0) navigate('/');
                  else navigate('/' + pathParts.slice(1, i + 1).join('/'));
                }}
              >{part}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="ex-toolbar-right">
          <button className={`ex-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰</button>
          <button className={`ex-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
        </div>
      </div>

      <div className="explorer-body">
        <div className="explorer-sidebar">
          {SIDEBAR.map((item) => (
            <div
              key={item.path}
              className={`sidebar-item ${path === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <div className={`explorer-content ${view}`}>
          {items.length === 0 && (
            <div className="explorer-empty">此文件夹为空</div>
          )}
          {view === 'list' && items.length > 0 && (
            <table className="file-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>修改日期</th>
                  <th>类型</th>
                  <th>大小</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name}
                    className={selected === item.name ? 'selected' : ''}
                    onClick={() => setSelected(item.name)}
                    onDoubleClick={() => handleDblClick(item)}
                  >
                    <td><span className="file-icon">{fileIcon(item)}</span>{item.name}</td>
                    <td>{item.modified || '—'}</td>
                    <td>{item.type === 'folder' ? '文件夹' : '文件'}</td>
                    <td>{item.size || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {view === 'grid' && (
            <div className="file-grid">
              {items.map((item) => (
                <div
                  key={item.name}
                  className={`file-grid-item ${selected === item.name ? 'selected' : ''}`}
                  onClick={() => setSelected(item.name)}
                  onDoubleClick={() => handleDblClick(item)}
                >
                  <span className="file-grid-icon">{fileIcon(item)}</span>
                  <span className="file-grid-name">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="explorer-status">
        {items.length} 个项目 {selected ? `| 已选择: ${selected}` : ''}
      </div>
    </div>
  );
}
