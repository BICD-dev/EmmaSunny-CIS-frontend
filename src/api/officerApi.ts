import { apiClient } from './client';

// Types
export interface Officer {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    token: string;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}
export interface ProductApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  product: T;
}

// API Functions
export const officerApi = {
  // Login
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Get all officers
  getAllOfficers: async (): Promise<ApiResponse<Officer[]>> => {
    const response = await apiClient.get('/officer');
    return response.data;
  },

  // Get single officer
  getOfficer: async (): Promise<ApiResponse<Officer>> => {
    const response = await apiClient.get(`/officer/me`);
    return response.data;
  },

  // Create officer
  createOfficer: async (data: Partial<Officer>): Promise<ApiResponse<Officer>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Update officer
  updateOfficer: async (id: string, data: Partial<Officer>): Promise<ApiResponse<Officer>> => {
    const response = await apiClient.put(`/officer/${id}`, data);
    return response.data;
  },

  // Delete officer
  deleteOfficer: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/officer/${id}`);
    return response.data;
  },
};