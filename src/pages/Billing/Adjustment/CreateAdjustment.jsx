import DrawerForm from "../../../components/common/DrawerForm";
import { useSaveAdjustment } from "../../../queries/useBilling";

import AdjustmentForm from "./AdjustmentForm";



export default function CreateAdjustment({
    customerId,
    billingMonth,
    summary,
    onClose,
    onSuccess
}) {

    const saveAdjustmentMutation =
        useSaveAdjustment();

    const handleSaveAdjustment = async (data) => {

        await saveAdjustmentMutation.mutateAsync({

            customerId,

            billingMonth,

            adjustmentDate: data.adjustmentDate,

            adjustmentType: data.adjustmentType,

            amount: Number(data.amount),

            reason: data.reason,

            remarks: data.remarks

        });

        onSuccess?.();

        onClose();

    };

    return (

        <DrawerForm

            title="Billing Adjustment"

            subtitle="Add billing adjustment"

            onClose={onClose}

        >

            <AdjustmentForm

                summary={summary}

                defaultValues={{

                    adjustmentDate: new Date(),

                    adjustmentType: "CREDIT",

                    amount: "",

                    reason: "",

                    remarks: ""

                }}

                onSubmit={handleSaveAdjustment}

                onCancel={onClose}

                isLoading={saveAdjustmentMutation.isPending}

            />

        </DrawerForm>

    );

}