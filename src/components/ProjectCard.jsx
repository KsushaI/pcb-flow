import React from 'react';

function ProjectCard({ project, onOpen, onDelete }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px',
      width: '250px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      transition: 'all 0.3s',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        {project.name}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Тип: {project.type} | Кл.{project.accuracyClass}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
          {new Date(project.date).toLocaleDateString('ru-RU')}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <button
          onClick={() => onOpen(project.id)}
          style={{
            padding: '8px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Открыть
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;