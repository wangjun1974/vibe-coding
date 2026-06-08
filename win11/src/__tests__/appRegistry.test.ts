import {
  APP_REGISTRY,
  PINNED_APPS,
  APP_COMPONENTS,
  APP_DEFAULTS,
  DESKTOP_SHORTCUTS,
  getAppById,
} from '../appRegistry';

describe('APP_REGISTRY', () => {
  it('contains 9 app definitions', () => {
    expect(APP_REGISTRY).toHaveLength(9);
  });

  it('has all required fields on every entry', () => {
    for (const app of APP_REGISTRY) {
      expect(app).toHaveProperty('id');
      expect(app).toHaveProperty('name');
      expect(app).toHaveProperty('icon');
      expect(app).toHaveProperty('component');
      expect(app).toHaveProperty('width');
      expect(app).toHaveProperty('height');
      expect(app).toHaveProperty('minWidth');
      expect(app).toHaveProperty('minHeight');
    }
  });

  it('has unique ids', () => {
    const ids = APP_REGISTRY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has minWidth <= width and minHeight <= height for every app', () => {
    for (const app of APP_REGISTRY) {
      expect(app.minWidth).toBeLessThanOrEqual(app.width);
      expect(app.minHeight).toBeLessThanOrEqual(app.height);
    }
  });
});

describe('PINNED_APPS', () => {
  it('has same length as APP_REGISTRY', () => {
    expect(PINNED_APPS).toHaveLength(APP_REGISTRY.length);
  });

  it('contains only id, name, icon fields', () => {
    for (const app of PINNED_APPS) {
      expect(Object.keys(app).sort()).toEqual(['icon', 'id', 'name']);
    }
  });
});

describe('APP_COMPONENTS', () => {
  it('has one entry per registry app', () => {
    expect(Object.keys(APP_COMPONENTS)).toHaveLength(APP_REGISTRY.length);
  });

  it('maps to functions', () => {
    for (const comp of Object.values(APP_COMPONENTS)) {
      expect(typeof comp).toBe('function');
    }
  });
});

describe('APP_DEFAULTS', () => {
  it('has one entry per registry app', () => {
    expect(Object.keys(APP_DEFAULTS)).toHaveLength(APP_REGISTRY.length);
  });

  it('has correct dimensions for calculator', () => {
    expect(APP_DEFAULTS['calculator']).toEqual({
      width: 320,
      height: 500,
      minWidth: 280,
      minHeight: 420,
    });
  });

  it('matches APP_REGISTRY values', () => {
    for (const app of APP_REGISTRY) {
      const defaults = APP_DEFAULTS[app.id];
      expect(defaults.width).toBe(app.width);
      expect(defaults.height).toBe(app.height);
      expect(defaults.minWidth).toBe(app.minWidth);
      expect(defaults.minHeight).toBe(app.minHeight);
    }
  });
});

describe('DESKTOP_SHORTCUTS', () => {
  it('contains 4 shortcuts', () => {
    expect(DESKTOP_SHORTCUTS).toHaveLength(4);
  });

  it('references valid apps', () => {
    for (const shortcut of DESKTOP_SHORTCUTS) {
      expect(APP_REGISTRY.find((a) => a.id === shortcut.appId)).toBeDefined();
    }
  });
});

describe('getAppById', () => {
  it('returns the correct app for a known id', () => {
    const calc = getAppById('calculator');
    expect(calc).toBeDefined();
    expect(calc!.name).toBe('计算器');
  });

  it('returns undefined for unknown id', () => {
    expect(getAppById('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getAppById('')).toBeUndefined();
  });

  it('returns the same reference as APP_REGISTRY', () => {
    const app = getAppById('explorer');
    expect(app).toBe(APP_REGISTRY[0]);
  });
});
