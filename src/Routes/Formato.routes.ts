import { Router } from "express";
import { exportToCSV, exportToPDF } from "../Controllers/Formato.controllers.js";
import { authRequired } from "../Middlewares/ValidateToken.js";

const router = Router();

router.get("/csv/:id", authRequired, exportToCSV);
router.get("/pdf/:id", authRequired, exportToPDF);

export default router;
