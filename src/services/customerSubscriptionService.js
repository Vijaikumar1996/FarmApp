import apiClient from "./apiClient";

const API_URL = "/customer-subscriptions";

export const getCustomerSubscriptions = async (params) => {
  const response = await apiClient.get(API_URL, {
    params,
  });

  return response.data;
};

export const getCustomerSubscriptionById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);

  return response.data;
};

export const createCustomerSubscription = async (data) => {
  console.log("Creating customer subscription with data:", data);
  const response = await apiClient.post(API_URL, data);

  return response.data;
};

export const updateCustomerSubscription = async (id, data) => {
  const response = await apiClient.put(`${API_URL}/${id}`, data);

  return response.data;
};

export const deleteCustomerSubscription = async (id) => {
  const response = await apiClient.delete(`${API_URL}/${id}`);

  return response.data;
};
