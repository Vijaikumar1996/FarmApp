import apiClient from "./apiClient";

const API_URL = "/customers";

export const getCustomers = async () => {
  const { data } = await apiClient.get(API_URL);

  return data;
};

export const getCustomer = async (id) => {
  const { data } = await apiClient.get(`${API_URL}/${id}`);

  return data;
};

export const createCustomer = async (payload) => {
  const { data } = await apiClient.post(API_URL, payload);

  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await apiClient.put(`${API_URL}/${id}`, payload);

  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await apiClient.delete(`${API_URL}/${id}`);

  return data;
};

export const getCustomerTypeahead = async (searchText = "") => {
  const { data } = await apiClient.get(`${API_URL}/typeahead`, {
    params: {
      searchText,
    },
  });

  return data;
};
