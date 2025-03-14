
        import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1>Fanta Club Manager</h1>
        <nav className="nav-menu">
          <Link to="/" className="button">Dashboard</Link>
          {/* Aggiungeremo altri link in seguito */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
