import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tasks API
export const getTasks = async (userId) => {
  try {
    const response = await api.get(`/tasks?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const response = await api.post('/tasks', task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id, task) => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Goals API
export const getGoals = async (userId) => {
  try {
    const response = await api.get(`/goals?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const createGoal = async (goal) => {
  try {
    const response = await api.post('/goals', goal);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const updateGoal = async (id, goal) => {
  try {
    const response = await api.put(`/goals/${id}`, goal);
    return response.data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (id) => {
  try {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Habits API
export const getHabits = async (userId) => {
  try {
    const response = await api.get(`/habits?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

export const createHabit = async (habit) => {
  try {
    const response = await api.post('/habits', habit);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const updateHabit = async (id, habit) => {
  try {
    const response = await api.put(`/habits/${id}`, habit);
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const trackHabit = async (id, date) => {
  try {
    const response = await api.post(`/habits/${id}/track`, { date });
    return response.data;
  } catch (error) {
    console.error('Error tracking habit:', error);
    throw error;
  }
};

// User API
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export default api;
