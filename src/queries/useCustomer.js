import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../services/customerService";
import toast from "react-hot-toast";

const QUERY_KEY = "customers";

export function useCustomers() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getCustomers,
  });
}

export function useCustomer(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Customer created successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create customer.",
      );
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateCustomer(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Customer updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update customer.",
      );
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Customer deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete customer.",
      );
    },
  });
}
