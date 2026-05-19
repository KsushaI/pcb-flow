import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../ProjectCard';
import { getCurrentUser, isAdmin, setCurrentUser } from '../../data/user';

function ProjectsPage({ projects, setProjects }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  // Загрузка проектов при монтировании компонента
  useEffect(() => {
    const saved = localStorage.getItem('pcb-projects');
    if (saved) {
      const allProjects = JSON.parse(saved);
      
      if (isAdmin()) {
        setProjects(allProjects);
      } else {
        // Технолог видит только свои проекты (если авторизован)
        const userProjects = allProjects.filter(p => p.ownerId === currentUser?.id);
        setProjects(userProjects);
      }
    }
    setLoading(false);
  }, []);

  const handleDelete = (projectId, ownerId) => {
    // Проверка прав на удаление
    if (!isAdmin() && ownerId !== currentUser?.id) {
      alert('У вас нет прав на удаление этого проекта');
      return;
    }

    if (window.confirm('Удалить проект?')) {
      const updated = projects.filter(p => p.id !== projectId);
      setProjects(updated);
      
      // Обновляем общее хранилище
      const saved = localStorage.getItem('pcb-projects');
      if (saved) {
        const allProjects = JSON.parse(saved);
        const updatedAll = allProjects.filter(p => p.id !== projectId);
        localStorage.setItem('pcb-projects', JSON.stringify(updatedAll));
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Загрузка проектов...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Шапка */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ margin: 0 }}>📋 Мои проекты</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Информация о пользователе */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 16px',
            backgroundColor: '#f0f0f0',
            borderRadius: '20px'
          }}>
            <span style={{ fontSize: '14px' }}>
              👤 {currentUser?.name || currentUser?.login} 
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '12px', 
                color: currentUser?.role === 'admin' ? '#4CAF50' : '#2196F3',
                fontWeight: 'bold'
              }}>
                ({currentUser?.role === 'admin' ? 'Администратор' : 'Технолог'})
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Выйти
            </button>
          </div>
          
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
        gap: '30px',
        flexWrap: 'wrap'
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
            onDelete={() => handleDelete(project.id, project.ownerId)}
            canEdit={isAdmin() || project.ownerId === currentUser?.id}
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