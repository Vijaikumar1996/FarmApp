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

    // CREDIT reduces outstanding
    // DEBIT increases outstanding
    const adjustmentAmount =
        adjustmentType === "CREDIT"
            ? amount
            : -amount;

    const balanceAfterAdjustment =
        summary.totalOutstanding - adjustmentAmount;

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >

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

                    {/* Current Outstanding */}

                    <div>
                        <label>
                            Current Outstanding
                        </label>

                        <p>
                            ₹{summary.totalOutstanding.toFixed(2)}
                        </p>
                    </div>

                    {/* Adjustment */}

                    <div>
                        <label>
                            Adjustment
                        </label>

                        <p
                            className={
                                adjustmentType === "CREDIT"
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                            }
                        >
                            {adjustmentType} ₹{amount.toFixed(2)}
                        </p>
                    </div>

                    {/* Balance After Adjustment */}

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

            {/* Actions */}

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