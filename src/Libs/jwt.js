import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../Server/Config.js";

export function createAccessToken(user) {
    // console.log(user);
    
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id: user._id, rol: user.rol }, // Incluye el rol en el payload
            TOKEN_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) return reject(err);
                resolve(token);
            }
        );
    });
}