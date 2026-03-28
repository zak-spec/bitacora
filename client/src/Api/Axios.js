// src/Api/Axios.js
import axios from "axios";

const instancia = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Agregar interceptor para manejar errores
instancia.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instancia;