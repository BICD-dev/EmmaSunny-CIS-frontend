import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi,type Customer,type CreateCustomerData } from '../api/customerApi';
import { toast } from 'react-hot-toast';

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

// Hook: Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customerApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });
      toast.success('Customer created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    },
  });
}

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