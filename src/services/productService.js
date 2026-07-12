import apiClient from "./apiClient";

const API_URL = "/products";

export const searchProduct = async (payload) => {
  const { data } = await apiClient.post(`${API_URL}/search`, payload);

  return data;
};

export const getProduct = async (id) => {
  debugger;
  const { data } = await apiClient.get(`${API_URL}/${id}`);

  return data;
};

export const createProduct = async (payload) => {
  console.log("createProduct payload:", payload);
  const { data } = await apiClient.post(API_URL, payload);

  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await apiClient.put(`${API_URL}/${id}`, payload);

  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await apiClient.delete(`${API_URL}/${id}`);

  return data;
};

export const getProductDropdown = async () => {
  const { data } = await apiClient.get(`${API_URL}/dropdown`);

  return data;
};

export const updateProductPrice = async (id, payload) => {
  const { data } = await apiClient.post(`${API_URL}/${id}/price`, payload);

  return data;
};

export const getPriceHistory = async (id) => {
  const { data } = await apiClient.get(`${API_URL}/${id}/price-history`);

  return data;
};
