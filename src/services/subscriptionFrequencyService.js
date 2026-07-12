import apiClient from "./apiClient";

const API_URL = "/subscription-frequencies";

export const getSubscriptionFrequencyDropdown = async () => {
  const response = await apiClient.get(`${API_URL}/dropdown`);
  return response.data;
};
