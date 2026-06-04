import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

interface Line { text: string; type: 'input' | 'output' | 'error' }

const FS: Record<string, string[]> = {
  'C:\\': ['Users', 'Windows', 'Program Files'],
  'C:\\Users': ['Public', '用户'],
  'C:\\Users\\用户': ['Desktop', 'Documents', 'Downloads', 'Pictures'],
  'C:\\Users\\用户\\Documents': ['readme.txt', 'notes.txt'],
  'C:\\Users\\用户\\Desktop': ['快捷方式.lnk'],
};

const FILES: Record<string, string> = {
  'readme.txt': 'Windows 11 模拟器\n作者: Claude',
  'notes.txt': '这是一个笔记文件。',
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: 'Microsoft Windows [版本 11.0.22631.3296]', type: 'output' },
    { text: '(c) Microsoft Corporation。保留所有权利。', type: 'output' },
    { text: '', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('C:\\Users\\用户');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const prompt = `${cwd}>`;

  const addLine = (text: string, type: Line['type'] = 'output') =>
    setLines((l) => [...l, { text, type }]);

  const runCmd = (raw: string) => {
    const cmd = raw.trim();
    addLine(`${prompt}${cmd}`, 'input');
    if (!cmd) return;

    const parts = cmd.split(/\s+/);
    const [c, ...args] = parts;
    const name = c.toLowerCase();

    if (name === 'cls' || name === 'clear') { setLines([]); return; }
    if (name === 'echo') { addLine(args.join(' ')); return; }
    if (name === 'date') { addLine(new Date().toLocaleDateString('zh-CN')); return; }
    if (name === 'time') { addLine(new Date().toLocaleTimeString('zh-CN')); return; }
    if (name === 'ver') { addLine('Microsoft Windows [版本 11.0.22631.3296]'); return; }
    if (name === 'whoami') { addLine('desktop-win11\\用户'); return; }
    if (name === 'hostname') { addLine('DESKTOP-WIN11'); return; }
    if (name === 'ipconfig') {
      addLine('Windows IP 配置');
      addLine('');
      addLine('以太网适配器 以太网:');
      addLine('   IPv4 地址 . . . . . . . . . . . : 192.168.1.100');
      addLine('   子网掩码  . . . . . . . . . . . : 255.255.255.0');
      addLine('   默认网关. . . . . . . . . . . . : 192.168.1.1');
      return;
    }
    if (name === 'dir' || name === 'ls') {
      const target = FS[cwd];
      if (target) {
        addLine(` 驱动器 C 中的卷没有标签。`);
        addLine(` ${cwd} 的目录`);
        addLine('');
        target.forEach((f) => addLine(`               <DIR>    ${f}`));
        addLine(`               ${target.length} 个目录`);
      } else {
        addLine('系统找不到指定的路径。', 'error');
      }
      return;
    }
    if (name === 'cd') {
      if (!args[0] || args[0] === '.') { addLine(cwd); return; }
      if (args[0] === '..') {
        const parts = cwd.split('\\');
        if (parts.length > 1) setCwd(parts.slice(0, -1).join('\\') || 'C:\\');
        return;
      }
      const next = cwd === 'C:\\' ? `C:\\${args[0]}` : `${cwd}\\${args[0]}`;
      if (FS[next] !== undefined) setCwd(next);
      else addLine(`系统找不不到指定的路径。`, 'error');
      return;
    }
    if (name === 'type') {
      const fname = args[0] || '';
      if (FILES[fname]) addLine(FILES[fname]);
      else addLine(`系统找不到指定的文件。`, 'error');
      return;
    }
    if (name === 'help') {
      addLine('可用命令: dir, cd, cls, echo, type, date, time, ver, whoami, hostname, ipconfig, help, exit');
      return;
    }
    if (name === 'exit') { addLine('bye!'); return; }
    addLine(`'${c}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, 'error');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input;
      if (cmd.trim()) setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      setInput('');
      runCmd(cmd);
    } else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-output">
        {lines.map((l, i) => (
          <div key={i} className={`terminal-line ${l.type}`}>{l.text}</div>
        ))}
        <div className="terminal-input-row">
          <span className="terminal-prompt">{prompt}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
