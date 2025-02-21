import React from 'react';
import { useNavigate } from 'react-router-dom';

function Nav({ handleLogout }) {
  const navigate = useNavigate();

  const handleNavigationHome = () => {
    navigate('/admin'); // Uncomment this line to enable navigation to home
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button className="nav-link" data-widget="pushmenu" type="button">
            <i className="fas fa-bars"></i>
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <button className="nav-link" onClick={handleLogout}>
            Déconnexion
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <button className="nav-link" onClick={handleNavigationHome}>
            Home
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
