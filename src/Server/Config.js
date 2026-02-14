import dotenv from 'dotenv';
dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "SECRETO";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bitacora";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
export const PORT = process.env.PORT || 3000;