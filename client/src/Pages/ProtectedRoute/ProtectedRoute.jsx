import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

 if(loading) return <h1>Cargando...</h1>;
 if(!isAuthenticated) return <Navigate to="/login" />;

  return<Outlet />
};

export default ProtectedRoute;