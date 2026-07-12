import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createDeliveryLocation,
  deleteDeliveryLocation,
  getDeliveryLocation,
  getDeliveryLocations,
  updateDeliveryLocation,
} from "../services/deliveryLocationService";

const QUERY_KEY = "deliveryLocations";

export function useDeliveryLocations() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getDeliveryLocations,
  });
}

export function useDeliveryLocation(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getDeliveryLocation(id),
    enabled: !!id,
  });
}

export function useCreateDeliveryLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeliveryLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Delivery location created successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create delivery location.",
      );
    },
  });
}

export function useUpdateDeliveryLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateDeliveryLocation(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Delivery location updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update delivery location.",
      );
    },
  });
}

export function useDeleteDeliveryLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeliveryLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Delivery location deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete delivery location.",
      );
    },
  });
}
