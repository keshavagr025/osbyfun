import React, { useState, useEffect } from 'react';
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
        <span className="material-symbols-outlined logo-icon">public</span>
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

const DockIcon = ({ icon, label, isActive }) => {
  return (
    <div className="dock-icon-container">
      <div className={`dock-icon glass ${isActive ? 'active' : ''}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {isActive && <div className="dock-icon-indicator" />}
      <div className="dock-tooltip">{label}</div>
    </div>
  );
};

const Dock = () => {
  return (
    <div className="dock glass">
      <DockIcon icon="terminal" label="Terminal" isActive={false} />
      <DockIcon icon="language" label="Browser" isActive={true} />
      <DockIcon icon="folder" label="Files" isActive={false} />
      <DockIcon icon="settings" label="Settings" isActive={false} />
      <DockIcon icon="delete" label="Trash" isActive={false} />
    </div>
  );
};

const DesktopIcon = ({ icon, label, onClick }) => {
  return (
    <div className="desktop-icon-container" onClick={onClick}>
      <div className="desktop-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

const Desktop = () => {
  return (
    <div className="desktop">
      <DesktopIcon icon="description" label="Readme.txt" />
      <DesktopIcon icon="folder_shared" label="Projects" />
      <DesktopIcon icon="calculate" label="Calculator" />
    </div>
  );
};

function App() {
  return (
    <>
      <TopBar />
      <Desktop />
      <Dock />
    </>
  );
}

export default App;
