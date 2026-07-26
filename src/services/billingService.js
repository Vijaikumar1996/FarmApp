import apiClient from "./apiClient";

const BASE_URL = "/billing";

export const searchBillings = async (params) => {
    const response = await apiClient.get(
        `${BASE_URL}/monthly`,
        {
            params
        }
    );

    return response.data;
};

export const getBillingDetails = async (
    customerId,
    billingMonth
) => {

    const response = await apiClient.get(
        `${BASE_URL}/details`,
        {
            params: {
                customerId,
                billingMonth
            }
        }
    );

    return response.data;

};

export const savePayment = async (payload) => {
    const response = await apiClient.post(
        `${BASE_URL}/payment`,
        payload
    );

    return response.data;
};

export const saveAdjustment = async (payload) => {
    const response = await apiClient.post(
        `${BASE_URL}/adjustment`,
        payload
    );

    return response.data;
};

export const getSummaryBill = async (
    customerId,
    billingMonth
) => {

    const response = await apiClient.get(
        `${BASE_URL}/summary-bill`,
        {
            params: {
                customerId,
                billingMonth
            }
        });

    return response.data;

};