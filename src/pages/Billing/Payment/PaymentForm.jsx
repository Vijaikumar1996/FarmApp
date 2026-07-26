import { useEffect } from "react";
import { useForm } from "react-hook-form";

import FormGrid from "../../../components/form/FormGrid";

import SelectField from "../../../components/form/form-input/SelectField";
//import DatePickerField from "../../../components/form/form-input/DatePickerField";
import InputField from "../../../components/form/form-input/InputField";
import DateField from "../../../components/form/form-input/DateField";

export default function PaymentForm({
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
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    useEffect(() => {

        if (summary) {

            setValue(
                "amount",
                summary.totalOutstanding
            );

        }

    }, [summary, setValue]);

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Bill Summary */}

            <div className="rounded-xl bg-blue-50 border border-blue-200 pt-2 p-4">

                <h3 className="font-semibold mb-4">

                    Bill Summary

                </h3>

                <FormGrid cols={2}>

                    <div>

                        <label>Previous Outstanding</label>

                        <p>

                            ₹{summary.previousOutstanding.toFixed(2)}

                        </p>

                    </div>

                    <div>

                        <label>Current Charges</label>

                        <p>

                            ₹{summary.currentCharges.toFixed(2)}

                        </p>

                    </div>

                    <div>

                        <label>Already Paid</label>

                        <p>

                            ₹{summary.paidAmount.toFixed(2)}

                        </p>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Total Outstanding

                        </label>

                        <p className="text-red-600 font-bold">

                            ₹{summary.totalOutstanding.toFixed(2)}

                        </p>

                    </div>

                </FormGrid>

            </div>

            {/* Payment */}

            <FormGrid cols={2}>

                <DateField
                    name="paymentDate"
                    label="Payment Date"
                    control={control}
                />

                <SelectField
                    name="paymentMode"
                    label="Payment Mode"
                    control={control}
                    options={[
                        {
                            id: "CASH",
                            name: "Cash"
                        },
                        {
                            id: "UPI",
                            name: "UPI"
                        },
                        {
                            id: "BANK",
                            name: "Bank Transfer"
                        }
                    ]}
                />

                <InputField
                    label="Amount"
                    name="amount"
                    type="number"
                    control={control}
                    register={register}
                    error={errors.amount}
                />

                <InputField
                    label="Reference No"
                    name="referenceNo"
                    control={control}
                    register={register}
                    error={errors.referenceNo}
                />

            </FormGrid>

            <InputField
                label="Remarks"
                name="remarks"
                control={control}
                register={register}
                error={errors.remarks}
            />

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="
                        px-5
                        py-2.5
                        border
                        rounded-xl
                    "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        px-5
                        py-2.5
                        bg-green-600
                        text-white
                        rounded-xl
                    "
                >
                    {isLoading
                        ? "Saving..."
                        : "Receive Payment"}
                </button>

            </div>

        </form>

    );

}