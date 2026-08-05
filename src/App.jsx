import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './index.css';

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="material-symbols-outlined logo-icon">cruelty_free</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
      </div>
      <div className="top-bar-right">
        <span className="material-symbols-outlined">wifi</span>
        <span className="material-symbols-outlined">battery_full</span>
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
};

const DockIcon = ({ icon, label, isActive, onClick }) => {
  return (
    <div className="dock-icon-container" onClick={onClick}>
      <div className={`dock-icon glass ${isActive ? 'active' : ''}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {isActive && <div className="dock-icon-indicator" />}
      <div className="dock-tooltip">{label}</div>
    </div>
  );
};

const Dock = ({ toggleApp }) => {
  return (
    <div className="dock glass">
      <DockIcon icon="terminal" label="Terminal" isActive={true} onClick={() => toggleApp('Terminal')} />
      <DockIcon icon="language" label="Browser" isActive={false} onClick={() => toggleApp('Browser')} />
      <DockIcon icon="folder" label="Files" isActive={false} onClick={() => toggleApp('Trash')} />
      <DockIcon icon="queue_music" label="Music Player" isActive={false} onClick={() => toggleApp('Music')} />
      <DockIcon icon="calculate" label="Calculator" isActive={false} onClick={() => toggleApp('Calculator')} />
    </div>
  );
};

const DesktopIcon = ({ icon, label, onClick }) => {
  return (
    <div className="desktop-icon-container" onDoubleClick={onClick}>
      <div className="desktop-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

const Window = ({ title, onClose, children, defaultPosition, width = 400, height = 300, zIndex, onFocus }) => {
  return (
    <Draggable handle=".window-header" defaultPosition={defaultPosition} onMouseDown={onFocus}>
      <div className="retro-window" style={{ width, height, zIndex }}>
        <div className="window-header">
          <span>{title}</span>
          <div className="window-controls">
            <div className="window-btn btn-min"></div>
            <div className="window-btn btn-max"></div>
            <div className="window-btn btn-close" onClick={onClose}></div>
          </div>
        </div>
        <div className="window-content" onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

// Apps content
const TerminalApp = () => (
  <div style={{ background: '#111', color: '#33ff00', height: '100%', padding: '8px', margin: '-12px', fontFamily: '"VT323", monospace', fontSize: '20px' }}>
    <p>Welcome to Retrium OS Terminal</p>
    <p>[INFO] Type "help" for the full command list.</p>
    <p style={{ color: '#ff3366' }}>dash@retrium-os:~$ <span className="animate-pulse">_</span></p>
  </div>
);

const CalculatorApp = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
    <div style={{ background: '#fff', border: '2px solid #000', padding: '8px', textAlign: 'right', fontSize: '24px' }}>0</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', flex: 1 }}>
      {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
        <button key={btn} style={{ background: '#e0e0e0', border: '2px solid #000', fontFamily: 'Pixelify Sans', fontSize: '20px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>
          {btn}
        </button>
      ))}
    </div>
  </div>
);

const TrashApp = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <div style={{ textAlign: 'center' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ffb74d' }}>folder</span>
      <p style={{ fontSize: '14px', marginTop: '4px' }}>DO NOT<br/>OPEN</p>
    </div>
  </div>
);

const MusicPlayerApp = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#111', border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#4caf50', border: '2px solid #111' }}></div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', margin: '0' }}>GREEN</h2>
      <p style={{ fontSize: '16px', color: '#666' }}>Pixel Records. Stereo audio.</p>
    </div>
    <button style={{ background: '#e0e0e0', border: '2px solid #000', padding: '4px 16px', fontFamily: 'Pixelify Sans', fontSize: '18px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>Play</button>
  </div>
);

function App() {
  const [apps, setApps] = useState([
    { id: 'Terminal', title: 'Terminal', isOpen: true, zIndex: 1, position: { x: 50, y: 50 } },
    { id: 'Calculator', title: 'Calculator', isOpen: true, zIndex: 2, position: { x: 300, y: 100 }, width: 250, height: 350 },
    { id: 'Trash', title: 'Trash', isOpen: true, zIndex: 3, position: { x: 150, y: 250 }, width: 400, height: 250 },
    { id: 'Music', title: 'Music Player', isOpen: true, zIndex: 4, position: { x: 500, y: 150 }, width: 300, height: 400 }
  ]);
  
  const [activeZIndex, setActiveZIndex] = useState(10);

  const toggleApp = (id) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        if (!app.isOpen) {
          setActiveZIndex(prev => prev + 1);
          return { ...app, isOpen: true, zIndex: activeZIndex + 1 };
        }
        return app; // Do not close on dock click, just focus maybe
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
        <DesktopIcon icon="delete" label="Trash" onClick={() => toggleApp('Trash')} />
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
        </Window>
      ))}

      <Dock toggleApp={toggleApp} />
    </>
  );
}

export default App;
