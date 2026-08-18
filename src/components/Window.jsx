import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const Window = ({ title, onClose, children, defaultPosition, width = 400, height = 300, zIndex, onFocus }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" defaultPosition={defaultPosition}>
      <div ref={nodeRef} className="retro-window" style={{ width, height, zIndex }} onMouseDownCapture={onFocus}>
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
