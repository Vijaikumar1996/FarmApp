import apiClient from "./apiClient";

const API_URL = "/deliverylocations";

export const getDeliveryLocations = async () => {
  const { data } = await apiClient.get(API_URL);
  return data;
};

export const getDeliveryLocation = async (id) => {
  const { data } = await apiClient.get(`${API_URL}/${id}`);
  return data;
};

export const createDeliveryLocation = async (payload) => {
  const { data } = await apiClient.post(API_URL, payload);
  return data;
};

export const updateDeliveryLocation = async (id, payload) => {
  console.log("updateDeliveryLocation payload:", payload);
  const { data } = await apiClient.put(`${API_URL}/${id}`, payload);
  return data;
};

export const deleteDeliveryLocation = async (id) => {
  const { data } = await apiClient.delete(`${API_URL}/${id}`);
  return data;
};
