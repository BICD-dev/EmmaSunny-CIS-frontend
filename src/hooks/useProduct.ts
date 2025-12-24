import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi, type Product, type CreateProductData } from '../api/productApi';
import { toast } from 'react-hot-toast';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
//   statistics: () => [...productKeys.all, 'statistics'] as const,
};

// get all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const response = await productApi.getAllProducts();
      return response.product;
    },
  });
}

// get single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await productApi.getProduct(id);
      return response.product;
    },
    enabled: !!id,
  });
}

// Hook: Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
}

// Hook: Delete Product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete Product');
    },
  });
}