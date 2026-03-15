import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getTasks = (userId) => api.get('/tasks?userId=' + userId);
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put('/tasks/' + id, task);
export const deleteTask = (id) => api.delete('/tasks/' + id);

export const getGoals = (userId) => api.get('/goals?userId=' + userId);
export const createGoal = (goal) => api.post('/goals', goal);
export const updateGoal = (id, goal) => api.put('/goals/' + id, goal);

export default api;
