import React, { useEffect, useRef, useCallback } from 'react';

const CW = 760, CH = 460;
const GRAVITY = 0.55, JUMP = -13, RUN = 4, TILE = 40;

type Rect = { x: number; y: number; w: number; h: number };
type Goomba = Rect & { vx: number; alive: boolean };
type Coin = Rect & { collected: boolean };

const PLATFORMS: Rect[] = [
  { x: 0,    y: CH - TILE,       w: 2920, h: TILE },
  { x: 3100, y: CH - TILE,       w: 200,  h: TILE },
  { x: 280,  y: CH - TILE * 3,   w: 120,  h: TILE },
  { x: 500,  y: CH - TILE * 4,   w: 80,   h: TILE },
  { x: 720,  y: CH - 100,        w: 160,  h: TILE },
  { x: 960,  y: CH - TILE * 5,   w: 80,   h: TILE },
  { x: 1120, y: CH - TILE * 3,   w: 200,  h: TILE },
  { x: 1440, y: CH - 180,        w: 120,  h: TILE },
  { x: 1640, y: CH - TILE * 2,   w: 200,  h: TILE },
  { x: 1960, y: CH - TILE * 5,   w: 120,  h: TILE },
  { x: 2160, y: CH - TILE * 3,   w: 160,  h: TILE },
  { x: 2400, y: CH - TILE * 4,   w: 160,  h: TILE },
  { x: 2700, y: CH - TILE * 2,   w: 200,  h: TILE },
];

const COIN_DEFS: [number, number][] = [
  [310, CH - TILE * 5],   [350, CH - TILE * 5],   [390, CH - TILE * 5],
  [530, CH - TILE * 6],   [570, CH - TILE * 6],
  [740, CH - 140],        [780, CH - 140],         [820, CH - 140],
  [990, CH - TILE * 7],
  [1140, CH - TILE * 5],  [1180, CH - TILE * 5],   [1220, CH - TILE * 5],
  [1460, CH - 220],       [1500, CH - 220],
  [1660, CH - TILE * 4],  [1700, CH - TILE * 4],   [1740, CH - TILE * 4],
  [1980, CH - TILE * 7],  [2020, CH - TILE * 7],
  [2180, CH - TILE * 5],  [2220, CH - TILE * 5],
  [2420, CH - TILE * 6],  [2460, CH - TILE * 6],   [2500, CH - TILE * 6],
  [2730, CH - TILE * 4],  [2770, CH - TILE * 4],
];

const GOOMBA_DEFS: [number, number, number][] = [
  [560, CH - TILE - 34, -1.5],
  [850, CH - TILE - 34, -1.8],
  [1350, CH - TILE - 34, -1.5],
  [1820, CH - TILE - 34, -2],
  [2300, CH - TILE - 34, -1.8],
  [2580, CH - TILE - 34, -2],
];

export default function Mario() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const stateRef = useRef({
    mario: { x: 80, y: 300, w: 30, h: 42, vx: 0, vy: 0, onGround: false, right: true },
    coins: COIN_DEFS.map(([x, y]) => ({ x, y, w: 20, h: 20, collected: false } as Coin)),
    goombas: GOOMBA_DEFS.map(([x, y, vx]) => ({ x, y, w: 34, h: 34, vx, alive: true } as Goomba)),
    scrollX: 0,
    score: 0,
    lives: 3,
    frame: 0,
    phase: 'play' as 'play' | 'dead' | 'win',
  });
  const rafRef = useRef(0);

  const reset = useCallback(() => {
    const s = stateRef.current;
    Object.assign(s.mario, { x: 80, y: 300, vx: 0, vy: 0, onGround: false, right: true });
    s.coins = COIN_DEFS.map(([x, y]) => ({ x, y, w: 20, h: 20, collected: false }));
    s.goombas = GOOMBA_DEFS.map(([x, y, vx]) => ({ x, y, w: 34, h: 34, vx, alive: true }));
    s.scrollX = 0; s.score = 0; s.lives = 3; s.frame = 0; s.phase = 'play';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.code)) e.preventDefault();
      if (e.code === 'KeyR' && stateRef.current.phase !== 'play') reset();
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    const blur = () => { keysRef.current = {}; };
    canvas.addEventListener('keydown', down);
    canvas.addEventListener('keyup', up);
    canvas.addEventListener('blur', blur);
    canvas.focus();
    return () => {
      canvas.removeEventListener('keydown', down);
      canvas.removeEventListener('keyup', up);
      canvas.removeEventListener('blur', blur);
    };
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const hits = (a: Rect, b: Rect) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    function tick() {
      const s = stateRef.current;
      s.frame++;
      const m = s.mario;
      const keys = keysRef.current;

      if (s.phase === 'play') {
        if (keys['ArrowLeft'] || keys['KeyA']) { m.vx = -RUN; m.right = false; }
        else if (keys['ArrowRight'] || keys['KeyD']) { m.vx = RUN; m.right = true; }
        else m.vx *= 0.8;

        if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && m.onGround) {
          m.vy = JUMP; m.onGround = false;
        }

        m.vy = Math.min(m.vy + GRAVITY, 16);
        m.x += m.vx;
        m.y += m.vy;
        m.x = Math.max(0, m.x);
        m.onGround = false;

        for (const p of PLATFORMS) {
          if (!hits(m, p)) continue;
          const ox = Math.min(m.x + m.w, p.x + p.w) - Math.max(m.x, p.x);
          const oy = Math.min(m.y + m.h, p.y + p.h) - Math.max(m.y, p.y);
          if (oy < ox) {
            if (m.vy >= 0 && m.y + m.h - m.vy <= p.y + 1) {
              m.y = p.y - m.h; m.vy = 0; m.onGround = true;
            } else {
              m.y = p.y + p.h; m.vy = 0;
            }
          } else {
            m.x = m.x < p.x ? p.x - m.w : p.x + p.w; m.vx = 0;
          }
        }

        s.scrollX = Math.max(0, Math.min(m.x - CW * 0.33, 3300 - CW));

        for (const c of s.coins) {
          if (!c.collected && hits(m, c)) { c.collected = true; s.score += 100; }
        }

        for (const gb of s.goombas) {
          if (!gb.alive) continue;
          gb.x += gb.vx;
          if (gb.x < 0 || gb.x + gb.w > 3200) gb.vx *= -1;
          gb.y = CH - TILE - gb.h;

          if (hits(m, gb)) {
            if (m.vy > 0 && m.y + m.h - m.vy < gb.y + 8) {
              gb.alive = false; m.vy = JUMP * 0.55; s.score += 200;
            } else {
              if (--s.lives <= 0) s.phase = 'dead';
              else { m.x = 80; m.y = 300; m.vx = 0; m.vy = 0; s.scrollX = 0; }
            }
          }
        }

        if (m.y > CH + 80) {
          if (--s.lives <= 0) s.phase = 'dead';
          else { m.x = 80; m.y = 300; m.vx = 0; m.vy = 0; s.scrollX = 0; }
        }

        if (m.x > 3150) s.phase = 'win';
      }

      // --- RENDER ---
      const sx = s.scrollX;

      ctx.fillStyle = '#5c94fc';
      ctx.fillRect(0, 0, CW, CH);

      // Clouds (parallax)
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      for (let i = 0; i < 6; i++) {
        const baseX = i * 200;
        const cx = ((baseX - sx * 0.3) % (CW + 200) + CW + 200) % (CW + 200) - 60;
        const cy = 55 + (i % 3) * 22;
        ctx.beginPath();
        ctx.arc(cx,      cy,      18, 0, Math.PI * 2);
        ctx.arc(cx + 22, cy - 8,  23, 0, Math.PI * 2);
        ctx.arc(cx + 46, cy,      18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Platforms
      for (const p of PLATFORMS) {
        const px = p.x - sx;
        if (px + p.w < 0 || px > CW) continue;
        ctx.fillStyle = '#5aaa00';
        ctx.fillRect(px, p.y, p.w, 10);
        ctx.fillStyle = '#c8560c';
        ctx.fillRect(px, p.y + 10, p.w, p.h - 10);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        for (let gx = Math.ceil(p.x / TILE) * TILE; gx < p.x + p.w; gx += TILE) {
          ctx.beginPath(); ctx.moveTo(gx - sx, p.y); ctx.lineTo(gx - sx, p.y + p.h); ctx.stroke();
        }
      }

      // Castle at end
      const castleX = 3105 - sx;
      if (castleX > -160 && castleX < CW + 20) {
        ctx.fillStyle = '#909090';
        ctx.fillRect(castleX, CH - 200, 140, 160);
        ctx.fillStyle = '#707070';
        for (let i = 0; i < 4; i++) ctx.fillRect(castleX + i * 36, CH - 220, 24, 24);
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(castleX + 48, CH - 100, 44, 62);
        ctx.fillStyle = '#ffee00';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('FLAG', castleX + 52, CH - 182);
      }

      // Coins
      for (const c of s.coins) {
        if (c.collected) continue;
        const cpx = c.x - sx + 10;
        if (cpx < -20 || cpx > CW + 20) continue;
        const bob = Math.sin(s.frame * 0.08) * 3;
        ctx.fillStyle = '#f8d020';
        ctx.beginPath(); ctx.arc(cpx, c.y + 10 + bob, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#c8a000'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,180,0.7)';
        ctx.beginPath(); ctx.arc(cpx - 2, c.y + 7 + bob, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Goombas
      for (const gb of s.goombas) {
        if (!gb.alive) continue;
        const gpx = gb.x - sx;
        if (gpx < -50 || gpx > CW + 50) continue;
        ctx.fillStyle = '#c87428';
        ctx.beginPath(); ctx.arc(gpx + 17, gb.y + 12, 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8b3e10';
        ctx.fillRect(gpx + 4, gb.y + 18, 26, 14);
        ctx.fillStyle = 'white';
        ctx.fillRect(gpx + 4,  gb.y + 6, 8, 8);
        ctx.fillRect(gpx + 22, gb.y + 6, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(gpx + 7,  gb.y + 8, 3, 4);
        ctx.fillRect(gpx + 24, gb.y + 8, 3, 4);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(gpx + 4,  gb.y + 5); ctx.lineTo(gpx + 12, gb.y + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gpx + 30, gb.y + 5); ctx.lineTo(gpx + 22, gb.y + 8); ctx.stroke();
        const ft = s.frame % 18 < 9;
        ctx.fillStyle = '#3a1800';
        ctx.fillRect(gpx + (ft ? 1 : 4),  gb.y + 30, 12, 8);
        ctx.fillRect(gpx + (ft ? 21 : 18), gb.y + 30, 12, 8);
      }

      // Mario
      const mx2 = m.x - sx;
      const wf = Math.floor(s.frame / 5) % 3;
      const moving = Math.abs(m.vx) > 0.5;
      ctx.save();
      ctx.translate(mx2 + m.w / 2, m.y);
      if (!m.right) ctx.scale(-1, 1);
      ctx.fillStyle = '#cc1010'; ctx.fillRect(-14, 2, 30, 8); ctx.fillRect(-10, -6, 24, 8);
      ctx.fillStyle = '#f5a050'; ctx.fillRect(-10, 10, 22, 14);
      ctx.fillStyle = '#000';    ctx.fillRect(-2,  14, 4, 4);
      ctx.fillStyle = '#e08030'; ctx.fillRect(2,   18, 6, 4);
      ctx.fillStyle = '#3a1800'; ctx.fillRect(-8,  22, 18, 4);
      ctx.fillStyle = '#0040d0'; ctx.fillRect(-14, 24, 30, 16);
      ctx.fillStyle = '#cc1010'; ctx.fillRect(-16, 24, 4, 12); ctx.fillRect(14, 24, 4, 12);
      ctx.fillStyle = '#f8d020'; ctx.fillRect(-4, 26, 5, 5);   ctx.fillRect(2, 26, 5, 5);
      ctx.fillStyle = '#0040d0';
      if (!moving || !m.onGround) {
        ctx.fillRect(-12, 40, 12, 12); ctx.fillRect(2, 40, 12, 12);
      } else if (wf === 0) {
        ctx.fillRect(-14, 39, 12, 12); ctx.fillRect(4, 41, 12, 12);
      } else if (wf === 1) {
        ctx.fillRect(-12, 40, 12, 12); ctx.fillRect(2, 40, 12, 12);
      } else {
        ctx.fillRect(-10, 41, 12, 12); ctx.fillRect(0, 39, 12, 12);
      }
      ctx.fillStyle = '#3a1800';
      ctx.fillRect(-16, 51, 14, 7); ctx.fillRect(4, 51, 14, 7);
      ctx.restore();

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, CW, 36);
      ctx.fillStyle = 'white'; ctx.font = 'bold 14px monospace';
      ctx.fillText(`x${s.lives}`, 30, 23);
      ctx.fillStyle = '#ff4444'; ctx.font = 'bold 16px monospace'; ctx.fillText('♥', 12, 24);
      ctx.fillStyle = 'white';   ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center'; ctx.fillText(String(s.score), CW / 2, 23); ctx.textAlign = 'left';
      ctx.fillText(`○ ${s.coins.filter(c => c.collected).length}/${s.coins.length}`, CW - 108, 23);
      const prog = Math.min(m.x / 3150, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(CW / 2 - 90, 28, 180, 5);
      ctx.fillStyle = '#44ff88'; ctx.fillRect(CW / 2 - 90, 28, 180 * prog, 5);

      if (s.phase !== 'play') {
        ctx.fillStyle = 'rgba(0,0,0,0.68)'; ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = 'center';
        if (s.phase === 'dead') {
          ctx.fillStyle = '#ff5555'; ctx.font = 'bold 44px monospace'; ctx.fillText('游戏结束', CW / 2, CH / 2 - 30);
          ctx.fillStyle = 'white';   ctx.font = '20px monospace';      ctx.fillText(`得分: ${s.score}`, CW / 2, CH / 2 + 10);
        } else {
          ctx.fillStyle = '#f8d020'; ctx.font = 'bold 36px monospace'; ctx.fillText('恭喜通关！', CW / 2, CH / 2 - 30);
          ctx.fillStyle = 'white';   ctx.font = '20px monospace';      ctx.fillText(`最终得分: ${s.score}`, CW / 2, CH / 2 + 10);
        }
        ctx.fillStyle = '#aaffaa'; ctx.font = '16px monospace'; ctx.fillText('按 R 键重新开始', CW / 2, CH / 2 + 48);
        ctx.textAlign = 'left';
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="mario-app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0d0d1a', height: '100%', padding: '6px 0' }}>
      <div style={{ color: '#888', fontSize: 12, marginBottom: 5 }}>
        ← → 移动 &nbsp;·&nbsp; ↑ / 空格 跳跃 &nbsp;·&nbsp; 踩怪物 +200 &nbsp;·&nbsp; R 重新开始
      </div>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        tabIndex={0}
        onClick={() => canvasRef.current?.focus()}
        style={{ border: '2px solid #333', display: 'block', outline: 'none' }}
      />
    </div>
  );
}
