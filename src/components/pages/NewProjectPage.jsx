import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function NewProjectPage({ addProject }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'ОПП',
    accuracyClass: '3',
    standard: 'ГОСТ 23752-79',
    material: 'FR-4',
    thickness: '1.6',
    foil: '35',
    options: {
      metalization: true,
      immersionGold: false,
      solderMask: true,
      marking: true
    },
    ipcClass: 'none',
    template: 'empty'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: uuidv4(),
      name: formData.name || `Проект ${new Date().toLocaleDateString()}`,
      type: formData.type,
      accuracyClass: formData.accuracyClass,
      material: formData.material,
      thickness: formData.thickness,
      foil: formData.foil,
      date: new Date().toISOString(),
      nodes: [],
      edges: []
    };
    
    addProject(newProject);
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Шапка */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Назад к проектам
        </button>
        <h1 style={{ marginTop: '20px' }}>🆕 Создание нового проекта</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Название проекта */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Название проекта
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Например: Плата управления двигателем"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Основные параметры */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ marginTop: 0 }}>Основные параметры</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Тип платы
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['ОПП', 'ДПП', 'МПП'].map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Класс точности
              </label>
              <select
                value={formData.accuracyClass}
                onChange={(e) => setFormData({...formData, accuracyClass: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                {[1,2,3,4,5].map(cls => (
                  <option key={cls} value={cls}>Класс {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Стандарт качества
              </label>
              <select
                value={formData.standard}
                onChange={(e) => setFormData({...formData, standard: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option>ГОСТ 23752-79</option>
                <option>IPC-6012B Class 2</option>
                <option>IPC-6012B Class 3</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Материал основания
              </label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option>FR-4</option>
                <option>PTFE</option>
                <option>Керамика</option>
                <option>Полиимид</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Толщина материала (мм)
              </label>
              <select
                value={formData.thickness}
                onChange={(e) => setFormData({...formData, thickness: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option>0.8</option>
                <option>1.0</option>
                <option>1.6</option>
                <option>2.0</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Толщина фольги (мкм)
              </label>
              <select
                value={formData.foil}
                onChange={(e) => setFormData({...formData, foil: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option>18</option>
                <option>35</option>
                <option>70</option>
              </select>
            </div>
          </div>
        </div>

        {/* Дополнительные параметры */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ marginTop: 0 }}>Дополнительные параметры</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.options.metalization}
                onChange={(e) => setFormData({
                  ...formData,
                  options: {...formData.options, metalization: e.target.checked}
                })}
              />
              Требуется металлизация отверстий
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.options.immersionGold}
                onChange={(e) => setFormData({
                  ...formData,
                  options: {...formData.options, immersionGold: e.target.checked}
                })}
              />
              Иммерсионное золото (ENIG)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.options.solderMask}
                onChange={(e) => setFormData({
                  ...formData,
                  options: {...formData.options, solderMask: e.target.checked}
                })}
              />
              Паяльная маска
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.options.marking}
                onChange={(e) => setFormData({
                  ...formData,
                  options: {...formData.options, marking: e.target.checked}
                })}
              />
              Маркировка
            </label>
          </div>
        </div>

        {/* Выбор шаблона */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ marginTop: 0 }}>Выбор шаблона</h3>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="empty"
                checked={formData.template === 'empty'}
                onChange={(e) => setFormData({...formData, template: e.target.value})}
              />
              Пустой проект
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="opp"
                checked={formData.template === 'opp'}
                onChange={(e) => setFormData({...formData, template: e.target.value})}
              />
              Шаблон ОПП (из Резонит)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                value="dpp"
                checked={formData.template === 'dpp'}
                onChange={(e) => setFormData({...formData, template: e.target.value})}
              />
              Шаблон ДПП (из Резонит)
            </label>
          </div>
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            style={{
              padding: '12px 30px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Создать проект
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewProjectPage;