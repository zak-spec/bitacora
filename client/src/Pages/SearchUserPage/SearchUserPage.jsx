import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import UsersCard from '../../Components/UsersCard/UsersCard';
import { useNavigate } from 'react-router-dom';
import './SearchUserPage.css';

const SearchUserPage = () => {
    const { users, getAllUsers, user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('todos');

    useEffect(() => {
        if (user?.rol !== 'administrador') {
            navigate('/tasks');
            return;
        }
        getAllUsers();
    }, [user]);

    const filteredUsers = users?.filter(userItem => {
        const matchesSearch = userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'todos' || userItem.rol === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    if (user?.rol !== 'administrador') return null;

    return (
        <div className="bitacora-background min-h-screen py-12">
            <div className="bitacora-container mx-auto px-6 max-w-6xl">
                <h1 className="bitacora-title text-center mb-8">Búsqueda de Usuarios</h1>
                
                <div className="search-filters-container mb-8">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                        className="filter-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="todos">Todos los roles</option>
                        <option value="investigador">Investigador</option>
                        <option value="colaborador">Colaborador</option>
                    </select>
                </div>
                <div className="users-grid">
                    {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((userItem, index) => (
                            <UsersCard key={userItem._id} user={userItem} index={index} />
                        ))
                    ) : (
                        <p className="no-results">No se encontraron usuarios</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUserPage;
