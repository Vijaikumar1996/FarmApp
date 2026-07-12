import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from "../services/areaService";

export const useAreas = (params) =>
  useQuery({
    queryKey: ["areas", params],
    queryFn: () => getAreas(params),
  });

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArea,

    onSuccess: () => {
      toast.success("Area created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to create area.");
    },
  });
}

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArea,

    onSuccess: () => {
      toast.success("Area updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to update area.");
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArea,

    onSuccess: () => {
      toast.success("Area deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },
  });
};
