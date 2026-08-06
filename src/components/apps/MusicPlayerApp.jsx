import React, { useState } from 'react';

const MusicPlayerApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
      <div style={{ 
        width: '120px', height: '120px', borderRadius: '50%', background: '#111', 
        border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        animation: isPlaying ? 'spin 4s linear infinite' : 'none'
      }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#4caf50', border: '2px solid #111' }}></div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', margin: '0' }}>GREEN</h2>
        <p style={{ fontSize: '16px', color: '#666' }}>Pixel Records. Stereo audio.</p>
      </div>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        style={{ 
          background: isPlaying ? '#ff5f56' : '#27c93f', 
          color: '#fff',
          border: '2px solid #000', 
          padding: '8px 24px', 
          fontFamily: 'Pixelify Sans', 
          fontSize: '18px', 
          cursor: 'pointer', 
          boxShadow: '2px 2px 0px #000',
          transition: 'transform 0.1s, box-shadow 0.1s'
        }}
        onMouseDown={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
        onMouseUp={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MusicPlayerApp;
