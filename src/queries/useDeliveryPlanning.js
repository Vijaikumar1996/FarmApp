import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    generateDelivery,
    getFarmSummary,
    getDriverLoading,
    getDeliveryBoySheet,
    getGenerationStatus,
    exportDeliveryBoySheet
} from "../services/deliveryPlanningService";

const FARM_SUMMARY = "farm-summary";
const DRIVER_LOADING = "driver-loading";
const DELIVERY_BOY = "delivery-boy";


export function useDeliveryGenerationStatus(deliveryDate) {
    return useQuery({
        queryKey: [
            "delivery-generation-status",
            deliveryDate
        ],

        queryFn: () =>
            getGenerationStatus(deliveryDate),

        enabled: !!deliveryDate
    });
}

export function useGenerateDelivery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateDelivery,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [FARM_SUMMARY, variables.deliveryDate],
            });

            queryClient.invalidateQueries({
                queryKey: [DRIVER_LOADING, variables.deliveryDate],
            });

            queryClient.invalidateQueries({
                queryKey: [DELIVERY_BOY, variables.deliveryDate],
            });

            toast.success("Delivery generated successfully.");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                "Failed to generate delivery."
            );
        },
    });
}

export function useFarmSummary(
    deliveryDate,
    categoryId
) {

    return useQuery({

        queryKey: [
            "farm-summary",
            deliveryDate,
            categoryId
        ],

        queryFn: () =>
            getFarmSummary(
                deliveryDate,
                categoryId
            ),

        enabled: !!deliveryDate

    });

}

export function useDriverLoading(deliveryDate) {
    return useQuery({
        queryKey: [DRIVER_LOADING, deliveryDate],
        queryFn: () => getDriverLoading(deliveryDate),
        enabled: !!deliveryDate,
    });
}

export function useDeliveryBoySheet(deliveryDate, areaId) {
    return useQuery({
        queryKey: [DELIVERY_BOY, deliveryDate, areaId],
        queryFn: () => getDeliveryBoySheet(deliveryDate, areaId),
        enabled: !!deliveryDate,
    });
}

export function useExportDeliveryBoySheet() {

    return useMutation({

        mutationFn: ({ deliveryDate, areaId }) =>
            exportDeliveryBoySheet(
                deliveryDate,
                areaId
            ),

        onSuccess: () => {

            toast.success("Delivery boy sheet exported successfully.");

        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Failed to export delivery boy sheet."
            );

        }

    });

}