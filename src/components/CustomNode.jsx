import React, { useState } from 'react';
import { Handle } from 'reactflow';

function CustomNode({ data, id, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.label = label;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.label = label;
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: selected ? '3px solid #4CAF50' : '1px solid #777',
        borderRadius: '8px',
        padding: '10px 15px',
        minWidth: '180px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position="top" style={{ background: '#555', width: '10px', height: '10px' }} />
      
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: '100%',
            padding: '8px',
            border: '2px solid #4CAF50',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '14px'
          }}
        />
      ) : (
        <>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{label}</div>
          {data.category && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
              {data.category}
            </div>
          )}
        </>
      )}
      
      <Handle type="source" position="bottom" style={{ background: '#555', width: '10px', height: '10px' }} />
    </div>
  );
}

export default CustomNode;