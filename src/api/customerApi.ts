import { apiClient } from './client';
import type { ApiResponse } from './officerApi';

// Types
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  last_visit?: string;
  gender: string;
  DateOfBirth?: string;
  customer_code: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  is_active: boolean;
  profile_image: string;
  product_id: string;
  officer_id: string;
  id_card?:string;
  product:{
    product_name:string;
    price:string;
  },
  officer:{
    first_name:string;
    last_name:string;
  }
}

export interface CustomerStatistics {
  total_customers: number;
  active_customers: number;
  expired_customers: number;
  registered_this_month: number;
  expiring_this_week: number;
  expiring_this_month: number;
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  DateOfBirth?: string;
  product_id: string;
  address: string;
  profile_image?: File;
}

// API Functions
export const customerApi = {
  // Get all customers
  getAllCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    const response = await apiClient.get('/customer');
    return response.data;
  },

  // Get single customer
  getCustomer: async (id: string): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.get(`/customer/${id}`);
    return response.data;
  },

  // Get customer statistics
  getStatistics: async (): Promise<ApiResponse<CustomerStatistics>> => {
    const response = await apiClient.get('/customer/statistics');
    return response.data;
  },

  // Create customer
  createCustomer: async (data: CreateCustomerData): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.post('/customer', data);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.put(`/customer/${id}`, data);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/customer/${id}`);
    return response.data;
  },
  downloadCustomerIDCard: async (filename: string) => {
    const response = await apiClient.get(`/customer/id-card/${filename}`, { responseType: 'blob' });
    return response;
  },
  renewCustomerSubscription: async (customer_id: string, product_id:string): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.post(`/customer/renew`, { customer_id, product_id });
    return response.data;
  }
};