import type { Request, Response } from "express";
import User from "../Models/User.model.js";

const ALLOWED_UPDATE_FIELDS = ["username", "email", "rol"] as const;

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Solo permitir campos seguros
    const filteredBody: Record<string, unknown> = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    }

    if (Object.keys(filteredBody).length === 0) {
      res.status(400).json({ message: "No se proporcionaron campos válidos para actualizar" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, { new: true }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
