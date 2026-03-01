import React, { useState } from 'react';
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

export default App;