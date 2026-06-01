import React, { useState } from 'react';

const BUTTONS = [
  ['%', 'CE', 'C', '⌫'],
  ['1/x', 'x²', '√x', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['+/−', '0', '.', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNum, setNewNum] = useState(true);
  const [history, setHistory] = useState('');

  const input = (val: string) => {
    if (newNum) {
      setDisplay(val === '.' ? '0.' : val);
      setNewNum(false);
    } else {
      if (val === '.' && display.includes('.')) return;
      setDisplay(display === '0' && val !== '.' ? val : display + val);
    }
  };

  const operate = (o: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !newNum) {
      const res = calc(prev, cur, op);
      setDisplay(String(res));
      setPrev(res);
      setHistory(`${res} ${o}`);
    } else {
      setPrev(cur);
      setHistory(`${cur} ${o}`);
    }
    setOp(o);
    setNewNum(true);
  };

  const calc = (a: number, b: number, o: string): number => {
    if (o === '+') return a + b;
    if (o === '−') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b !== 0 ? a / b : 0;
    return b;
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (prev !== null && op) {
      const res = calc(prev, cur, op);
      setHistory(`${prev} ${op} ${cur} =`);
      setDisplay(String(parseFloat(res.toFixed(10))));
      setPrev(null);
      setOp(null);
      setNewNum(true);
    }
  };

  const handleBtn = (btn: string) => {
    if (btn === 'C' || btn === 'CE') { setDisplay('0'); setNewNum(true); if (btn === 'C') { setPrev(null); setOp(null); setHistory(''); } }
    else if (btn === '⌫') { setDisplay(display.length > 1 ? display.slice(0, -1) : '0'); }
    else if (btn === '+/−') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
    else if (btn === '1/x') setDisplay(String(1 / parseFloat(display)));
    else if (btn === 'x²') setDisplay(String(parseFloat(display) ** 2));
    else if (btn === '√x') setDisplay(String(Math.sqrt(parseFloat(display))));
    else if (['+', '−', '×', '÷'].includes(btn)) operate(btn);
    else if (btn === '=') equals();
    else input(btn);
  };

  const isOp = (b: string) => ['+', '−', '×', '÷'].includes(b);
  const isSpecial = (b: string) => ['%', 'CE', 'C', '⌫', '1/x', 'x²', '√x'].includes(b);

  return (
    <div className="calc-app">
      <div className="calc-display">
        <div className="calc-history">{history}</div>
        <div className="calc-number">{display}</div>
      </div>
      <div className="calc-buttons">
        {BUTTONS.map((row, ri) =>
          row.map((btn, bi) => (
            <button
              key={`${ri}-${bi}`}
              className={`calc-btn ${btn === '=' ? 'eq' : ''} ${isOp(btn) ? 'operator' : ''} ${isSpecial(btn) ? 'special' : ''}`}
              onClick={() => handleBtn(btn)}
            >
              {btn}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
