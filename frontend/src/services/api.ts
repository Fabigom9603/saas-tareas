/**
 * Configuración del cliente HTTP.
 * Centraliza todas las peticiones al backend.
 */

import axios, { AxiosInstance } from 'axios';

// URL base del backend (desde .env)
const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= INTERCEPTOR DE AUTENTICACIÓN =============

/**
 * Interceptor: Adjunta el token automáticamente a cada petición
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============= TIPOS (INTERFACES) =============

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

// ============= SERVICIOS DE AUTENTICACIÓN =============

/**
 * Registro de nuevo usuario
 */
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Login de usuario existente
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

// ============= SERVICIOS DE TAREAS =============

/**
 * Obtener todas las tareas del usuario
 */
export const getTasks = async (): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>('/tasks');
  return response.data;
};

/**
 * Crear una nueva tarea
 */
export const createTask = async (title: string, description?: string): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>('/tasks', { title, description });
  return response.data;
};

/**
 * Actualizar una tarea
 */
export const updateTask = async (id: number, data: Partial<Task>): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

/**
 * Eliminar una tarea
 */
export const deleteTask = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;