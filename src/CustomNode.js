import React, { useState } from 'react';
import { Handle } from 'reactflow';

function CustomNode({ data }) {
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
        border: '1px solid #777',
        borderRadius: '5px',
        padding: '10px',
        minWidth: '150px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handle для входящих соединений - СВЕРХУ */}
      <Handle 
        type="target" 
        position="top" 
        style={{ background: '#555' }} 
      />
      
      {/* Handle для исходящих соединений - СНИЗУ */}
      <Handle 
        type="source" 
        position="bottom" 
        style={{ background: '#555' }} 
      />
      
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
            padding: '4px',
            border: '1px solid #4CAF50',
            borderRadius: '3px',
            textAlign: 'center'
          }}
        />
      ) : (
        <div style={{ fontWeight: 'bold' }}>{label}</div>
      )}
    </div>
  );
}

export default CustomNode;