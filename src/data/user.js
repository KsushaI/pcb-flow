export const users = [
  { id: 1, login: 'tech', password: 'tech123', role: 'technologist', name: 'Технолог1' },
  { id: 2, login: 'admin', password: 'admin123', role: 'admin', name: 'Администратор' },
  {id: 3, login: 'tech2', password: 'tech123', role: 'technologist', name: 'Технолог2'}
];

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};