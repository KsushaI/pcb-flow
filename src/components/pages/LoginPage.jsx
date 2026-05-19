import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users, setCurrentUser } from '../../data/user';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '320px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>PCB Process Designer</h2>
        {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button
            type="submit"
            disabled={!login || !password}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: (!login || !password) ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!login || !password) ? 'not-allowed' : 'pointer'
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