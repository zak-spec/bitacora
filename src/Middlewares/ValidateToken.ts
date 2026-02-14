import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../Server/Config.js";
import User from "../Models/User.model.js";
import type { JwtPayload } from "../types/index.js";

export const authRequired = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { token } = req.cookies as { token?: string };
    if (!token) {
      res.status(401).json({ message: "No estas autorizado" });
      return;
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token no válido" });
        return;
      }
      req.user = decoded as JwtPayload;
      next();
    });
  } catch {
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const adminRequired = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { token } = req.cookies as { token?: string };
    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token no válido" });
        return;
      }

      const decodedUser = decoded as JwtPayload;
      const user = await User.findById(decodedUser.id);
      if (!user || user.rol !== "administrador") {
        res.status(401).json({ message: "No tienes permisos de administrador" });
        return;
      }

      req.user = { id: user._id.toString(), rol: user.rol };
      next();
    });
  } catch {
    res.status(500).json({ message: "Error del servidor" });
  }
};

/**
 * Middleware opcional: si hay token lo decodifica y asigna req.user,
 * si no hay token simplemente continúa (req.user queda undefined).
 * Útil para rutas como /register donde un admin puede crear usuarios.
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const { token } = req.cookies as { token?: string };
    if (!token) {
      next();
      return;
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded as JwtPayload;
      }
      next();
    });
  } catch {
    next();
  }
};
