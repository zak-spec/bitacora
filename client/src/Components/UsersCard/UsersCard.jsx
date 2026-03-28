import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UsersCard.css';

function UsersCard({ user, index }) {
  const { deleteUser } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteUser(user._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/users/${user._id}`);
  };

  return (
    <div className="user-entry mb-6 p-6" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-emerald-900">{user.username}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="action-button bg-red-500 hover:bg-red-600"
          >
            <i className="fas fa-trash-alt mr-2"></i>
            Eliminar
          </button>
          <button
            onClick={handleEdit}
            className="action-button bg-blue-500 hover:bg-blue-600"
          >
            <i className="fas fa-edit mr-2"></i>
            Editar
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item-container">
          <div className="info-item">
            <i className="fas fa-envelope text-emerald-600"></i>
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-user-tag text-emerald-600"></i>
            <span className="info-label">Rol:</span>
            <span className="info-value">{user.rol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersCard;
