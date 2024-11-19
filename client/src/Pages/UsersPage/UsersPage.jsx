import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import UsersCard from '../../Components/UsersCard/UsersCard';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
    const { users, getAllUsers, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.rol !== 'administrador') {
            navigate('/tasks');
            return;
        }
        getAllUsers();
    }, [user]);

    if (user?.rol !== 'administrador') return null;

    return (
        <div className="bitacora-background min-h-screen py-6 sm:py-12">
            <div className="bitacora-container mx-auto px-4 sm:px-6 max-w-6xl">
                <h1 className="bitacora-title text-center">Gestión de Usuarios</h1>
                {users && users.length > 0 && users.map((userItem, index) => (
                    <UsersCard key={userItem._id} user={userItem} index={index} />
                ))}
            </div>
        </div>
    );
};

export default UsersPage;