import React from 'react';

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

export default DesktopIcon;
