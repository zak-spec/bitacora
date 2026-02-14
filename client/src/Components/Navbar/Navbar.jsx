import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Nuevo estado
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null); // Referencia para el timer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      }, 1000);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoading(false);
      setIsLoggedOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <Link to="/" className="logo">🌿 {!isCollapsed && 'Bitácora'}</Link>
        {isAuthenticated && (
          <>
            <button 
              className="mobile-toggle"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
            <button 
              className="collapse-button hide-mobile"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </>
        )}
      </div>

      <div className={`navbar-menu ${isMobileMenuOpen ? 'show-mobile' : ''}`}>
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
              {user.rol !== 'administrador' && (
                <>
                  <Link to="/tasks" className="nav-link">
                    {isCollapsed ? '📚' : 'Mis Bitácoras'}
                  </Link>
                  {user.rol !== 'colaborador' && (
                    <Link to="/add-task" className="nav-link">
                      {isCollapsed ? '✏️' : 'Crear Bitácora'}
                    </Link>
                  )}
                  <Link to="/search" className="nav-link">
                    {isCollapsed ? '🔍' : 'Buscar'}
                  </Link>
                </>
              )}
              {user.rol === 'administrador' && (
                <>
                  <Link to="/users" className="nav-link">
                    {isCollapsed ? '👥' : 'Usuarios'}
                  </Link>
                  <Link to="/create-user" className="nav-link">
                    {isCollapsed ? '➕' : 'Crear Usuario'}
                  </Link>
                </>
              )}
            </>
          )}
        </div>
        
        {isAuthenticated ? (
          <div className="auth-buttons">
            <button className="btn btn-logout" onClick={handleLogout}>
              {isCollapsed ? '↪️' : 'Cerrar Sesión'}
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-login">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-register">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
