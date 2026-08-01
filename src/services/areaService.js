import apiClient from "./apiClient";

export const getAreas = async (params) => {
  const { data } = await apiClient.get("/areas", { params });
  return data;
};

export const getAreaDropdown = async () => {
  const { data } = await apiClient.get("/areas/dropdown");
  return data;
};

export const getAreaById = async (id) => {
  const { data } = await apiClient.get(`/areas/${id}`);
  return data;
};

export const createArea = async (payload) => {
  const { data } = await apiClient.post("/areas", payload);
  return data;
};

export const updateArea = async ({ id, payload }) => {
  const { data } = await apiClient.put(`/areas/${id}`, payload);
  return data;
};

export const deleteArea = async (id) => {
  const { data } = await apiClient.delete(`/areas/${id}`);
  return data;
};
