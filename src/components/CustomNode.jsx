// src/components/CustomNode.jsx
import React, { useState } from 'react';
import { Handle } from 'reactflow';

function CustomNode({ data, id, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [showParamsModal, setShowParamsModal] = useState(false);
  const [params, setParams] = useState(data.params || {});

  const hasParams = Object.keys(params).length > 0;

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

  const handleParamChange = (paramName, value) => {
    // Сохраняем как есть (строкой)
    const newParams = { ...params, [paramName]: value };
    setParams(newParams);
    data.params = newParams;
  };

  const saveParams = () => {
    // Преобразуем строковые значения в числа, где это возможно
    const convertedParams = {};
    for (const [key, value] of Object.entries(params)) {
      const num = parseFloat(value);
      convertedParams[key] = isNaN(num) ? value : num;
    }
    data.params = convertedParams;
    setParams(convertedParams);
    setShowParamsModal(false);
  };

  const getParamFields = () => {
    const opLabel = label.toLowerCase();
    const fields = [];

    // Сверление
    if (opLabel.includes('сверление')) {
      fields.push(
        { name: 'diameter', label: 'Диаметр (мм)', type: 'number', default: 0.8, placeholder: '0.3-3.0' },
        { name: 'speed', label: 'Скорость (об/мин)', type: 'number', default: 12000, placeholder: '8000-15000' },
        { name: 'feed', label: 'Подача (мм/об)', type: 'number', default: 0.05, placeholder: '0.01-0.2' }
      );
    }
    // Травление
    if (opLabel.includes('травление')) {
      fields.push(
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 45, placeholder: '40-50' },
        { name: 'speed', label: 'Скорость (м/мин)', type: 'number', default: 1.2, placeholder: '0.5-2.5' }
      );
    }
    // Гальваника
    if (opLabel.includes('гальваническое осаждение') || opLabel.includes('гальваническое меднение')) {
      fields.push(
        { name: 'thickness', label: 'Толщина (мкм)', type: 'number', default: 25, placeholder: '≥20 для ДПП' },
        { name: 'current_density', label: 'Плотность тока (А/дм²)', type: 'number', default: 2.0, placeholder: '0.5-3.5' },
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 25, placeholder: '20-30' }
      );
    }
    // Прессование
    if (opLabel.includes('прессование')) {
      fields.push(
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 185, placeholder: '170-190' },
        { name: 'pressure', label: 'Давление (кг/см²)', type: 'number', default: 25, placeholder: '20-30' }
      );
    }
    // Пайка
    if (opLabel.includes('пайка')) {
      fields.push(
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 240, placeholder: '240-260' }
      );
    }
    // Химическое осаждение
    if (opLabel.includes('химическое осаждение')) {
      fields.push(
        { name: 'ph', label: 'pH', type: 'number', default: 12.5, placeholder: '12-13' },
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 22, placeholder: '20-25' },
        { name: 'time', label: 'Время (мин)', type: 'number', default: 20, placeholder: '15-30' }
      );
    }
    // Нанесение фоторезиста
    if (opLabel.includes('нанесение фоторезиста')) {
      fields.push(
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 110, placeholder: '100-120' },
        { name: 'speed', label: 'Скорость (м/мин)', type: 'number', default: 0.5, placeholder: '0.3-0.8' }
      );
    }
    // Экспонирование
    if (opLabel.includes('экспонирование')) {
      fields.push(
        { name: 'time', label: 'Время (с)', type: 'number', default: 30, placeholder: '20-40' },
        { name: 'power', label: 'Мощность (Вт)', type: 'number', default: 500, placeholder: '400-600' }
      );
    }
    // Проявление
    if (opLabel.includes('проявление')) {
      fields.push(
        { name: 'temperature', label: 'Температура (°C)', type: 'number', default: 25, placeholder: '23-27' },
        { name: 'time', label: 'Время (мин)', type: 'number', default: 2, placeholder: '1-3' }
      );
    }
    // Паяльная маска
    if (opLabel.includes('паяльная маска')) {
      fields.push(
        { name: 'thickness', label: 'Толщина (мкм)', type: 'number', default: 25, placeholder: '20-30' }
      );
    }

    // === ДОБАВЛЕНО: для кастомных операций — показываем существующие параметры ===
    if (fields.length === 0 && Object.keys(params).length > 0) {
      // Кастомная операция — показываем все существующие параметры
      for (const [key, value] of Object.entries(params)) {
        fields.push({
          name: key,
          label: key,
          type: typeof value === 'number' ? 'number' : 'text',
          default: value,
          placeholder: ''
        });
      }
    }

    return fields;
  };

  const paramFields = getParamFields();

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position="top" style={{ background: '#555', width: '10px', height: '10px' }} />

      <div
        style={{
          background: '#fff',
          border: selected ? '3px solid #4CAF50' : '1px solid #777',
          borderRadius: '8px',
          padding: '12px 16px',           // ↑ увеличены отступы
          minWidth: '180px',              // ↑ минимальная ширина
          maxWidth: '260px',              // ↑ максимальная ширина
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          position: 'relative',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          lineHeight: '1.4'               // ↑ добавлен межстрочный интервал
        }}
        onDoubleClick={handleDoubleClick}
      >
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
            {/* Отображение ВСЕХ параметров */}
            {Object.keys(params).length > 0 && (
              <div style={{ fontSize: '10px', color: '#888', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '4px' }}>
                {/* Английские и русские названия параметров */}

                {/* Температура */}
                {(params.temperature !== undefined || params.температура !== undefined) &&
                  <span>🌡️ {params.temperature || params.температура}°C </span>}

                {/* Диаметр */}
                {(params.diameter !== undefined || params.диаметр !== undefined) &&
                  <span>🔧 Ø{params.diameter || params.диаметр}мм </span>}

                {/* Толщина */}
                {(params.thickness !== undefined || params.толщина !== undefined) &&
                  <span>📏 {params.thickness || params.толщина}мкм </span>}

                {/* pH */}
                {(params.ph !== undefined || params.ph !== undefined) &&
                  <span>🧪 pH={params.ph} </span>}

                {/* Скорость (speed/скорость) */}
                {(params.speed !== undefined || params.скорость !== undefined) &&
                  <span>⚡ {params.speed || params.скорость} </span>}

                {/* Время */}
                {(params.time !== undefined || params.время !== undefined) &&
                  <span>⏱️ {params.time || params.время}с </span>}

                {/* Давление */}
                {(params.pressure !== undefined || params.давление !== undefined) &&
                  <span>💨 {params.pressure || params.давление} кг/см² </span>}

                {/* Плотность тока */}
                {(params.current_density !== undefined || params.плотность_тока !== undefined) &&
                  <span>⚡ {params.current_density || params.плотность_тока} А/дм² </span>}

                {/* Подача */}
                {(params.feed !== undefined || params.подача !== undefined) &&
                  <span>📐 {params.feed || params.подача} мм/об </span>}

                {/* Мощность */}
                {(params.power !== undefined || params.мощность !== undefined) &&
                  <span>💡 {params.power || params.мощность} Вт </span>}

                {/* Частота */}
                {(params.frequency !== undefined || params.частота !== undefined) &&
                  <span>📡 {params.frequency || params.частота} Гц </span>}

                {/* Любые другие числовые параметры (кастомные) — проверяем оба варианта */}
                {Object.entries(params).map(([key, value]) => {
                  const standardKeys = ['temperature', 'температура', 'diameter', 'диаметр', 'thickness', 'толщина',
                    'ph', 'speed', 'скорость', 'time', 'время', 'pressure', 'давление',
                    'current_density', 'плотность_тока', 'feed', 'подача', 'power', 'мощность',
                    'frequency', 'частота'];
                  if (standardKeys.includes(key)) return null;
                  if (typeof value === 'number') {
                    return <span key={key}>⚙️ {key}={value} </span>;
                  }
                  return null;
                })}
              </div>
            )}
          </>
        )}
      </div>

      {hasParams && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowParamsModal(true);
          }}
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          title="Параметры операции"
        >
          ⚙️
        </button>
      )}

      <Handle type="source" position="bottom" style={{ background: '#555', width: '10px', height: '10px' }} />

      {showParamsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '350px',
            maxWidth: '90%'
          }}>
            <h4 style={{ marginTop: 0 }}>Параметры операции</h4>
            <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>{label}</div>

            {paramFields.map(field => (
              <div key={field.name} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={params[field.name] !== undefined ? params[field.name] : field.default}
                  onChange={(e) => {
                    // Просто сохраняем то, что ввел пользователь, без валидации
                    const val = e.target.value;
                    handleParamChange(field.name, val);
                  }}
                  placeholder={field.placeholder || ''}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setShowParamsModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={saveParams}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomNode;