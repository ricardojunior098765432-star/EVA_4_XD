import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    const success = login(email, password);

    if (success) {
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">🌿</div>
        <div className="auth-heading">
          <h1>Verde Limón</h1>
          <p>Intranet administrativa</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@verdelimon.cl"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </label>

          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-hint">
          <p>Usuario demo:</p>
          <p><strong>admin@verdelimon.cl</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;