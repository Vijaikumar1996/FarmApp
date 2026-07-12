import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Pencil } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import ProductDropdown from "../../components/form/custom-input/ProductDropdown";
import DateField from "../../components/form/form-input/DateField";
import TextAreaField from "../../components/form/form-input/TextAreaField";
import InputField from "../../components/form/form-input/InputField";
import Button from "../../components/ui/button/Button";
import {
    useCreateCustomerRequest,
    useUpdateCustomerRequest,
} from "../../queries/useCustomerRequest";
import { customerRequestSchema } from "./customerRequestSchema";
import FormGrid from "../../components/form/FormGrid";
import StatusDropdown from "../../components/form/custom-input/StatusDropdown";
import SelectField from "../../components/form/form-input/SelectField";

export default function RequestEditorDrawer({
    open,
    mode,
    customerId,
    subscription,
    request,
    onClose,
}) {
    const isEdit = !!request;
    console.log("RequestEditorDrawer", { open, mode, customerId, subscription, request });
    const createMutation = useCreateCustomerRequest();
    const updateMutation = useUpdateCustomerRequest();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = tomorrow.toISOString().split("T")[0];
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(customerRequestSchema),
        defaultValues: {
            requestAction: mode,
            productId: subscription?.productId?.toString() ?? "",
            quantity: 1,
            effectiveFrom: tomorrowDate,
            effectiveTo: "",
            remarks: "",
            status: "PENDING",
            isActive: "true",
        },
    });

    const statusOptions = [
        {
            id: "PENDING",
            name: "Pending",
        },
        {
            id: "CANCELLED",
            name: "Cancelled",
        },
    ];


    useEffect(() => {
        if (!open) return;
        if (request) {
            reset({
                id: request.id,
                requestAction: request.requestAction,
                productId: request.productId?.toString() ?? "",
                quantity: request.quantity ?? 1,
                effectiveFrom: request.effectiveFrom,
                effectiveTo: request.effectiveTo ?? "",
                remarks: request.remarks ?? "",
                status: request.status ?? "",
                isActive: "true"
            });
            return;
        }
        reset({
            requestAction: mode,
            productId: subscription?.productId?.toString() ?? "",
            quantity: 1,
            effectiveFrom: tomorrowDate,
            effectiveTo: mode === "ADD" ? tomorrowDate : "",
            remarks: "",
            isActive: "true"
        });
    }, [open, mode, request]);

    useEffect(() => {
        console.log("Validation Errors", errors);
    }, [errors]);


    const onSubmit = (data) => {
        const payload = {
            ...data,
            id: request?.id,
            customerId,
            isActive: true,
            subscriptionId: subscription?.subscriptionId ?? null,
            effectiveTo: data.effectiveTo || null,
        };
        if (isEdit) {
            console.log("Updating request with payload:", payload);
            updateMutation.mutate(
                { id: request.id, data: payload },
                { onSuccess: onClose },
            );
        } else {
            console.log("Creating request with payload:", payload);
            createMutation.mutate(payload, { onSuccess: onClose });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-1000">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="absolute right-0 top-0 h-full w-[500px] bg-white shadow-xl overflow-y-auto">
                <div className="flex justify-between items-center border-b p-5">
                    <h2 className="text-lg font-semibold">
                        {isEdit
                            ? "Edit Request"
                            : mode === "ADD"
                                ? "Add Product"
                                : mode === "REPLACE"
                                    ? "Replace Product"
                                    : "Pause Product"}
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
                    {subscription && subscription.productName && (
                        <div className="rounded-lg border bg-gray-50 p-4">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Current Subscription
                            </div>

                            <div className="mt-2 text-lg font-semibold">
                                {subscription.productName}
                            </div>

                            <div className="mt-1 text-sm text-gray-600">
                                {subscription.frequencyName} • Qty: {subscription.quantity}
                            </div>
                        </div>
                    )}

                    <FormGrid cols={1} gap={5}>

                        {(mode === "ADD" || mode === "REPLACE") && (
                            <>
                                <ProductDropdown
                                    name="productId"
                                    control={control}
                                    label="Product"
                                    required
                                    error={errors.productId}
                                />

                                <InputField
                                    name="quantity"
                                    control={control}
                                    label="Quantity"
                                    type="number"
                                    required
                                    error={errors.quantity}
                                />
                            </>
                        )}

                        <DateField
                            name="effectiveFrom"
                            control={control}
                            label="Effective From"
                            // disabled={true}
                            required
                            error={errors.effectiveFrom}
                        />
                        <DateField
                            name="effectiveTo"
                            control={control}
                            label="Effective To"
                            error={errors.effectiveTo}
                        />
                        <TextAreaField
                            name="remarks"
                            control={control}
                            label="Remarks"
                            rows={3}
                            error={errors.remarks}
                        />
                        {isEdit && (
                            <SelectField
                                name="status"
                                control={control}
                                label="Status"
                                options={statusOptions}
                            />

                        )}
                    </FormGrid>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            startIcon={<X size={18} />}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            startIcon={isEdit ? <Pencil size={18} /> : <Save size={18} />}
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEdit ? "Update Request" : "Save Request"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
