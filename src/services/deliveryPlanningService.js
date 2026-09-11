import apiClient from "./apiClient";

const BASE_URL = "/DeliveryPlanning";


export const generateDelivery = async (payload) => {

    const response = await apiClient.post(
        `${BASE_URL}/generate`,
        payload
    );

    return response.data;
};


export const getGenerationStatus = async (
    deliveryDate
) => {

    const response = await apiClient.get(
        `${BASE_URL}/status`,
        {
            params: {
                deliveryDate
            }
        }
    );

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
        }
    );

    return response.data;
};


export const getDriverLoading = async (
    deliveryDate
) => {

    const response = await apiClient.get(
        `${BASE_URL}/driver-loading`,
        {
            params: {
                deliveryDate
            }
        }
    );

    return response.data;
};


// ============================================================
// DELIVERY BOY SHEET
// ============================================================

export const getDeliveryBoySheet = async (
    deliveryDate,
    areaId
) => {

    const response = await apiClient.get(
        `${BASE_URL}/delivery-boy-sheet`,
        {
            params: {
                deliveryDate,
                areaId: areaId || null
            }
        }
    );

    return response.data;
};


// ============================================================
// DELIVERY BOY SHEET PREVIEW
// ============================================================

export const getDeliveryBoySheetPreview = async (
    deliveryDate,
    areaId
) => {

    const response = await apiClient.get(
        `${BASE_URL}/delivery-boy-sheet/preview`,
        {
            params: {
                deliveryDate,
                areaId: areaId || null
            }
        }
    );

    return response.data;
};


// ============================================================
// EXPORT DELIVERY BOY SHEET
// ============================================================

export const exportDeliveryBoySheet = async (
    deliveryDate,
    areaId
) => {

    const response = await apiClient.get(
        `${BASE_URL}/delivery-boy-sheet/export`,
        {
            params: {
                deliveryDate,
                areaId: areaId || null
            },

            responseType: "blob"
        }
    );

    return response;
};


// ============================================================
// EXPECTED DELIVERIES
// ============================================================

export const getExpectedDeliveries = async (
    deliveryDate,
    source,
    productId
) => {

    const response = await apiClient.get(
        `${BASE_URL}/expected-deliveries`,
        {
            params: {
                deliveryDate,

                source,

                productId:
                    Number(productId) || undefined
            }
        }
    );

    return response.data;
};


// ============================================================
// PAUSE EXPECTED DELIVERY
// ============================================================

export const pauseExpectedDelivery = async (
    subscriptionId,
    deliveryDate
) => {

    const response = await apiClient.post(
        `${BASE_URL}/expected-deliveries/${subscriptionId}/pause`,
        {
            deliveryDate
        }
    );

    return response.data;
};


// ============================================================
// HOLD EXPECTED DELIVERY
// ============================================================

export const holdExpectedDelivery = async (
    subscriptionId,
    deliveryDate,
    productId,
    quantity
) => {

    const response = await apiClient.post(
        `${BASE_URL}/expected-deliveries/${subscriptionId}/hold`,
        {
            deliveryDate,
            productId,
            quantity
        }
    );

    return response.data;
};


// ============================================================
// HOLD ALL EXPECTED DELIVERIES
// ============================================================

export const holdAllExpectedDeliveries = async (
    deliveryDate,
    productId,
    source
) => {

    const response = await apiClient.post(
        `${BASE_URL}/expected-deliveries/hold-all`,
        {
            deliveryDate,
            productId,
            source
        }
    );

    return response.data;
};