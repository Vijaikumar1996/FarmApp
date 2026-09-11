import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
    generateDelivery,
    getFarmSummary,
    getDriverLoading,
    getDeliveryBoySheet,
    getDeliveryBoySheetPreview,
    getGenerationStatus,
    exportDeliveryBoySheet,
    getExpectedDeliveries,
    pauseExpectedDelivery,
    holdExpectedDelivery,
    holdAllExpectedDeliveries
} from "../services/deliveryPlanningService";


const FARM_SUMMARY = "farm-summary";
const DRIVER_LOADING = "driver-loading";
const DELIVERY_BOY = "delivery-boy";
const DELIVERY_BOY_PREVIEW = "delivery-boy-preview";
const EXPECTED_DELIVERIES = "expected-deliveries";


// ============================================================
// DELIVERY GENERATION STATUS
// ============================================================

export function useDeliveryGenerationStatus(
    deliveryDate
) {

    return useQuery({

        queryKey: [
            "delivery-generation-status",
            deliveryDate
        ],

        queryFn: () =>
            getGenerationStatus(
                deliveryDate
            ),

        enabled: !!deliveryDate
    });

}


// ============================================================
// GENERATE DELIVERY
// ============================================================

export function useGenerateDelivery() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn:
            generateDelivery,

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    FARM_SUMMARY,
                    variables.deliveryDate
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    DRIVER_LOADING,
                    variables.deliveryDate
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    DELIVERY_BOY,
                    variables.deliveryDate
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    DELIVERY_BOY_PREVIEW,
                    variables.deliveryDate
                ]
            });

            queryClient.invalidateQueries({
                queryKey: [
                    EXPECTED_DELIVERIES,
                    variables.deliveryDate
                ]
            });

            toast.success(
                "Delivery generated successfully."
            );
        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to generate delivery."
            );

        },

    });

}


// ============================================================
// FARM SUMMARY
// ============================================================

export function useFarmSummary(
    deliveryDate,
    categoryId
) {

    return useQuery({

        queryKey: [
            FARM_SUMMARY,
            deliveryDate,
            categoryId
        ],

        queryFn: () =>
            getFarmSummary(
                deliveryDate,
                categoryId
            ),

        enabled:
            !!deliveryDate

    });

}


// ============================================================
// DRIVER LOADING
// ============================================================

export function useDriverLoading(
    deliveryDate
) {

    return useQuery({

        queryKey: [
            DRIVER_LOADING,
            deliveryDate
        ],

        queryFn: () =>
            getDriverLoading(
                deliveryDate
            ),

        enabled:
            !!deliveryDate,

    });

}


// ============================================================
// DELIVERY BOY SHEET
// ============================================================

export function useDeliveryBoySheet(
    deliveryDate,
    areaId
) {

    return useQuery({

        queryKey: [
            DELIVERY_BOY,
            deliveryDate,
            areaId
        ],

        queryFn: () =>
            getDeliveryBoySheet(
                deliveryDate,
                areaId
            ),

        enabled:
            !!deliveryDate,

    });

}


// ============================================================
// DELIVERY BOY SHEET PREVIEW
// ============================================================

export function useDeliveryBoySheetPreview(
    deliveryDate,
    areaId,
    enabled = true
) {

    return useQuery({

        queryKey: [
            DELIVERY_BOY_PREVIEW,
            deliveryDate,
            areaId
        ],

        queryFn: () =>
            getDeliveryBoySheetPreview(
                deliveryDate,
                areaId
            ),

        enabled:
            enabled &&
            !!deliveryDate,

        staleTime: 0,

    });

}


// ============================================================
// EXPORT DELIVERY BOY SHEET
// ============================================================

export function useExportDeliveryBoySheet() {

    return useMutation({

        mutationFn: ({
            deliveryDate,
            areaId
        }) =>
            exportDeliveryBoySheet(
                deliveryDate,
                areaId
            ),

        onSuccess: () => {

            toast.success(
                "Delivery boy sheet exported successfully."
            );

        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to export delivery boy sheet."
            );

        }

    });

}


// ============================================================
// EXPECTED DELIVERIES
// ============================================================

export function useExpectedDeliveries(
    deliveryDate,
    source,
    productId
) {

    return useQuery({

        queryKey: [
            EXPECTED_DELIVERIES,
            deliveryDate,
            source,
            productId
        ],

        queryFn: () =>
            getExpectedDeliveries(
                deliveryDate,
                source,
                productId
            ),

        enabled:
            !!deliveryDate &&
            !!source &&
            !!productId

    });

}


// ============================================================
// PAUSE EXPECTED DELIVERY
// ============================================================

export function usePauseExpectedDelivery() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: ({
            subscriptionId,
            deliveryDate
        }) =>
            pauseExpectedDelivery(
                subscriptionId,
                deliveryDate
            ),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    EXPECTED_DELIVERIES,
                    variables.deliveryDate
                ]
            });

            toast.success(
                "Delivery paused successfully."
            );
        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to pause delivery."
            );
        }

    });

}


// ============================================================
// HOLD EXPECTED DELIVERY
// ============================================================

export function useHoldExpectedDelivery() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: ({
            subscriptionId,
            deliveryDate,
            productId,
            quantity
        }) =>
            holdExpectedDelivery(
                subscriptionId,
                deliveryDate,
                productId,
                quantity
            ),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    EXPECTED_DELIVERIES,
                    variables.deliveryDate
                ]
            });

            toast.success(
                "Delivery put on hold successfully."
            );
        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to hold delivery."
            );
        }

    });

}


// ============================================================
// HOLD ALL EXPECTED DELIVERIES
// ============================================================

export function useHoldAllExpectedDeliveries() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: ({
            deliveryDate,
            productId,
            source
        }) =>
            holdAllExpectedDeliveries(
                deliveryDate,
                productId,
                source
            ),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    EXPECTED_DELIVERIES,
                    variables.deliveryDate
                ]
            });

            toast.success(
                "All expected deliveries have been put on hold."
            );
        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to hold all deliveries."
            );
        }

    });

}