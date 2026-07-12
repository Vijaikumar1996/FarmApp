import apiClient from "./apiClient";

const API_URL = "/ProductCategories";

export const getProductCategories = async () => {
  const { data } = await apiClient.get(`${API_URL}`);

  return data;
};
