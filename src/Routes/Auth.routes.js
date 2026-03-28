// src/Routes/auth.routes.js
import { Router } from "express";
import { authRequired, adminRequired } from "../Middlewares/ValidateToken.js";
import { login, register, logout, profile, verifyToken } from "../Controllers/Auth.controllers.js";
import { deleteUser, updateUser, getAllUsers } from "../Controllers/Admin.controllers.js";
import { validateSchema } from "../Middlewares/Validator.middleware.js";
import { registerSchema, loginSchema } from "../Schemas/Auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/verifyToken", verifyToken);
router.put("/user/:id", adminRequired, updateUser);
router.delete("/user/:id", authRequired, deleteUser);
router.get("/users", authRequired, getAllUsers);
export default router;