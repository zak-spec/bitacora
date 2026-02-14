import type { Request, Response } from "express";
import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../Libs/jwt.js";
import { TOKEN_SECRET } from "../Server/Config.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, rol } = req.body;

  try {
    // Solo un administrador autenticado puede crear otros administradores
    if (rol === "administrador") {
      if (!req.user || req.user.rol !== "administrador") {
        res.status(403).json(["Solo un administrador puede crear cuentas de administrador"]);
        return;
      }
    }

    const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).json(["El email ya está registrado"]);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: passwordHash, username, rol });

    const userSave = await newUser.save();

    // Si es una creación por administrador, mantener el token existente
    if (req.user && req.user.rol === "administrador") {
      res.json({
        id: userSave._id,
        username: userSave.username,
        email: userSave.email,
        rol: userSave.rol,
        createdAt: userSave.createdAt,
        updatedAt: userSave.updatedAt,
        isAdminCreated: true,
      });
      return;
    }

    // Para registro normal, crear nuevo token
    const token = await createAccessToken(userSave);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      id: userSave._id,
      username: userSave.username,
      email: userSave.email,
      rol: userSave.rol,
      createdAt: userSave.createdAt,
      updatedAt: userSave.updatedAt,
      isAdminCreated: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.status(400).json(["Usuario o contraseña incorrectos"]);
      return;
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      res.status(400).json(["Usuario o contraseña incorrectos"]);
      return;
    }

    const token = await createAccessToken(userFound);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch {
    res.status(500).json(["Error interno del servidor"]);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.sendStatus(200);
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userFound = await User.findById(req.user!.id);
    if (!userFound) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.cookies as { token?: string };

    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
    const userFound = await User.findById(decoded.id);

    if (!userFound) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token inválido" });
  }
};
