import React, { useRef, useState, useCallback, useEffect } from 'react';

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36'];
const FONT_FAMILIES = ['宋体', '黑体', '微软雅黑', '楷体', 'Arial', 'Times New Roman'];

export default function WordPad() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const [currentFontSize, setCurrentFontSize] = useState('14');
  const [currentFontFamily, setCurrentFontFamily] = useState('宋体');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!showFontMenu) return;
    const handler = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFontMenu]);

  const execCmd = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  const applyFontSize = useCallback((px: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand('fontSize', false, '7');
    editor.querySelectorAll('font[size="7"]').forEach((el) => {
      const span = document.createElement('span');
      span.style.fontSize = `${px}px`;
      span.innerHTML = (el as HTMLElement).innerHTML;
      el.parentNode?.replaceChild(span, el);
    });
    editor.focus();
  }, []);

  const handleInput = useCallback(() => {
    const text = editorRef.current?.innerText || '';
    setWordCount(text.replace(/\n/g, '').length);
  }, []);

  const formatBtn = (label: string, cmd: string, title?: string) => (
    <button
      className="wordpad-btn"
      onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
      title={title || label}
      style={{
        padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 3,
        background: '#fff', cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="wordpad-app" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f5' }}>
      {/* Menu Bar */}
      <div style={{ display: 'flex', gap: 4, padding: '4px 8px', borderBottom: '1px solid #ddd', background: '#fff' }}>
        {['文件', '编辑', '查看', '帮助'].map((item) => (
          <span key={item} style={{ padding: '4px 8px', fontSize: 13, cursor: 'default' }}>{item}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '4px 8px', borderBottom: '1px solid #ddd', background: '#fafafa', flexWrap: 'wrap' }}>
        {/* Font Family */}
        <div ref={fontMenuRef} style={{ position: 'relative' }}>
          <button
            className="wordpad-btn"
            onMouseDown={(e) => { e.preventDefault(); setShowFontMenu(!showFontMenu); }}
            style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 3, background: '#fff', cursor: 'pointer', minWidth: 100, textAlign: 'left' }}
          >
            {currentFontFamily} ▾
          </button>
          {showFontMenu && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, maxHeight: 200, overflowY: 'auto', minWidth: 160 }}>
              {FONT_FAMILIES.map((f) => (
                <div
                  key={f}
                  onClick={() => { setCurrentFontFamily(f); execCmd('fontName', f); setShowFontMenu(false); }}
                  style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontFamily: f }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e8f0fe')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <select
          value={currentFontSize}
          onChange={(e) => { setCurrentFontSize(e.target.value); applyFontSize(e.target.value); }}
          style={{ padding: '4px 2px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }}
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

        {formatBtn('B', 'bold', '粗体')}
        {formatBtn('I', 'italic', '斜体')}
        {formatBtn('U', 'underline', '下划线')}

        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

        {formatBtn('左对齐', 'justifyLeft', '左对齐')}
        {formatBtn('居中', 'justifyCenter', '居中')}
        {formatBtn('右对齐', 'justifyRight', '右对齐')}

        <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

        {formatBtn('• 列表', 'insertUnorderedList', '无序列表')}
        {formatBtn('1. 列表', 'insertOrderedList', '有序列表')}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        style={{
          flex: 1,
          padding: '16px 24px',
          fontSize: `${currentFontSize}px`,
          fontFamily: currentFontFamily,
          lineHeight: 1.6,
          outline: 'none',
          overflowY: 'auto',
          background: '#fff',
          margin: 8,
          borderRadius: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          minHeight: 200,
        }}
      />

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px', borderTop: '1px solid #ddd', fontSize: 12, color: '#666', background: '#f0f0f0' }}>
        <span>字数：{wordCount}</span>
        <span>UTF-8</span>
        <span>100%</span>
      </div>
    </div>
  );
}
