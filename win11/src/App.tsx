import { useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import { useWindowStore } from './store/windowStore';
import { useThemeStore } from './store/themeStore';
import './App.css';
import './components/Animations.css';

export default function App() {
  const [startOpen, setStartOpen] = useState(false);
  const { windows } = useWindowStore();
  const { darkMode } = useThemeStore();

  const toggleStart = useCallback(() => setStartOpen((v) => !v), []);
  const closeStart = useCallback(() => setStartOpen(false), []);

  return (
    <div className="os-root" data-theme={darkMode ? 'dark' : undefined} onClick={(e) => {
      if (!(e.target as HTMLElement).closest('.start-menu') &&
          !(e.target as HTMLElement).closest('.start-btn')) {
        closeStart();
      }
    }}>
      <Desktop />
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
      {startOpen && <StartMenu onClose={closeStart} />}
      <Taskbar onStartClick={toggleStart} startOpen={startOpen} />
    </div>
  );
}
