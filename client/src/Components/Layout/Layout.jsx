import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Layout.css';
import { useAuth } from '../../Context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className={`layout-wrapper ${isAuthenticated ? 'authenticated' : ''}`}>
      <Navbar />
      <div className="layout-content">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;