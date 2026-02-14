import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import './ProfilePage.css'

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <h1>Cargando...</h1>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              className="avatar"
              src={"https://vectorified.com/images/avatar-icon-png-24.png"} 
              alt="Avatar"
            />
          </div>
          <div className="profile-name">
            <h1>{user.username}</h1>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Correo:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">{user.rol}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
