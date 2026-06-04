import { useState } from 'react';

export default function Notepad() {
  const [text, setText] = useState('欢迎使用记事本！\n\n这是一个简单的文本编辑器。');
  const [fontsize, setFontsize] = useState(14);
  const [wordwrap, setWordwrap] = useState(true);
  const [showFormat, setShowFormat] = useState(false);

  const lines = text.split('\n').length;
  const chars = text.length;

  return (
    <div className="notepad-app">
      <div className="notepad-menu">
        <div className="menu-item">文件</div>
        <div className="menu-item">编辑</div>
        <div
          className="menu-item"
          onClick={() => setShowFormat(!showFormat)}
          style={{ position: 'relative' }}
        >
          格式
          {showFormat && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => setWordwrap(!wordwrap)}>
                {wordwrap ? '✓ ' : '　'}自动换行
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={() => setFontsize(12)}>小字体 (12px)</div>
              <div className="dropdown-item" onClick={() => setFontsize(14)}>默认 (14px)</div>
              <div className="dropdown-item" onClick={() => setFontsize(16)}>大字体 (16px)</div>
              <div className="dropdown-item" onClick={() => setFontsize(20)}>特大 (20px)</div>
            </div>
          )}
        </div>
        <div className="menu-item">查看</div>
        <div className="menu-item">帮助</div>
      </div>
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: fontsize, whiteSpace: wordwrap ? 'pre-wrap' : 'pre' }}
        spellCheck={false}
      />
      <div className="notepad-status">
        <span>第 1 行，第 1 列</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
        <span>{lines} 行 | {chars} 字符</span>
      </div>
    </div>
  );
}
