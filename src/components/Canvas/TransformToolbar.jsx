import React from 'react';

const TransformToolbar = ({ currentMode, setMode }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: 10,
    }}>
      <h4>Transform Mode</h4>
      <button onClick={() => setMode('translate')} style={{ marginRight: '10px' }}>
        Move
      </button>
      <button onClick={() => setMode('rotate')} style={{ marginRight: '10px' }}>
        Rotate
      </button>
      <button onClick={() => setMode('scale')}>
        Scale
      </button>
    </div>
  );
};

export default TransformToolbar;
