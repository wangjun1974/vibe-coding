import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Minesweeper.css';

const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;

const NUM_COLORS: Record<number, string> = {
  1: '#1976d2', 2: '#388e3c', 3: '#d32f2f',
  4: '#7b1fa2', 5: '#c62828', 6: '#00838f',
  7: '#212121', 8: '#757575',
};

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighbors: number;
}

type Board = Cell[][];
type Status = 'playing' | 'won' | 'lost';

function makeBoard(): Board {
  const board: Board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ isMine: false, isRevealed: false, isFlagged: false, neighbors: 0 }))
  );
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) { board[r][c].isMine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) n++;
        }
      board[r][c].neighbors = n;
    }
  }
  return board;
}

function floodReveal(board: Board, startR: number, startC: number): Board {
  const b = board.map(row => row.map(cell => ({ ...cell })));
  const queue: [number, number][] = [[startR, startC]];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (b[r][c].isRevealed || b[r][c].isFlagged) continue;
    b[r][c].isRevealed = true;
    if (b[r][c].neighbors === 0 && !b[r][c].isMine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          queue.push([r + dr, c + dc]);
  }
  return b;
}

export default function Minesweeper() {
  const [board, setBoard] = useState<Board>(makeBoard);
  const [status, setStatus] = useState<Status>('playing');
  const [flags, setFlags] = useState(MINE_COUNT);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (status !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const startTimer = () => {
    if (started.current) return;
    started.current = true;
    timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    started.current = false;
    setBoard(makeBoard());
    setStatus('playing');
    setFlags(MINE_COUNT);
    setTime(0);
  };

  const handleClick = useCallback((r: number, c: number) => {
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    startTimer();

    if (cell.isMine) {
      setBoard(b => b.map(row => row.map(cell => ({ ...cell, isRevealed: cell.isMine || cell.isRevealed }))));
      setStatus('lost');
      return;
    }

    const next = floodReveal(board, r, c);
    setBoard(next);
    if (next.flat().every(cell => cell.isRevealed || cell.isMine)) setStatus('won');
  }, [board, status]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed) return;
    setBoard(b => b.map((row, ri) => row.map((cl, ci) =>
      ri === r && ci === c ? { ...cl, isFlagged: !cl.isFlagged } : cl
    )));
    setFlags(f => cell.isFlagged ? f + 1 : f - 1);
  }, [board, status]);

  return (
    <div className="minesweeper-app">
      {/* Header */}
      <div className="ms-header">
        <div className="ms-counter">
          {String(Math.max(0, flags)).padStart(3, '0')}
        </div>
        <button
          onClick={reset}
          className="ms-reset-btn"
        >
          {status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'}
        </button>
        <div className="ms-counter">
          {String(time).padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div className="ms-grid">
        {board.map((row, r) => (
          <div key={r} className="ms-row">
            {row.map((cell, c) => {
              const revealed = cell.isRevealed;
              return (
                <div
                  key={c}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  className={`ms-cell ${revealed ? 'revealed' : ''} ${cell.isMine && status === 'lost' ? 'mine-exploded' : ''} ${cell.isFlagged || cell.isMine ? 'has-icon' : ''}`}
                  style={{
                    color: revealed && !cell.isMine ? (NUM_COLORS[cell.neighbors] || 'transparent') : '#000',
                  }}
                >
                  {revealed
                    ? (cell.isMine ? '💣' : cell.neighbors > 0 ? cell.neighbors : '')
                    : (cell.isFlagged ? '🚩' : '')}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {status !== 'playing' && (
        <div className={`ms-result ${status === 'won' ? 'won' : 'lost'}`}>
          {status === 'won' ? '🎉 你赢了！' : '💥 踩到地雷了！'}
          <button onClick={reset} className="ms-restart-btn">
            再来一局
          </button>
        </div>
      )}
    </div>
  );
}
