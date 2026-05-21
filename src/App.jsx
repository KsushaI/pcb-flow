/*import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import ProjectsPage from './components/pages/ProjectsPage';
import NewProjectPage from './components/pages/NewProjectPage';
import EditorPage from './components/pages/EditorPage';

import './App.css';

function App() {
  const [projects, setProjects] = useState([]);

  const addProject = (newProject) => {
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('pcb-projects', JSON.stringify(updated));
  };

  const updateProject = (updatedProject) => {
    const updated = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updated);
    localStorage.setItem('pcb-projects', JSON.stringify(updated));
  };

  return (
    <BrowserRouter>
      <div style={{ height: '100vh' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProjectsPage 
                projects={projects} 
                setProjects={setProjects}
              />
            } 
          />
          <Route 
            path="/new" 
            element={
              <NewProjectPage 
                addProject={addProject}
              />
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <EditorPage 
                projects={projects}
                updateProject={updateProject}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import ProjectsPage from './components/pages/ProjectsPage';
import NewProjectPage from './components/pages/NewProjectPage';
import EditorPage from './components/pages/EditorPage';
import UsersPage from './components/pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser, isAdmin, setCurrentUser } from './data/user';

function App() {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем пользователя при старте
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    setLoading(false);
  }, []);

  // Загружаем проекты только после того, как узнали пользователя
  useEffect(() => {
    if (loading) return;
    
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
  }, [currentUser, loading]);

  const addProject = (newProject) => {
    // ВАЖНО: получаем пользователя напрямую, а не из состояния!
    const user = getCurrentUser();
    
    if (!user) {
      console.error('Пользователь не авторизован');
      alert('Ошибка: пользователь не авторизован');
      return;
    }
    
    const saved = localStorage.getItem('pcb-projects');
    const allProjects = saved ? JSON.parse(saved) : [];
    allProjects.push(newProject);
    localStorage.setItem('pcb-projects', JSON.stringify(allProjects));
    
    // Обновляем состояние projects в зависимости от роли
    if (isAdmin()) {
      setProjects(allProjects);
    } else {
      const userProjects = allProjects.filter(p => p.ownerId === user.id);
      setProjects(userProjects);
    }
  };

  const updateProject = (updatedProject) => {
    const saved = localStorage.getItem('pcb-projects');
    if (saved) {
      const allProjects = JSON.parse(saved);
      const updatedAll = allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
      localStorage.setItem('pcb-projects', JSON.stringify(updatedAll));
      
      const user = getCurrentUser();
      if (isAdmin()) {
        setProjects(updatedAll);
      } else if (updatedProject.ownerId === user?.id) {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      }
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <ProjectsPage projects={projects} setProjects={setProjects} />
          </ProtectedRoute>
        } />
        <Route path="/new" element={
          <ProtectedRoute>
            <NewProjectPage addProject={addProject} />
          </ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute>
            <EditorPage projects={projects} updateProject={updateProject} />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;