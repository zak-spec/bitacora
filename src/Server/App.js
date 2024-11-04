// src/Server/app.js

import express from 'express';
import morgan from 'morgan';
import authRoutes from '../Routes/Auth.routes.js'; // Asegúrate de que la extensión .js esté incluida
import cookieParser from 'cookie-parser';
import tasksRoutes from '../Routes/tasks.routes.js'; // Asegúrate de que la extensión .js esté incluida


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes); // Agrega un prefijo para las rutas de autenticación
app.use('/api', tasksRoutes); // Agrega un prefijo para las rutas de tareas

export default app;