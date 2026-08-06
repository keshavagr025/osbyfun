import React, { useState } from 'react';

const TrashApp = () => {
  const [folderDepth, setFolderDepth] = useState(0);

  const handleFolderClick = () => {
    if (folderDepth < 3) {
      setFolderDepth(folderDepth + 1);
    }
  };

  const getFolderLabel = () => {
    if (folderDepth === 0) return 'DO NOT\nOPEN';
    if (folderDepth === 1) return 'I SAID\nNO';
    if (folderDepth === 2) return 'LAST\nWARNING';
    return '';
  };

  if (folderDepth >= 3) {
    return (
      <div style={{ backgroundColor: '#0f2913', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', margin: '-12px', color: '#4caf50', fontFamily: '"VT323", monospace', textAlign: 'center' }}>
        <p style={{ fontSize: '24px', margin: '0 0 10px 0', textShadow: '2px 2px 0px #000' }}>'The dog stirs and lifts his head.'</p>
        <p style={{ fontSize: '24px', margin: '0 0 40px 0', textShadow: '2px 2px 0px #000' }}>'...Dash?'</p>
        
        {/* Placeholder for the dog image - You can replace this src with your actual dog.png asset */}
        <img 
          src="/dog.png" 
          alt="Cool Dog" 
          style={{ width: '180px', imageRendering: 'pixelated', filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))' }} 
          onError={(e) => { 
            e.target.style.display = 'none'; 
            e.target.nextSibling.style.display = 'block'; 
          }} 
        />
        <div style={{ fontSize: '100px', display: 'none' }}>
          🐶🕶️
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
      <div 
        style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.1s' }} 
        onClick={handleFolderClick}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} 
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#ffb74d', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>folder</span>
        <p style={{ fontSize: '14px', marginTop: '4px', whiteSpace: 'pre-wrap', fontWeight: 'bold', fontFamily: 'Pixelify Sans, sans-serif' }}>
          {getFolderLabel()}
        </p>
      </div>
    </div>
  );
};

export default TrashApp;
