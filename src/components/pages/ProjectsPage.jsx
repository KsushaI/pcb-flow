import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../ProjectCard';
import { getCurrentUser, isAdmin, setCurrentUser } from '../../data/user';
import { users } from '../../data/user';

function ProjectsPage({ projects, setProjects }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? (user.name || user.login) : 'Неизвестный';
  };

  useEffect(() => {
    const saved = localStorage.getItem('pcb-projects');
    if (saved) {
      const allProjects = JSON.parse(saved);

      if (isAdmin()) {
        setProjects(allProjects);
      } else {
        const userProjects = allProjects.filter(p => p.ownerId === currentUser?.id);
        setProjects(userProjects);
      }
    }
    setLoading(false);
  }, []);

  const handleDelete = (projectId, ownerId) => {
    if (!isAdmin() && ownerId !== currentUser?.id) {
      alert('У вас нет прав на удаление этого проекта');
      return;
    }

    if (window.confirm('Удалить проект?')) {
      const updated = projects.filter(p => p.id !== projectId);
      setProjects(updated);

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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let result = 0;
      if (sortBy === 'date') {
        result = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'name') {
        result = a.name.localeCompare(b.name);
      } else if (sortBy === 'type') {
        result = a.type.localeCompare(b.type);
      }
      return sortOrder === 'desc' ? -result : result;
    });

  const stats = {
    total: projects.length,
    opp: projects.filter(p => p.type === 'ОПП').length,
    dpp: projects.filter(p => p.type === 'ДПП').length,
    mpp: projects.filter(p => p.type === 'МПП').length,
    last: projects.length > 0 ? new Date(Math.max(...projects.map(p => new Date(p.date)))).toLocaleDateString('ru-RU') : 'Нет'
  };

  const roleDisplay = currentUser?.role === 'admin' ? 'Администратор' : 'Технолог';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Загрузка проектов...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Мои проекты</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 16px',
              backgroundColor: '#f0f0f0',
              borderRadius: '20px',
              cursor: 'default',
              height: '48px'
            }}
            title={`Роль: ${roleDisplay}`}
          >
            <span style={{ fontSize: '14px' }}>
              {currentUser?.name || currentUser?.login}
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
                fontWeight: 'bold',
                height: '32px'
              }}
            >
              Выйти
            </button>
          </div>

          {isAdmin() && (
            <button
              onClick={() => navigate('/users')}
              style={{
                padding: '0 20px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img 
                src="/users.png" 
                alt="users" 
                style={{ width: '21px', height: '21px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              Пользователи
            </button>
          )}

          <button
            onClick={() => navigate('/new')}
            style={{
              padding: '0 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              height: '48px'
            }}
          >
            Создать новый проект
          </button>
        </div>
      </div>

      {/* Панель поиска и сортировки */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Поиск проектов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            width: '130px'
          }}
        >
          <option value="date">По дате</option>
          <option value="name">По имени</option>
          <option value="type">По типу</option>
        </select>

        <button
          onClick={toggleSortOrder}
          style={{
            padding: '10px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            width: '36px'
          }}
          title={sortOrder === 'desc' ? 'По убыванию ↓' : 'По возрастанию ↑'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div>Всего: <strong>{stats.total}</strong></div>
        <div>ОПП: <strong>{stats.opp}</strong></div>
        <div>ДПП: <strong>{stats.dpp}</strong></div>
        <div>МПП: <strong>{stats.mpp}</strong></div>
        <div>Последний: {stats.last}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={(id) => navigate(`/editor/${id}`)}
            onDelete={() => handleDelete(project.id, project.ownerId)}
            canEdit={isAdmin() || project.ownerId === currentUser?.id}
            showOwner={isAdmin()}
            ownerName={getUserName(project.ownerId)}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#999' }}>
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