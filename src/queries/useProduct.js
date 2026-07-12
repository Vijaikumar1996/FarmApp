import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  searchProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDropdown,
  updateProductPrice,
  getPriceHistory,
} from "../services/productService";
import toast from "react-hot-toast";

const QUERY_KEY = "products";

export function useProductSearch(payload) {
  return useQuery({
    queryKey: [QUERY_KEY, payload],

    queryFn: () => searchProduct(payload),
  });
}

export function useProductById(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],

    queryFn: () => getProduct(id),

    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Product created successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create product.",
      );
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Product updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update product.",
      );
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Product deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete product.",
      );
    },
  });
}

export function useProductDropdown() {
  return useQuery({
    queryKey: ["product-dropdown"],

    queryFn: getProductDropdown,
  });
}

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateProductPrice(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      toast.success("Product price updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update product price.",
      );
    },
  });
}

export function usePriceHistory(id) {
  return useQuery({
    queryKey: ["price-history", id],

    queryFn: () => getPriceHistory(id),

    enabled: !!id,
  });
}
