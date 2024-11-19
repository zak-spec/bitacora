import User from '../Models/User.model.js';
import Task from '../Models/Task.model.js';

export const getTasksByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "El correo es requerido" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const tasks = await Task.find({
            user: user._id
        }).populate('user', ['username', 'email']);

        res.json(tasks);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

export const addCollaborator = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const requestingUser = req.user;

        // Verificar el rol del usuario que hace la petición
        if (requestingUser.rol === 'colaborador') {
            return res.status(403).json({ 
                message: "Los colaboradores no pueden agregar otros colaboradores" 
            });
        }

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Verificar si el usuario es administrador o el dueño de la tarea
        const isAdmin = requestingUser.rol === 'administrador';
        const isOwner = task.user.toString() === requestingUser.id;
        const isInvestigator = requestingUser.rol === 'investigador';

        if (!isAdmin && !isOwner && !isInvestigator) {
            return res.status(403).json({ 
                message: "No tienes permisos para agregar colaboradores" 
            });
        }

        // Verificar que el colaborador a agregar tenga rol de colaborador
        const collaborator = await User.findOne({ email });
        if (!collaborator) return res.status(404).json({ message: "Usuario no encontrado" });
        
        if (collaborator.rol !== 'colaborador') {
            return res.status(400).json({ 
                message: "Solo se pueden agregar usuarios con rol de colaborador" 
            });
        }

        // Verificar si ya es colaborador
        if (task.collaborators.includes(collaborator._id)) {
            return res.status(400).json({ message: "El usuario ya es colaborador" });
        }

        task.collaborators.push(collaborator._id);
        await task.save();

        res.json({ message: "Colaborador añadido exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeCollaborator = async (req, res) => {
    try {
        const { id } = req.params; // ID de la tarea
        const { collaboratorId } = req.body; // ID del colaborador a eliminar

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Verificar si el usuario que hace la petición es el dueño de la tarea
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permisos para modificar esta tarea" });
        }

        task.collaborators = task.collaborators.filter(
            (collab) => collab.toString() !== collaboratorId
        );

        await task.save();
        res.json({ message: "Colaborador eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
