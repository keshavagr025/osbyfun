import React from 'react';
import Draggable from 'react-draggable';

const Window = ({ title, onClose, children, defaultPosition, width = 400, height = 300, zIndex, onFocus }) => {
  return (
    <Draggable handle=".window-header" defaultPosition={defaultPosition} onMouseDown={onFocus}>
      <div className="retro-window" style={{ width, height, zIndex }}>
        <div className="window-header">
          <span>{title}</span>
          <div className="window-controls">
            <div className="window-btn btn-min"></div>
            <div className="window-btn btn-max"></div>
            <div className="window-btn btn-close" onClick={onClose} onMouseDown={(e) => e.stopPropagation()}></div>
          </div>
        </div>
        <div className="window-content" onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;
