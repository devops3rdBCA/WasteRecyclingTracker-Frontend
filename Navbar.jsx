import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">WasteRecyclingTracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#wrtNavbar"
          aria-controls="wrtNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="wrtNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {role === 'family' && (
              <li className="nav-item">
                <Link className="nav-link" to="/family">Family Dashboard</Link>
              </li>
            )}
            {role === 'center' && (
              <li className="nav-item">
                <Link className="nav-link" to="/center">Center Dashboard</Link>
              </li>
            )}
            {role && (
              <li className="nav-item">
                <Link className="nav-link" to="/statistics">📊 Statistics</Link>
              </li>
            )}
            {role && (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-lg-3" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
