import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../ProjectCard';

function ProjectsPage({ projects, setProjects }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Загружаем проекты из localStorage при старте
    const saved = localStorage.getItem('pcb-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Удалить проект?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('pcb-projects', JSON.stringify(updated));
    }
  };

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

  const stats = {
    total: projects.length,
    opp: projects.filter(p => p.type === 'ОПП').length,
    dpp: projects.filter(p => p.type === 'ДПП').length,
    mpp: projects.filter(p => p.type === 'МПП').length,
    last: projects.length > 0 ? new Date(Math.max(...projects.map(p => new Date(p.date)))).toLocaleDateString('ru-RU') : 'Нет'
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>📋 Мои проекты</h1>
        <div>
          <button
            onClick={() => navigate('/new')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ➕ Создать новый проект
          </button>
        </div>
      </div>

      {/* Поиск и сортировка */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="🔍 Поиск проектов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        >
          <option value="date">По дате ↓</option>
          <option value="name">По имени ↑</option>
          <option value="type">По типу</option>
        </select>
      </div>

      {/* Статистика */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px',
        display: 'flex',
        gap: '30px'
      }}>
        <div>📊 Всего: <strong>{stats.total}</strong></div>
        <div>🟢 ОПП: <strong>{stats.opp}</strong></div>
        <div>🔵 ДПП: <strong>{stats.dpp}</strong></div>
        <div>🟣 МПП: <strong>{stats.mpp}</strong></div>
        <div>📅 Последний: {stats.last}</div>
      </div>

      {/* Сетка проектов */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={(id) => navigate(`/editor/${id}`)}
            onDelete={handleDelete}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div style={{
            gridColumn: '1/-1',
            textAlign: 'center',
            padding: '50px',
            color: '#999'
          }}>
            {projects.length === 0 
              ? 'Нет проектов. Создайте первый!'
              : 'Ничего не найдено'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;