import { useThemeStore } from '../themeStore';

beforeEach(() => {
  useThemeStore.setState({ darkMode: false });
});

describe('themeStore', () => {
  it('starts with darkMode false', () => {
    expect(useThemeStore.getState().darkMode).toBe(false);
  });

  it('toggleDarkMode flips the value', () => {
    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().darkMode).toBe(true);
    useThemeStore.getState().toggleDarkMode();
    expect(useThemeStore.getState().darkMode).toBe(false);
  });

  it('setDarkMode sets the value directly', () => {
    useThemeStore.getState().setDarkMode(true);
    expect(useThemeStore.getState().darkMode).toBe(true);
    useThemeStore.getState().setDarkMode(false);
    expect(useThemeStore.getState().darkMode).toBe(false);
  });
});
