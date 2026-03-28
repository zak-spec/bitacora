import React from 'react';
import './Header.css';

const Header = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  children 
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className='text-center'>{title}</h1>
        {subtitle && <p className="header-subtitle text-center">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
};

export default Header;
