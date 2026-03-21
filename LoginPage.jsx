import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';

const roles = [
  { label: 'Family User', value: 'family' },
  { label: 'Recycling Center Admin', value: 'center' },
];

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('family');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (role === 'family' && !name.trim()) {
        setError('Please enter your family name.');
        return;
      }

      setLoading(true);
      const res = await login(role, name.trim(), password.trim());
      onLogin(res.role || role, res.name || name.trim());
      navigate(role === 'family' ? '/family' : '/center');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-3">Login</h3>
              <p className="text-muted">Choose your role to access WasteRecyclingTracker.</p>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setName('');
                    }}
                  >
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {role === 'family' && (
                  <div className="mb-3">
                    <label className="form-label">Family Name</label>
                    <input
                      className="form-control"
                      placeholder="e.g., Smith, Patel, Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

