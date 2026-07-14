import apiClient from "./apiClient";

const BASE_URL = "/delivery-verifications";

export const searchDeliveryVerification = async (params) => {
    const response = await apiClient.get(
        `${BASE_URL}`,
        {
            params
        });

    return response.data;
};

export const markAllDelivered = async (payload) => {
    const response = await apiClient.put(
        `${BASE_URL}/mark-all-delivered`,
        payload
    );

    return response.data;
};

export const getDeliveryVerification =
    async (
        customerId,
        deliveryDate
    ) => {
        console.log("customerId", customerId);
        console.log("deliveryDate", deliveryDate);
        const response =
            await apiClient.get(
                `${BASE_URL}/details`,
                {
                    params: {
                        customerId,
                        deliveryDate
                    }
                });

        return response.data;

    };

export const saveVerification =
    async (payload) => {

        const response =
            await apiClient.put(
                `${BASE_URL}`,
                payload
            );

        return response.data;

    };