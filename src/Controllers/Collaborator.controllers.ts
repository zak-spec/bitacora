import type { Request, Response } from "express";
import User from "../Models/User.model.js";
import Task from "../Models/Task.model.js";

export const getTasksByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "El correo es requerido" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const tasks = await Task.find({ user: user._id }).populate("user", ["username", "email"]);
    res.json(tasks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const addCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const requestingUser = req.user!;

    if (requestingUser.rol === "colaborador") {
      res.status(403).json({ message: "Los colaboradores no pueden agregar otros colaboradores" });
      return;
    }

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    const isAdmin = requestingUser.rol === "administrador";
    const isOwner = task.user.toString() === requestingUser.id;
    const isInvestigator = requestingUser.rol === "investigador";

    if (!isAdmin && !isOwner && !isInvestigator) {
      res.status(403).json({ message: "No tienes permisos para agregar colaboradores" });
      return;
    }

    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (collaborator.rol !== "colaborador") {
      res.status(400).json({ message: "Solo se pueden agregar usuarios con rol de colaborador" });
      return;
    }

    if (task.collaborators.some((c) => c.toString() === collaborator._id.toString())) {
      res.status(400).json({ message: "El usuario ya es colaborador" });
      return;
    }

    task.collaborators.push(collaborator._id);
    await task.save();

    res.json({ message: "Colaborador añadido exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { collaboratorId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    if (task.user.toString() !== req.user!.id) {
      res.status(403).json({ message: "No tienes permisos para modificar esta tarea" });
      return;
    }

    task.collaborators = task.collaborators.filter(
      (collab) => collab.toString() !== collaboratorId
    ) as typeof task.collaborators;

    await task.save();
    res.json({ message: "Colaborador eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
