import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeliveryVerification, markAllDelivered, saveVerification, searchDeliveryVerification } from "../services/deliveryVerificationService";
import toast from "react-hot-toast";

const DELIVERY_VERIFICATION = "delivery-verification";
const DELIVERY_VERIFICATION_DETAILS = "delivery-verification-details";
export function useDeliveryVerification(searchRequest) {


    return useQuery({

        queryKey: [
            DELIVERY_VERIFICATION,
            searchRequest
        ],

        queryFn: () =>
            searchDeliveryVerification(searchRequest),

        enabled: !!searchRequest.deliveryDate

    });

}

export function useMarkAllDelivered() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: markAllDelivered,

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    DELIVERY_VERIFICATION
                ]
            });

            toast.success(
                "All deliveries marked as delivered."
            );

        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to mark deliveries."
            );

        }

    });

}

export function useDeliveryVerificationDetails(
    customerId,
    deliveryDate
) {
    console.log("customerId", customerId);
    console.log("deliveryDate", deliveryDate);
    console.log(!!customerId);
    console.log(!!deliveryDate);
    return useQuery({

        queryKey: [
            DELIVERY_VERIFICATION_DETAILS,
            customerId,
            deliveryDate
        ],

        queryFn: () => {
            console.log("Query Function Executed");
            return getDeliveryVerification(
                customerId,
                deliveryDate
            );
        },

        enabled:
            !!customerId &&
            !!deliveryDate

    });

}

export function useSaveVerification() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: saveVerification,

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: [
                    DELIVERY_VERIFICATION
                ]
            });

            toast.success(
                "Delivery verified successfully."
            );

        }

    });

}