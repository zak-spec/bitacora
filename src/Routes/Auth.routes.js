// src/Routes/auth.routes.js
import { Router } from "express";
import { authRequired } from "../Middlewares/ValidateToken.js";
import { login, register, logout, profile, verifyToken } from "../Controllers/Auth.controllers.js";
import { validateSchema } from "../Middlewares/Validator.middleware.js";
import { registerSchema, loginSchema } from "../Schemas/Auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/verifyToken", verifyToken);

export default router;