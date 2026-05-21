// src/data/user.js

// Начальные пользователи
const defaultUsers = [
  { id: 1, login: 'tech', password: 'tech123', role: 'technologist', name: 'Технолог1' },
  { id: 2, login: 'admin', password: 'admin123', role: 'admin', name: 'Администратор' },
  { id: 3, login: 'tech2', password: 'tech123', role: 'technologist', name: 'Технолог2' }
];

// Загрузка пользователей из localStorage
export const getUsers = () => {
  const stored = localStorage.getItem('pcb-users');
  if (stored) {
    return JSON.parse(stored);
  }
  // Если нет — сохраняем default и возвращаем
  localStorage.setItem('pcb-users', JSON.stringify(defaultUsers));
  return [...defaultUsers];
};

// Сохранение пользователей в localStorage
const saveUsers = (users) => {
  localStorage.setItem('pcb-users', JSON.stringify(users));
};

// Получение текущего пользователя
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Установка текущего пользователя
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Проверка, авторизован ли пользователь
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Проверка, является ли текущий пользователь администратором
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Создание нового пользователя (только для админа)
export const createUser = (login, password, role, name) => {
  const users = getUsers();
  const newId = Math.max(...users.map(u => u.id), 0) + 1;
  const newUser = { id: newId, login, password, role, name };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Обновление пользователя
export const updateUser = (id, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
  return null;
};

// Удаление пользователя
export const deleteUser = (id) => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
  
  // Если удалили текущего пользователя — разлогиниваем
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    setCurrentUser(null);
  }
};

// Проверка существования логина
export const isLoginExists = (login, excludeId = null) => {
  const users = getUsers();
  return users.some(u => u.login === login && u.id !== excludeId);
};

// Экспорт массива пользователей (для совместимости со старым кодом)
export const users = getUsers();