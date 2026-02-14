import axios from './Axios.js';

export const getTasksByEmail = (email) => axios.post('/tasks-Collaborator', { email });

export const addCollaboratorToTask = (taskId, email) => 
  axios.post(`/tasks/${taskId}/collaborators`, { email });

export const removeCollaboratorFromTask = (taskId, collaboratorId) => 
  axios.delete(`/tasks/${taskId}/collaborators`, { data: { collaboratorId } });