import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '../../data/user';

function NewProjectPage({ addProject }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser(); // ← получаем текущего пользователя
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'ОПП',
    accuracyClass: '3',
    material: 'FR-4',
    foil: '35',
    standard: 'ГОСТ 23752-79',
    ipcClass: 'none',
    template: 'empty'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: uuidv4(),
      name: formData.name || `Проект ${new Date().toLocaleDateString()}`,
      type: formData.type,
      accuracyClass: parseInt(formData.accuracyClass),
      material: formData.material,
      foil: parseInt(formData.foil),
      standard: formData.standard,
      ipcClass: formData.ipcClass,
      date: new Date().toISOString(),
      nodes: [],
      edges: [],
      ownerId: currentUser?.id  // ← КЛЮЧЕВОЕ ПОЛЕ — привязка к пользователю
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
        <h1 style={{ marginTop: '20px' }}>Создание нового проекта</h1>
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
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Определяет обязательные операции и допустимые технологические процессы
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
                  <option key={cls} value={cls}>
                    Класс {cls} {cls === 1 && '(ширина ≥0.75 мм)'}
                    {cls === 2 && '(ширина ≥0.45 мм)'}
                    {cls === 3 && '(ширина ≥0.25 мм)'}
                    {cls === 4 && '(ширина ≥0.15 мм)'}
                    {cls === 5 && '(ширина ≥0.10 мм)'}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                По ГОСТ 23751-86. Влияет на минимальную ширину проводника и зазоры
              </div>
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
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Влияет на температурные режимы пайки и химическую стойкость
              </div>
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
                <option value="18">18 мкм (тонкая, для плотного монтажа)</option>
                <option value="35">35 мкм (стандартная)</option>
                <option value="70">70 мкм (усиленная, для силовых цепей)</option>
              </select>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Влияет на параметры травления и толщину проводников
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Стандарт качества
              </label>
              <select
                value={formData.standard}
                onChange={(e) => {
                  const newStandard = e.target.value;
                  setFormData({
                    ...formData,
                    standard: newStandard,
                    ipcClass: newStandard.includes('IPC') ? '2' : 'none'
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="ГОСТ 23752-79">ГОСТ 23752-79 (Российский стандарт)</option>
                <option value="IPC-6012B Class 2">IPC-6012B Class 2 (промышленная электроника)</option>
                <option value="IPC-6012B Class 3">IPC-6012B Class 3 (высоконадёжная техника)</option>
              </select>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Определяет требования к толщине металлизации и качеству изготовления
              </div>
            </div>
          </div>

          {formData.standard.includes('IPC') && (
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                IPC Class
              </label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    value="2"
                    checked={formData.ipcClass === '2'}
                    onChange={(e) => setFormData({...formData, ipcClass: e.target.value})}
                  />
                  Class 2 (промышленная электроника)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    value="3"
                    checked={formData.ipcClass === '3'}
                    onChange={(e) => setFormData({...formData, ipcClass: e.target.value})}
                  />
                  Class 3 (высоконадёжная техника, ≥25 мкм металлизации)
                </label>
              </div>
            </div>
          )}
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