// // src/Routes/auth.routes.js
import { authRequired } from "../Middlewares/validateToken.js";
import { Router } from "express";
import { login, register, logout,profile } from "../Controllers/Auth.controllers.js"; // Asegúrate de que la extensión .js esté incluida
import { registerSchema, loginSchema } from "../Schemas/Auth.schema.js";
import { validateSchema } from "../Middlewares/Validator.middleware.js";
const router = Router();

router.post("/register", validateSchema(registerSchema),register);
router.post("/login", validateSchema(loginSchema),login);
router.post("/logout", logout);
router.get("/profile",authRequired, profile);

export default router;
