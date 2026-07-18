import { useForm } from "react-hook-form";

import FormGrid from "../../../components/form/FormGrid";
import InputField from "../../../components/form/form-input/InputField";

import SelectField from "../../../components/form/form-input/SelectField";
import DateField from "../../../components/form/form-input/DateField";

export default function AdjustmentForm({
    defaultValues,
    summary,
    onSubmit,
    onCancel,
    isLoading
}) {

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    const amount = Number(watch("amount") || 0);

    const adjustmentType = watch("adjustmentType");

    const balanceAfterAdjustment =
        adjustmentType === "CREDIT"
            ? summary.totalOutstanding - amount
            : summary.totalOutstanding + amount;

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >

            {/* Customer */}

            <div className="rounded-xl border bg-gray-50 p-4">

                <h3 className="font-semibold mb-4">

                    Customer Details

                </h3>

                <FormGrid cols={2}>

                    <div>

                        <label className="text-sm text-gray-500">

                            Customer

                        </label>

                        <p className="font-medium">

                            {summary.customerName}

                        </p>

                    </div>

                    <div>

                        <label className="text-sm text-gray-500">

                            Billing Month

                        </label>

                        <p>

                            {summary.billingMonth}

                        </p>

                    </div>

                </FormGrid>

            </div>

            {/* Current Bill */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                <h3 className="font-semibold mb-4">

                    Current Bill

                </h3>

                <FormGrid cols={2}>

                    <div>

                        <label>Outstanding</label>

                        <p className="font-semibold">

                            ₹{summary.totalOutstanding.toFixed(2)}

                        </p>

                    </div>

                </FormGrid>

            </div>

            {/* Adjustment */}

            <FormGrid cols={2}>

                <DateField
                    control={control}
                    name="adjustmentDate"
                    label="Adjustment Date"
                />

                <SelectField
                    control={control}
                    name="adjustmentType"
                    label="Adjustment Type"
                    options={[
                        {
                            id: "CREDIT",
                            name: "Credit"
                        },
                        {
                            id: "DEBIT",
                            name: "Debit"
                        }
                    ]}
                />

                <InputField
                    label="Amount"
                    name="amount"
                    control={control}
                    type="number"
                    register={register}
                    error={errors.amount}
                />

                <InputField
                    label="Reason"
                    name="reason"
                    control={control}
                    register={register}
                    error={errors.reason}
                />

            </FormGrid>

            <InputField
                label="Remarks"
                name="remarks"
                control={control}
                register={register}
                error={errors.remarks}
            />

            {/* Preview */}

            <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">

                <h3 className="font-semibold mb-4">

                    Adjustment Preview

                </h3>

                <FormGrid cols={2}>

                    <div>

                        <label>Current Outstanding</label>

                        <p>

                            ₹{summary.totalOutstanding.toFixed(2)}

                        </p>

                    </div>

                    <div>

                        <label>Adjustment</label>

                        <p>

                            {adjustmentType}

                            {" "}

                            ₹{amount.toFixed(2)}

                        </p>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Balance After Adjustment

                        </label>

                        <p className="text-red-600 font-bold">

                            ₹{balanceAfterAdjustment.toFixed(2)}

                        </p>

                    </div>

                </FormGrid>

            </div>

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="
                        border
                        rounded-xl
                        px-5
                        py-2.5
                    "
                >

                    Cancel

                </button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        bg-yellow-500
                        text-white
                        rounded-xl
                        px-5
                        py-2.5
                    "
                >

                    {isLoading
                        ? "Saving..."
                        : "Save Adjustment"}

                </button>

            </div>

        </form>

    );

}