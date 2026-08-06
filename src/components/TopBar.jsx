import React, { useState, useEffect } from 'react';

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

export default TopBar;
