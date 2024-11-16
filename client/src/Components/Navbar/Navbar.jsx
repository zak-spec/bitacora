import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Nuevo estado
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null); // Referencia para el timer

  // Limpiar el timer cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setIsLoggedOut(true); // Activar estado de cierre de sesión
      await logout();
      timerRef.current = setTimeout(() => {
        navigate('/', { replace: true });
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoading(false);
      setIsLoggedOut(false);
    }
  };

  // Si está en proceso de cierre de sesión o cargando, mostrar pantalla de carga
  if (isLoading || isLoggedOut) {
    return <div className="loading-container"><h1>Cerrando sesión...</h1></div>;
  }

  // Manejar estado inicial de carga
  if (isAuthenticated === null) {
    return <div className="loading-container"><h1>Cargando...</h1></div>;
  }

  return (
    <nav className={`navbar ${isCollapsed ? 'collapsed' : ''} ${isAuthenticated ? 'authenticated' : ''}`}>
      <div className="navbar-brand">
        {isAuthenticated && (
          <button 
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}
        <Link to="/" className="logo">🌿 {!isCollapsed && 'Bitácora'}</Link>
      </div>

      <div className="navbar-menu">
        <div className="nav-links">
          {!isAuthenticated && (
            <>
              <Link to="/" className="nav-link">
                {isCollapsed ? '🏠' : 'Inicio'}
              </Link>
              <Link to="/about" className="nav-link">
                {isCollapsed ? 'ℹ️' : 'Acerca de'}
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/profile" className="nav-link">
                {isCollapsed ? '👤' : 'Perfil'}
              </Link>
              <Link to="/tasks" className="nav-link">
                {isCollapsed ? '📚' : 'Mis Bitácoras'}
              </Link>
              <Link to="/add-task" className="nav-link">
                {isCollapsed ? '✏️' : 'Crear Bitácora'}
              </Link>
            </>
          )}
        </div>
        
        {isAuthenticated ? (
          <div className="auth-buttons">
            <button className="btn btn-logout" onClick={handleLogout}>
              {isCollapsed ? '↪️' : 'Cerrar Sesión'}
            </button>
          </div>
        ):!isAuthenticated && (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-login">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-register">Registrarse</Link>
          </div>
        )}
        
        {}
      </div>
    </nav>
  );
};

export default Navbar;
