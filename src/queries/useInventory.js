import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addInventoryTransaction,
  createDailyStock,
  getInventory,
  getInventoryByProduct,
  getInventoryTransactions,
} from "../services/inventoryService";

const QUERY_KEY = "inventory";

export const useInventory = (params) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getInventory(params),
  });
};

export const useInventoryByProduct = (productId, stockDate) => {
  return useQuery({
    enabled: !!productId,

    queryKey: [QUERY_KEY, productId, stockDate],

    queryFn: () => getInventoryByProduct(productId, stockDate),
  });
};

export const useInventoryTransactions = (productId, stockDate) => {
  return useQuery({
    enabled: !!productId,

    queryKey: ["inventory-transactions", productId, stockDate],

    queryFn: () => getInventoryTransactions(productId, stockDate),
  });
};

export const useCreateDailyStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDailyStock,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });
    },
  });
};

export const useAddInventoryTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInventoryTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-transactions"],
      });
    },
  });
};
