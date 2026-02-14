import dotenv from "dotenv";
dotenv.config();

export const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "SECRETO";
export const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/bitacora";
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || "http://localhost:5173";
export const PORT: number = Number(process.env.PORT) || 3000;
