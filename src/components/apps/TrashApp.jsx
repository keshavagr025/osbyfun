import React from 'react';

const TrashApp = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <div style={{ textAlign: 'center' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ffb74d' }}>folder</span>
      <p style={{ fontSize: '14px', marginTop: '4px' }}>DO NOT<br/>OPEN</p>
    </div>
  </div>
);

export default TrashApp;
