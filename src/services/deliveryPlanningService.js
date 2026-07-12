import apiClient from "./apiClient";

const BASE_URL = "/DeliveryPlanning";

export const generateDelivery = async (payload) => {
    const response = await apiClient.post(`${BASE_URL}/generate`, payload);
    return response.data;
};

export const getGenerationStatus = async (deliveryDate) => {
    const response = await apiClient.get(
        `${BASE_URL}/status`,
        {
            params: {
                deliveryDate
            }
        });

    return response.data;
};

export const getFarmSummary = async (
    deliveryDate,
    categoryId
) => {

    const response = await apiClient.get(
        `${BASE_URL}/farm-summary`,
        {
            params: {
                deliveryDate,
                categoryId:
                    Number(categoryId) || undefined
            }
        });

    return response.data;

};

export const getDriverLoading = async (deliveryDate) => {
    const response = await apiClient.get(`${BASE_URL}/driver-loading`, {
        params: {
            deliveryDate,
        },
    });

    return response.data;
};

export const getDeliveryBoySheet = async (deliveryDate, areaId) => {
    const response = await apiClient.get(`${BASE_URL}/delivery-boy-sheet`, {
        params: {
            deliveryDate,
            areaId: areaId || null
        },
    });

    return response.data;
};

export const exportDeliveryBoySheet = async (deliveryDate, areaId) => {

    const response = await apiClient.get(
        `${BASE_URL}/delivery-boy-sheet/export`,
        {
            params: {
                deliveryDate,
                areaId: areaId || null
            },
            responseType: "blob"
        });

    return response;

};