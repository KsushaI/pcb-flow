import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '../../data/user';

function NewProjectPage({ addProject }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

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
    
    if (!currentUser) {
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    const newProject = {
      id: uuidv4(),
      name: formData.name || `Проект ${new Date().toLocaleDateString()}`,
      type: formData.type,
      accuracyClass: parseInt(formData.accuracyClass),
      material: formData.material,
      foil: parseFloat(formData.foil),
      standard: formData.standard,
      ipcClass: formData.ipcClass,
      date: new Date().toISOString(),
      nodes: [],
      edges: [],
      ownerId: currentUser.id
    };
    
    addProject(newProject);
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
            padding: '8px 0'
          }}
        >
          ← Назад
        </button>
        <h1 style={{ marginTop: '20px', fontSize: '24px', fontWeight: '500' }}>Новый проект</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Название проекта */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            Название проекта
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Плата управления двигателем"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Тип платы */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            Тип платы
          </label>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['ОПП', 'ДПП', 'МПП'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
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

        {/* Два столбца */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
              Класс точности
            </label>
            <select
              value={formData.accuracyClass}
              onChange={(e) => setFormData({...formData, accuracyClass: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                background: 'white'
              }}
            >
              {[1,2,3,4,5].map(cls => (
                <option key={cls} value={cls}>Класс {cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
              Материал основания
            </label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({...formData, material: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option>FR-4</option>
              <option>PTFE</option>
              <option>Керамика</option>
              <option>Полиимид</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
              Толщина фольги (мкм)
            </label>
            <input
              type="number"
              step="1"
              value={formData.foil}
              onChange={(e) => setFormData({...formData, foil: e.target.value})}
              placeholder="35"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
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
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="ГОСТ 23752-79">ГОСТ 23752-79</option>
              <option value="IPC-6012B Class 2">IPC-6012B Class 2</option>
              <option value="IPC-6012B Class 3">IPC-6012B Class 3</option>
            </select>
          </div>
        </div>

        {/* IPC Class (условно) */}
        {formData.standard.includes('IPC') && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
              IPC Class
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <input
                  type="radio"
                  value="2"
                  checked={formData.ipcClass === '2'}
                  onChange={(e) => setFormData({...formData, ipcClass: e.target.value})}
                />
                Class 2
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <input
                  type="radio"
                  value="3"
                  checked={formData.ipcClass === '3'}
                  onChange={(e) => setFormData({...formData, ipcClass: e.target.value})}
                />
                Class 3
              </label>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewProjectPage;