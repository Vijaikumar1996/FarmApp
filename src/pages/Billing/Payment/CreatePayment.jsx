import DrawerForm from "../../../components/common/DrawerForm";
import { useSavePayment } from "../../../queries/useBilling";

import PaymentForm from "./PaymentForm";



export default function CreatePayment({
    customerId,
    billingMonth,
    summary,
    onClose,
    onSuccess
}) {

    const savePaymentMutation =
        useSavePayment();

    const handleSavePayment = async (data) => {

        await savePaymentMutation.mutateAsync({

            customerId,

            billingMonth,

            paymentDate: data.paymentDate,

            paymentMode: data.paymentMode,

            amount: Number(data.amount),

            referenceNo: data.referenceNo,

            remarks: data.remarks

        });

        onSuccess?.();

        onClose();

    };

    return (

        <DrawerForm

            title="Receive Payment"

      
            onClose={onClose}

        >

            <PaymentForm

                summary={summary}

                defaultValues={{

                    paymentDate: new Date(),

                    paymentMode: "UPI",

                    amount: summary.totalOutstanding,

                    referenceNo: "",

                    remarks: ""

                }}

                onSubmit={handleSavePayment}

                onCancel={onClose}

                isLoading={savePaymentMutation.isPending}

            />

        </DrawerForm>

    );

}