// src/Server/index.js

import app from './App.js';
import { connectDB } from './Db.js';

connectDB();
console.log('Database connected');

app.listen(3000, () => {
  console.log('Server on port 3000');
});