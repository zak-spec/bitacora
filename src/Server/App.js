// src/Server/app.js

import express from 'express';
import morgan from 'morgan';
import authRoutes from '../Routes/Auth.routes.js';
import cookieParser from 'cookie-parser';
import tasksRoutes from '../Routes/Tasks.routes.js';
import Formato from '../Routes/Formato.routes.js';
import Collaborator from '../Routes/Collaborator.routes.js';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));
app.use('/api', authRoutes);
app.use('/api', tasksRoutes);
app.use('/api', Formato);
app.use('/api', Collaborator);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;