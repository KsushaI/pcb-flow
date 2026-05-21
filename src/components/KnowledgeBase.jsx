// src/components/KnowledgeBase.jsx
import React from 'react';

function KnowledgeBase({ warnings = [], hasValidated = false }) {
  // Фильтруем предупреждения — показываем только error и warning
  const filteredWarnings = warnings.filter(w => w.severity === 'error' || w.severity === 'warning');

  // Если верификация ещё не запускалась
  if (!hasValidated) {
    return (
      <div style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>💾</div>
        <div style={{ fontSize: '14px' }}>Нажмите «Сохранить» для сохранения и верификации техпроцесса</div>
      </div>
    );
  }

  // Если есть реальные предупреждения (error или warning)
  if (filteredWarnings.length > 0) {
    return (
      <div style={{ padding: '15px' }}>
        <h3 style={{ marginTop: 0, color: '#f44336', marginBottom: '15px' }}>
          ⚠️ Предупреждения ({filteredWarnings.length})
        </h3>
        {filteredWarnings.map((w, idx) => (
          <div key={idx} style={{
            borderLeft: `4px solid ${w.severity === 'error' ? '#f44336' : '#ff9800'}`,
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{w.description}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>📖 {w.source}</div>
            {w.details && <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{w.details}</div>}
          </div>
        ))}
      </div>
    );
  }

  // Если предупреждений нет
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '20px', color: '#4CAF50', fontWeight: 'bold' }}>Нарушений не найдено ✔</div>
    </div>
  );
}

export default KnowledgeBase;