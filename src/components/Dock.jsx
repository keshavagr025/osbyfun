import React from 'react';

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
      <DockIcon icon="grid_on" label="Minesweeper" isActive={false} onClick={() => toggleApp('Minesweeper')} />
      <DockIcon icon="extension" label="Memory" isActive={false} onClick={() => toggleApp('Memory')} />
    </div>
  );
};

export default Dock;
