import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../Routes/Auth.routes.js";
import tasksRoutes from "../Routes/Tasks.routes.js";
import Formato from "../Routes/Formato.routes.js";
import Collaborator from "../Routes/Collaborator.routes.js";
import { CORS_ORIGIN } from "./Config.js";
import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/api", authRoutes);
app.use("/api", tasksRoutes);
app.use("/api", Formato);
app.use("/api", Collaborator);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
