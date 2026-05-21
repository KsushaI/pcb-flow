import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, setCurrentUser } from '../../data/user';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Получаем актуальный список пользователей из localStorage
    const users = getUsers();
    const user = users.find(u => u.login === login && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '28px', fontSize: '24px' }}>Вход</h2>
        {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <button
            type="submit"
            disabled={!login || !password}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: (!login || !password) ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (!login || !password) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'block',
              textAlign: 'center'
            }}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;