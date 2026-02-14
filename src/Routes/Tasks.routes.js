import { Router } from "express";
import { authRequired } from "../Middlewares/ValidateToken.js";
import { getTasks, getTask, createTask, deleteTask, updateTask } from "../Controllers/Tasks.controllers.js";
import { validateSchema } from "../Middlewares/Validator.middleware.js";
import { TaskSchema } from "../Schemas/Task.schema.js";
const router = Router();

router.get("/tasks", authRequired, getTasks);
router.get("/tasks/:id", authRequired, getTask);
router.post("/tasks", authRequired, validateSchema(TaskSchema), createTask);
router.delete("/tasks/:id", authRequired, deleteTask);
router.put("/tasks/:id", authRequired, updateTask);

export default router;