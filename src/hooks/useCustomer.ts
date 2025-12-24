import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi,type Customer,type CreateCustomerData } from '../api/customerApi';
import { toast } from 'react-hot-toast';
import { apiClient } from '../api/client';

// Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: string) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  statistics: () => [...customerKeys.all, 'statistics'] as const,
};

// Hook: Get all customers
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: async () => {
      const response = await customerApi.getAllCustomers();
      return response.data;
    },
  });
}

// Hook: Get single customer
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => {
      const response = await customerApi.getCustomer(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook: Get customer statistics
export function useCustomerStatistics() {
  return useQuery({
    queryKey: customerKeys.statistics(),
    queryFn: async () => {
      const response = await customerApi.getStatistics();
      return response.data;
    },
  });
}

// src/hooks/useCustomer.ts
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customerApi.createCustomer(data),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });
      
      // Download ID card if path is provided
      if (response.data.idCardPath) {
        const filename = response.data.idCardPath.split('/').pop() || 
                        response.data.idCardPath.split('\\').pop(); // Handle Windows paths
        
        try {
          // Use the authenticated API client to download
          const downloadResponse = await apiClient.get(`/customer/id-card/${filename}`, {
            responseType: 'blob',
            timeout: 30000, // 30 second timeout for large files
          });
          
          // Verify it's a PDF
          if (downloadResponse.data.type !== 'application/pdf') {
            throw new Error('Invalid file type received');
          }
          
          // Create a blob URL and trigger download
          const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || `ID-Card-${Date.now()}.pdf`;
          link.style.display = 'none'; // Hide the link
          document.body.appendChild(link);
          link.click();
          
          // Cleanup with a slight delay to ensure download started
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
          
          toast.success('Customer created successfully! ID card downloaded.');
        } catch (error: any) {
          console.error('Error downloading ID card:', error);
          
          // Specific error messages
          if (error.response?.status === 404) {
            toast.error('Customer created but ID card file not found');
          } else if (error.response?.status === 429) {
            toast.error('Too many download requests. Please try again later.');
          } else if (error.code === 'ECONNABORTED') {
            toast.error('Download timeout. Please try downloading again.');
          } else {
            toast.error('Customer created but failed to download ID card');
          }
        }
      } else {
        toast.success('Customer created successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    },
  });
};
// Hook: Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });
      toast.success('Customer updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    },
  });
}

// Hook: Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });
      toast.success('Customer deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    },
  });
}