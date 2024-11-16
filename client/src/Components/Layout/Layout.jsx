import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Layout.css';
import { useAuth } from '../../Context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className={`layout ${isAuthenticated ? 'authenticated' : ''}`}>
      <main className="main-content">
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;