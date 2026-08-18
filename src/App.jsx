import React, { useState } from 'react';
import './index.css';

import BootScreen from './components/BootScreen';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';

import TerminalApp from './components/apps/TerminalApp';
import CalculatorApp from './components/apps/CalculatorApp';
import TrashApp from './components/apps/TrashApp';
import MusicPlayerApp from './components/apps/MusicPlayerApp';
import MinesweeperApp from './components/apps/MinesweeperApp';
import MemoryApp from './components/apps/MemoryApp';
import CommunityApp from './components/apps/CommunityApp';
import ChatBox from './components/ChatBox';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [apps, setApps] = useState([
    { id: 'Terminal', title: 'Terminal', isOpen: false, zIndex: 1, position: { x: 50, y: 50 }, width: 450, height: 320 },
    { id: 'Calculator', title: 'Calculator', isOpen: false, zIndex: 2, position: { x: 300, y: 100 }, width: 280, height: 380 },
    { id: 'Trash', title: 'Trash', isOpen: false, zIndex: 3, position: { x: 150, y: 250 }, width: 400, height: 250 },
    { id: 'Music', title: 'Music Player', isOpen: false, zIndex: 4, position: { x: 550, y: 150 }, width: 320, height: 420 },
    { id: 'Minesweeper', title: 'Minesweeper', isOpen: false, zIndex: 5, position: { x: 200, y: 80 }, width: 310, height: 400 },
    { id: 'Memory', title: 'Memory Match', isOpen: false, zIndex: 6, position: { x: 400, y: 120 }, width: 360, height: 460 },
    { id: 'Community', title: 'Community', isOpen: false, zIndex: 7, position: { x: 100, y: 50 }, width: 850, height: 500 }
  ]);

  const [activeZIndex, setActiveZIndex] = useState(10);
  const [chatMessage, setChatMessage] = useState(null);

  if (isBooting) {
    return <BootScreen onComplete={() => {
      setIsBooting(false);
      setTimeout(() => {
        setChatMessage({ name: 'ENNA', message: "it's been a long time since i used this computer" });
      }, 1000);
    }} />;
  }

  const toggleApp = (id) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        if (!app.isOpen) {
          if (id === 'Trash') {
            setChatMessage({ name: 'Enna', message: 'i hated putting that in here' });
          }
          setActiveZIndex(prev => prev + 1);
          return { ...app, isOpen: true, zIndex: activeZIndex + 1 };
        }
        setActiveZIndex(prev => prev + 1);
        return { ...app, zIndex: activeZIndex + 1 };
      }
      return app;
    }));
  };

  const closeApp = (id) => {
    setApps(apps.map(app => app.id === id ? { ...app, isOpen: false } : app));
  };

  const focusApp = (id) => {
    setActiveZIndex(prev => prev + 1);
    setApps(apps.map(app => app.id === id ? { ...app, zIndex: activeZIndex + 1 } : app));
  };

  return (
    <>
      <TopBar />
      <div className="desktop">
        <DesktopIcon icon="description" label="Readme.txt" onClick={() => toggleApp('Terminal')} />
        <DesktopIcon icon="calculate" label="Calculator" onClick={() => toggleApp('Calculator')} />
        <DesktopIcon icon="grid_on" label="Minesweeper" onClick={() => toggleApp('Minesweeper')} />
        <DesktopIcon icon="extension" label="Memory" onClick={() => toggleApp('Memory')} />
        <DesktopIcon icon="delete" label="Trash" onClick={() => toggleApp('Trash')} />
        <DesktopIcon icon="people_alt" label="Community" onClick={() => toggleApp('Community')} />
      </div>

      {/* Render open windows */}
      {apps.filter(a => a.isOpen).map(app => (
        <Window
          key={app.id}
          title={app.title}
          defaultPosition={app.position}
          width={app.width}
          height={app.height}
          zIndex={app.zIndex}
          onClose={() => closeApp(app.id)}
          onFocus={() => focusApp(app.id)}
        >
          {app.id === 'Terminal' && <TerminalApp />}
          {app.id === 'Calculator' && <CalculatorApp />}
          {app.id === 'Trash' && <TrashApp />}
          {app.id === 'Music' && <MusicPlayerApp />}
          {app.id === 'Minesweeper' && <MinesweeperApp />}
          {app.id === 'Memory' && <MemoryApp />}
          {app.id === 'Community' && <CommunityApp />}
        </Window>
      ))}

      <Dock toggleApp={toggleApp} />

      {chatMessage && (
        <ChatBox
          name={chatMessage.name}
          message={chatMessage.message}
          onClose={() => setChatMessage(null)}
        />
      )}
    </>
  );
}

export default App;
