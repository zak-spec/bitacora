import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../Server/Config.js";

export const authRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No estas autorizado" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "Token no válido" });
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const adminRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (err, decodedUser) => {
      if (err) return res.status(401).json({ message: "Token no válido" });
      
      // Verificar que el usuario exista y sea administrador
      const user = await User.findById(decodedUser.id);
      if (!user || user.rol !== "administrador") {
        return res.status(401).json({ message: "No tienes permisos de administrador" });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor" });
  }
};