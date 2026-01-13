import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { officerApi,type LoginData,type Officer } from '../api/officerApi';
import { toast } from 'react-hot-toast'; 

// Query Keys
export const officerKeys = {
  all: ['officers'] as const,
  lists: () => [...officerKeys.all, 'list'] as const,
  list: (filters?: string) => [...officerKeys.lists(), { filters }] as const,
  details: () => [...officerKeys.all, 'detail'] as const,
  detail: () => [...officerKeys.details()] as const,
  logs: () => ['officers','logs'] as const
};

// Hook: Get all officers
export function useOfficers() {
  return useQuery({
    queryKey: officerKeys.lists(),
    queryFn: async () => {
      const response = await officerApi.getAllOfficers();
      return response.data;
    },
  });
}

// Hook: Get single officer
export function useOfficer() {
  return useQuery({
    queryKey: officerKeys.detail(),
    queryFn: async () => {
      const response = await officerApi.getOfficer();
      return response.data;
    },
    // enabled: !!id, // Only run query if id exists
  });
}

// Hook: Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => officerApi.login(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.detail() });
      queryClient.invalidateQueries({ queryKey: officerKeys.logs() });

      localStorage.setItem('token', data.data.token);
      toast.success(data.message || 'Login successful!');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || 'Login failed');
    },
  });
}
export function useLogout() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn:()=>officerApi.logout(),
    onSuccess:()=> {        
        toast.success("Logging out")
    },
  })
}
// Hook: Create officer mutation
export function useCreateOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Officer>) => officerApi.createOfficer(data),
    onSuccess: () => {
      // Invalidate and refetch officers list
      queryClient.invalidateQueries({ queryKey: officerKeys.lists() });
      toast.success('Officer created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create officer');
    },
  });
}

// Hook: Update officer mutation
// export function useUpdateOfficer() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Officer> }) =>
//       officerApi.updateOfficer(id, data),
//     onSuccess: (_, variables) => {
//       // Invalidate both the list and the specific officer detail
//       queryClient.invalidateQueries({ queryKey: officerKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: officerKeys.detail(variables.id) });
//       toast.success('Officer updated successfully!');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Failed to update officer');
//     },
//   });
// }

// Hook: Delete officer mutation
export function useDeleteOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => officerApi.deleteOfficer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: officerKeys.lists() });
      toast.success('Officer status changed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to chenge officer status');
    },
  });
}

// Hook get activity logs of all officers
export function useActivityLogs() {
  return useQuery({
    queryKey: officerKeys.logs(),
    queryFn: async () => {
      const response = await officerApi.activtyLog();
      // console.log("inside hook",response )
      return response.data

    },
  });
}
