import apiClient from "./apiClient";

const API_URL = "/customer-requests";

export const getCustomerRequests = async (params) => {
    const { data } = await apiClient.get(API_URL, { params });
    return data;
};

export const getCustomerRequest = async (id) => {
    const { data } = await apiClient.get(`${API_URL}/${id}`);
    return data;
};

export const getCustomerRequestLookup = async (customerId, deliveryDate) => {
    const response = await apiClient.get(
        `${API_URL}/customer/${customerId}`,
        {
            params: {
                deliveryDate,
            },
        }
    );

    return response.data;
};

export const createCustomerRequest = async (payload) => {
    const { data } = await apiClient.post(API_URL, payload);
    return data;
};

export const updateCustomerRequest = async (id, payload) => {
    console.log("Updating customer request:", id, payload);

    await apiClient.put(`${API_URL}/${id}`, payload);
};

export const deleteCustomerRequest = async (id) => {
    await apiClient.delete(`${API_URL}/${id}`);
};
