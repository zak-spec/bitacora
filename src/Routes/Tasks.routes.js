import { Router } from "express";
import { authRequired } from "../Middlewares/ValidateToken.js";
import { getTasks, getTask, createTask, deleteTask, updateTask } from "../Controllers/Tasks.controllers.js";
import { validateSchema } from "../Middlewares/Validator.middleware.js";
import { TaskSchema } from "../Schemas/Task.schema.js";
import { exportToCSV, exportToPDF } from '../Controllers/Formato.controllers.js';

const router = Router();

router.get("/tasks", authRequired,getTasks);
router.get("/tasks/:id", authRequired, getTask);
router.post("/tasks", authRequired,validateSchema(TaskSchema), createTask);
router.delete("/tasks/:id", authRequired, deleteTask);
router.put("/tasks/:id", authRequired, updateTask);

// Añadir estas rutas
router.get('/task/csv/:id', authRequired, exportToCSV); // Añadido authRequired
router.get('/task/pdf/:id', authRequired, exportToPDF); // Añadido authRequired

export default router;