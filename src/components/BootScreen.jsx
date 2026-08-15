import React, { useState, useEffect } from 'react';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); // Wait a bit at 100% before closing
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 8) + 2);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="boot-screen">
      <div className="boot-logo-container">
        <span className="material-symbols-outlined boot-logo">cruelty_free</span>
      </div>

      <div className="boot-text-container">
        <p className="boot-title">SYSTEM NOTICE</p>
        <p className="boot-desc">bunny OS has sound. Headphones recommended.</p>
        <p className="boot-desc" style={{ marginTop: '16px' }}>Fullscreen puts the browser away<br />and leaves only the desktop.</p>

        <button className="boot-fullscreen-btn" onClick={enterFullscreen}>
          Enter Fullscreen
        </button>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>Esc leaves fullscreen whenever you want.</p>
      </div>

      <div className="boot-progress-container">
        <div className="boot-progress-bar-bg">
          <div className="boot-progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="boot-progress-text">{progress}%</p>
        <p className="boot-loading-text">Starting bunny OS...</p>
      </div>
    </div>
  );
};

export default BootScreen;
