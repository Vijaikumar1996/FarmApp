import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    createCustomerRequest,
    deleteCustomerRequest,
    getCustomerRequest,
    getCustomerRequests,
    getCustomerRequestLookup,
    updateCustomerRequest,
} from "../services/customerRequestService";

const QUERY_KEY = "customerRequests";

export function useCustomerRequests(params) {
    return useQuery({
        queryKey: [QUERY_KEY, params],
        queryFn: () => getCustomerRequests(params),
        // enabled: !!params,
    });
}

export function useCustomerRequest(id) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => getCustomerRequest(id),
        enabled: !!id,
    });
}

export function useCustomerRequestLookup(customerId, deliveryDate) {
    return useQuery({
        queryKey: ["customerRequestLookup", customerId, deliveryDate],
        queryFn: () => getCustomerRequestLookup(customerId, deliveryDate),
        enabled: !!customerId && !!deliveryDate,
    });
}

export function useCreateCustomerRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCustomerRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customerRequestLookup"],
            });

            toast.success("Customer request created successfully.");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ??
                error?.message ??
                "Failed to create customer request."
            );
        },
    });
}

export function useUpdateCustomerRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) =>
            console.log("Updatingsss customer request with id:", id, "and data:", data) ||
            updateCustomerRequest(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: ["customerRequestLookup"],
            });

            toast.success("Customer request updated successfully.");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ??
                error?.message ??
                "Failed to update customer request."
            );
        },
    });
}

export function useDeleteCustomerRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomerRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY],
            });

            queryClient.invalidateQueries({
                queryKey: ["customerRequestLookup"],
            });

            toast.success("Customer request deleted successfully.");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ??
                error?.message ??
                "Failed to delete customer request."
            );
        },
    });
}