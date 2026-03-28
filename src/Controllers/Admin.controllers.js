import User from "../Models/User.model.js";

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true
        });
        
        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        
        return res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        
        return res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
