import { useWindowStore } from '../windowStore';

const getState = () => useWindowStore.getState();

beforeEach(() => {
  useWindowStore.setState({ windows: [] });
});

describe('openWindow', () => {
  it('creates a window with correct fields', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const win = getState().windows[0];
    expect(win.app).toBe('calculator');
    expect(win.title).toBe('计算器');
    expect(win.icon).toBe('🔢');
    expect(win.id).toMatch(/^calculator-\d+$/);
  });

  it('applies defaults from APP_DEFAULTS', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const win = getState().windows[0];
    expect(win.width).toBe(320);
    expect(win.height).toBe(500);
    expect(win.minWidth).toBe(280);
    expect(win.minHeight).toBe(420);
  });

  it('uses fallback defaults for unknown app', () => {
    getState().openWindow('unknown', 'Unknown', '?');
    const win = getState().windows[0];
    expect(win.width).toBe(640);
    expect(win.height).toBe(480);
    expect(win.minWidth).toBe(320);
    expect(win.minHeight).toBe(240);
  });

  it('positions window within expected range', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const win = getState().windows[0];
    expect(win.x).toBeGreaterThanOrEqual(120);
    expect(win.x).toBeLessThanOrEqual(199);
    expect(win.y).toBeGreaterThanOrEqual(60);
    expect(win.y).toBeLessThanOrEqual(139);
  });

  it('new window is focused, not minimized, not maximized', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const win = getState().windows[0];
    expect(win.isFocused).toBe(true);
    expect(win.isMinimized).toBe(false);
    expect(win.isMaximized).toBe(false);
  });

  it('unfocuses existing windows', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const [first, second] = getState().windows;
    expect(first.isFocused).toBe(false);
    expect(second.isFocused).toBe(true);
  });

  it('assigns ascending zIndex', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const [first, second] = getState().windows;
    expect(second.zIndex).toBeGreaterThan(first.zIndex);
  });
});

describe('closeWindow', () => {
  it('removes the target window', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    getState().closeWindow(id);
    expect(getState().windows).toHaveLength(0);
  });

  it('does not affect other windows', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const calcId = getState().windows[0].id;
    getState().closeWindow(calcId);
    expect(getState().windows).toHaveLength(1);
    expect(getState().windows[0].app).toBe('notepad');
  });

  it('is a no-op for unknown id', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().closeWindow('nonexistent');
    expect(getState().windows).toHaveLength(1);
  });
});

describe('focusWindow', () => {
  it('sets focused and unminimized on target', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    getState().minimizeWindow(id);
    getState().focusWindow(id);
    const win = getState().windows[0];
    expect(win.isFocused).toBe(true);
    expect(win.isMinimized).toBe(false);
  });

  it('unfocuses other windows', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const calcId = getState().windows[0].id;
    getState().focusWindow(calcId);
    const [calc, notepad] = getState().windows;
    expect(calc.isFocused).toBe(true);
    expect(notepad.isFocused).toBe(false);
  });

  it('bumps zIndex above all others', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const calcId = getState().windows[0].id;
    getState().focusWindow(calcId);
    const [calc, notepad] = getState().windows;
    expect(calc.zIndex).toBeGreaterThan(notepad.zIndex);
  });
});

describe('minimizeWindow', () => {
  it('sets minimized and unfocused', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    getState().minimizeWindow(id);
    const win = getState().windows[0];
    expect(win.isMinimized).toBe(true);
    expect(win.isFocused).toBe(false);
  });

  it('does not change other windows', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const calcId = getState().windows[0].id;
    getState().minimizeWindow(calcId);
    const notepad = getState().windows[1];
    expect(notepad.isMinimized).toBe(false);
  });
});

describe('toggleMaximize', () => {
  it('toggles isMaximized', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    expect(getState().windows[0].isMaximized).toBe(false);
    getState().toggleMaximize(id);
    expect(getState().windows[0].isMaximized).toBe(true);
    getState().toggleMaximize(id);
    expect(getState().windows[0].isMaximized).toBe(false);
  });
});

describe('moveWindow', () => {
  it('updates position', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    getState().moveWindow(id, 300, 200);
    const win = getState().windows[0];
    expect(win.x).toBe(300);
    expect(win.y).toBe(200);
  });
});

describe('resizeWindow', () => {
  it('updates dimensions and position', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    const id = getState().windows[0].id;
    getState().resizeWindow(id, 500, 400, 100, 50);
    const win = getState().windows[0];
    expect(win.width).toBe(500);
    expect(win.height).toBe(400);
    expect(win.x).toBe(100);
    expect(win.y).toBe(50);
  });
});

describe('multi-window scenarios', () => {
  it('only the last opened window is focused', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    getState().openWindow('terminal', '终端', '⬛');
    const wins = getState().windows;
    expect(wins[0].isFocused).toBe(false);
    expect(wins[1].isFocused).toBe(false);
    expect(wins[2].isFocused).toBe(true);
  });

  it('focusing first window shifts focus correctly', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const calcId = getState().windows[0].id;
    getState().focusWindow(calcId);
    const wins = getState().windows;
    expect(wins[0].isFocused).toBe(true);
    expect(wins[1].isFocused).toBe(false);
  });

  it('minimizing focused window leaves none focused', () => {
    getState().openWindow('calculator', '计算器', '🔢');
    getState().openWindow('notepad', '记事本', '📝');
    const notepadId = getState().windows[1].id;
    getState().minimizeWindow(notepadId);
    const wins = getState().windows;
    expect(wins.every((w) => !w.isFocused)).toBe(true);
  });
});
