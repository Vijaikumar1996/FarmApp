import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
    searchBillings,
    getBillingDetails,
    savePayment,
    saveAdjustment
} from "../services/billingService";

const BILLING = "billing";
const BILLING_DETAILS = "billing-details";

export function useBilling(searchRequest) {

    return useQuery({

        queryKey: [
            BILLING,
            searchRequest
        ],

        queryFn: () =>
            searchBillings(searchRequest),

        enabled: !!searchRequest.billingMonth

    });

}

export function useBillingDetails(
    customerId,
    billingMonth
) {

    return useQuery({

        queryKey: [
            BILLING_DETAILS,
            customerId,
            billingMonth
        ],

        queryFn: () =>
            getBillingDetails(
                customerId,
                billingMonth
            ),

        enabled:
            !!customerId &&
            !!billingMonth

    });

}

export function useSavePayment() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: savePayment,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [BILLING]
            });

            queryClient.invalidateQueries({
                queryKey: [BILLING_DETAILS]
            });

            toast.success(
                "Payment saved successfully."
            );

        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to save payment."
            );

        }

    });

}

export function useSaveAdjustment() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: saveAdjustment,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [BILLING]
            });

            queryClient.invalidateQueries({
                queryKey: [BILLING_DETAILS]
            });

            toast.success(
                "Adjustment saved successfully."
            );

        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to save adjustment."
            );

        }

    });

}