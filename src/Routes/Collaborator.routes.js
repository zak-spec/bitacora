import { Router } from "express";
import { authRequired } from "../Middlewares/ValidateToken.js";
import { 
    getTasksByEmail, 
    addCollaborator, 
    removeCollaborator 
} from "../Controllers/Collaborator.controllers.js";

const router = Router();

router.post("/tasks-Collaborator",authRequired, getTasksByEmail);
router.post("/tasks/:id/collaborators", authRequired, addCollaborator);
router.delete("/tasks/:id/collaborators", authRequired, removeCollaborator);

export default router;