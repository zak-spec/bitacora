import axios from './Axios.js';

export const getTasksByEmail =  (email) => axios.post('/tasks-Collaborator', {email });


export const addCollaboratorToTask = (taskId, email) => 
  axios.post(`/collaborator/${taskId}/add`, { email });

export const removeCollaboratorFromTask = (taskId, collaboratorId) => 
  axios.delete(`/collaborator/${taskId}/remove`, { data: { collaboratorId } });