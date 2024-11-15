// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = event => {
    event.preventDefault();
    axios
      .post('http://localhost:5000/api/login', {
        username,
        password,
      })
      .then(response => {
        // Save token and redirect to dashboard
        const token = response.data.token;
        localStorage.setItem('token', token);
        history.push('/dashboard');
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/">Signup here</a>.
      </p>
    </div>
  );
}

export default Login;