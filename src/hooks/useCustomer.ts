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
  MonthlyRegistrations: () => [...customerKeys.all, 'monthly-registrations'] as const,

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

export function useMonthlyCustomerRegistrations() {
  return useQuery({
    queryKey: customerKeys.MonthlyRegistrations(),
    queryFn: async () => {
      const response = await customerApi.getMonthlyCustomersRegistration();
      return response;
    },
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      const formData = new FormData();

      // Append normal fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profile_image" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append file — FIELD NAME MUST MATCH MULTER
      if (data.profile_image) {
        formData.append("profile_image", data.profile_image);
      }

      // Send multipart/form-data
      return apiClient.post("/customer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });

      // ---------- ID CARD DOWNLOAD LOGIC ----------
      if (response.data.idCardPath) {
        const filename =
          response.data.idCardPath.split("/").pop() ||
          response.data.idCardPath.split("\\").pop();

        try {
          const downloadResponse = await apiClient.get(
            `/customer/id-card/${filename}`,
            {
              responseType: "blob",
              timeout: 30000,
            }
          );

          if (downloadResponse.data.type !== "application/pdf") {
            throw new Error("Invalid file type received");
          }

          const blob = new Blob([downloadResponse.data], {
            type: "application/pdf",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename || `ID-Card-${Date.now()}.pdf`;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);

          toast.success(
            "Customer created successfully! ID card downloaded."
          );
        } catch (error: any) {
          console.error("Error downloading ID card:", error);

          if (error.response?.status === 404) {
            toast.error("Customer created but ID card file not found");
          } else if (error.response?.status === 429) {
            toast.error("Too many download requests. Please try again later.");
          } else if (error.code === "ECONNABORTED") {
            toast.error("Download timeout. Please try again.");
          } else {
            toast.error(
              "Customer created but failed to download ID card"
            );
          }
        }
      } else {
        toast.success("Customer created successfully!");
      }
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    },
  });
};

// Hook: Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> & { profile_image?: File | string } }) => {
      // If there's a File for profile_image, send multipart/form-data
      if (data.profile_image && typeof data.profile_image !== 'string') {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'profile_image') {
              formData.append('profile_image', value as File);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        // include the id in the payload if backend expects it
        formData.append('id', id);
        const resp = await apiClient.put('/customer/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        return resp.data;
      }

      // Fallback: plain JSON update
      return customerApi.updateCustomer(id, data as Partial<Customer>);
    },
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

export function useDownloadIDCard() {
  return useMutation({
    mutationFn: async (filename: string) => {
      const response = await customerApi.downloadCustomerIDCard(filename);

      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append → click → clean up
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },

    onSuccess: () => {
      toast.success("ID card download initiated!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to download ID card");
    },
  });
}
export function useDownloadCustomerCsv() {
  return useMutation({
    mutationFn: async () => {
      const response = await customerApi.downloadCustomerCsv();

      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([response]));

      // Create a temporary anchor
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.csv");

      // Append → click → clean up
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },

    onSuccess: () => {
      toast.success("customer list download initiated!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to download customer list");
    },
  });
}

// Hook: Renew customer subscription
export function useRenewCustomerSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ customer_id, product_id }: { customer_id: string; product_id: string }) => {
      return customerApi.renewCustomerSubscription(customer_id, product_id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customer_id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.statistics() });
      toast.success('Customer subscription renewed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to renew subscription');
    },
  });
}


