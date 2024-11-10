import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../Server/Config.js";


export const authRequired = (req, res, next) => {

  const { token } = req.cookies;
// console.log("soy el token", token);
// console.log(req.headers);

  if (!token) return res.status(401).json({ message: "No estas autorizado" });
  console.log(token);
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "token no valido" });
    console.log("rol del usuario", user.rol);
    req.user = user;
  next();
  });
  
};

export const adminRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No estas autorizado" });
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "token no valido" });
      if (user.rol !== "admin") return res.status(401).json({ message: "No tienes permisos" });
      console.log("soy el usuario", user.rol);
      
      req.user = user;
      next();   
    });
};