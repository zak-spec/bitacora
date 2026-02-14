import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../Server/Config.js";
import type { IUserDocument, JwtPayload } from "../types/index.js";

export function createAccessToken(user: IUserDocument): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { id: user._id.toString(), rol: user.rol };
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) return reject(err);
      resolve(token as string);
    });
  });
}
