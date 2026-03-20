import React, { useState } from 'react';

function KnowledgeBase({ boardType, accuracyClass }) {
  const [filter, setFilter] = useState('all');
  
  // База знаний с правилами из источников
  const rules = [
    {
      id: 1,
      category: 'sequence',
      title: 'Сверление до нанесения фоторезиста',
      description: 'Сверление должно выполняться до нанесения фоторезиста',
      source: 'Резонит, ОПП',
      types: ['ОПП', 'ДПП', 'МПП'],
      severity: 'error'
    },
    {
      id: 2,
      category: 'sequence',
      title: 'Травление после проявления',
      description: 'Травление меди выполняется только после проявления фоторезиста',
      source: 'Резонит, ОПП',
      types: ['ОПП', 'ДПП'],
      severity: 'error'
    },
    {
      id: 3,
      category: 'mandatory',
      title: 'Химическое осаждение для ДПП',
      description: 'В двусторонних платах после сверления обязательно химическое осаждение меди',
      source: 'Резонит, ДПП',
      types: ['ДПП'],
      severity: 'error'
    },
    {
      id: 4,
      category: 'parameter',
      title: 'Толщина металлизации ≥20 мкм',
      description: 'Толщина гальванической меди в отверстиях ДПП должна быть не менее 20 мкм',
      source: 'ГОСТ 23752-79',
      types: ['ДПП', 'МПП'],
      severity: 'error'
    },
    {
      id: 5,
      category: 'parameter',
      title: 'IPC Class 3 ≥25 мкм',
      description: 'Для высоконадежных изделий требуется толщина металлизации не менее 25 мкм',
      source: 'IPC-6012B Class 3',
      types: ['ДПП', 'МПП'],
      severity: 'warning'
    },
    {
      id: 6,
      category: 'parameter',
      title: 'FR-4 ≤260°C',
      description: 'При пайке плат из FR-4 температура не должна превышать 260°C',
      source: 'Медведев А.М., стр. 41',
      types: ['ОПП', 'ДПП', 'МПП'],
      severity: 'warning'
    },
    {
      id: 7,
      category: 'accuracy',
      title: `Параметры для ${accuracyClass} класса`,
      description: `Для ${accuracyClass} класса точности ширина проводника и зазор должны соответствовать ГОСТ`,
      source: 'ГОСТ 23751-86',
      types: ['ОПП', 'ДПП', 'МПП'],
      severity: 'info'
    },
    {
      id: 8,
      category: 'accuracy',
      title: 'Сухая маска для классов >3',
      description: 'Для классов точности выше 3 сухая пленочная маска не применяется',
      source: 'Резонит',
      types: ['ОПП', 'ДПП'],
      severity: 'error'
    },
    {
      id: 9,
      category: 'chemical',
      title: 'pH меднения 12-13',
      description: 'Для химического меднения с формальдегидом pH должен быть 12-13',
      source: 'Черник А.А., стр. 18',
      types: ['ДПП', 'МПП'],
      severity: 'error'
    }
  ];

  const filteredRules = rules
    .filter(r => filter === 'all' || r.category === filter)
    .filter(r => r.types.includes(boardType));

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196F3';
      default: return '#666';
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '15px',
      backgroundColor: '#fafafa',
      height: '100%',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>📚 Подсказки</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '5px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="all">Все</option>
          <option value="sequence">Последовательность</option>
          <option value="mandatory">Обязательные</option>
          <option value="parameter">Параметры</option>
          <option value="accuracy">Точность</option>
          <option value="chemical">Химия</option>
        </select>
      </div>

      <div style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
        Для {boardType}, класс {accuracyClass}
      </div>

      {filteredRules.map(rule => (
        <div
          key={rule.id}
          style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            backgroundColor: 'white',
            borderLeft: `4px solid ${getSeverityColor(rule.severity)}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>{rule.title}</strong>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0'
            }}>
              {rule.severity}
            </span>
          </div>
          
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
            {rule.description}
          </div>
          
          <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
            📖 {rule.source}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KnowledgeBase;