import { useRef, useState, useCallback, useEffect } from 'react';
import './WordPad.css';

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
    >
      {label}
    </button>
  );

  return (
    <div className="wordpad-app">
      {/* Menu Bar */}
      <div className="wordpad-menubar">
        {['文件', '编辑', '查看', '帮助'].map((item) => (
          <span key={item} className="wordpad-menu-item">{item}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="wordpad-toolbar">
        {/* Font Family */}
        <div ref={fontMenuRef} className="wordpad-font-menu">
          <button
            className="wordpad-font-trigger"
            onMouseDown={(e) => { e.preventDefault(); setShowFontMenu(!showFontMenu); }}
          >
            {currentFontFamily} ▾
          </button>
          {showFontMenu && (
            <div className="wordpad-font-dropdown">
              {FONT_FAMILIES.map((f) => (
                <div
                  key={f}
                  className="wordpad-font-item"
                  style={{ fontFamily: f }}
                  onClick={() => { setCurrentFontFamily(f); execCmd('fontName', f); setShowFontMenu(false); }}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <select
          className="wordpad-font-size-select"
          value={currentFontSize}
          onChange={(e) => { setCurrentFontSize(e.target.value); applyFontSize(e.target.value); }}
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <div className="wordpad-separator" />

        {formatBtn('B', 'bold', '粗体')}
        {formatBtn('I', 'italic', '斜体')}
        {formatBtn('U', 'underline', '下划线')}

        <div className="wordpad-separator" />

        {formatBtn('左对齐', 'justifyLeft', '左对齐')}
        {formatBtn('居中', 'justifyCenter', '居中')}
        {formatBtn('右对齐', 'justifyRight', '右对齐')}

        <div className="wordpad-separator" />

        {formatBtn('• 列表', 'insertUnorderedList', '无序列表')}
        {formatBtn('1. 列表', 'insertOrderedList', '有序列表')}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="wordpad-editor"
        style={{
          fontSize: `${currentFontSize}px`,
          fontFamily: currentFontFamily,
        }}
      />

      {/* Status Bar */}
      <div className="wordpad-statusbar">
        <span>字数：{wordCount}</span>
        <span>UTF-8</span>
        <span>100%</span>
      </div>
    </div>
  );
}
