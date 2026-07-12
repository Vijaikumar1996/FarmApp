import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCustomerSubscription,
  deleteCustomerSubscription,
  getCustomerSubscriptionById,
  getCustomerSubscriptions,
  updateCustomerSubscription,
} from "../services/customerSubscriptionService";
import toast from "react-hot-toast";

const QUERY_KEY = "customer-subscriptions";

export const useCustomerSubscriptions = (params) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getCustomerSubscriptions(params),
  });
};

export const useCustomerSubscription = (id) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCustomerSubscriptionById(id),
    enabled: !!id,
  });
};

export const useCreateCustomerSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerSubscription,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Subscription created successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to create subscription.",
      );
    },
  });
};

export const useUpdateCustomerSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCustomerSubscription(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Subscription updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to update subscription.",
      );
    },
  });
};

export const useDeleteCustomerSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerSubscription,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Subscription deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to delete subscription.",
      );
    },
  });
};
