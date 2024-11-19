// src/Api/Auth.js
import axios from './Axios.js';

export const registerRequest = user => axios.post(`/register`, user);
export const loginRequest = user => axios.post(`/login`, user);
export const logoutRequest = () => axios.post(`/logout`);
export const verifyTokenRequest = () => axios.get(`/verifyToken`);
export const  updateUserRequired= (id, user) => axios.put(`/user/${id}`, user);
export const deleteUserRequired = id => axios.delete(`/user/${id}`);
export const getAllUsersRequired = () => axios.get(`/users`);