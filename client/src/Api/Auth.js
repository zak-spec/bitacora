// src/Api/Auth.js
import axios from './Axios.js';

export const registerRequest = user => axios.post(`/api/register`, user);
export const loginRequest = user => axios.post(`/api/login`, user);
export const verifyTokenRequest = () => axios.get(`/api/verifyToken`);