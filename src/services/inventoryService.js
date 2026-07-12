import apiClient from "./apiClient";

const BASE_URL = "/inventory";

export const getInventory = async (params) => {
  const { data } = await apiClient.get(BASE_URL, { params });

  return data;
};

export const getInventoryByProduct = async (productId, stockDate) => {
  const { data } = await apiClient.get(`${BASE_URL}/${productId}`, {
    params: {
      stockDate,
    },
  });

  return data;
};

export const createDailyStock = async (request) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/create-daily-stock`,
    request,
  );

  return data;
};

export const addInventoryTransaction = async (request) => {
  const { data } = await apiClient.post(`${BASE_URL}/transaction`, request);

  return data;
};

export const getInventoryTransactions = async (productId, stockDate) => {
  const { data } = await apiClient.get(
    `${BASE_URL}/${productId}/transactions`,
    {
      params: {
        stockDate,
      },
    },
  );

  return data;
};

export const saveOpeningStock = (request) =>
  apiClient.post("/inventory/opening-stock", request);
