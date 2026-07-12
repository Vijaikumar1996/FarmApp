import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Pencil } from "lucide-react";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import DateField from "../../components/form/form-input/DateField";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";

import Button from "../../components/ui/button/Button";

import SubscriptionSchedule from "./components/SubscriptionSchedule";

import {
  useCreateCustomerSubscription,
  useUpdateCustomerSubscription,
} from "../../queries/useCustomerSubscription";

import { customerSubscriptionSchema } from "./validations/customerSubscriptionSchema";
import ProductDropdown from "../../components/form/custom-input/ProductDropdown";
import { loadCustomerOptions } from "../../utils/customerLoader";
import StatusDropdown from "../../components/form/custom-input/StatusDropdown";
import InputField from "../../components/form/form-input/InputField";

export default function CustomerSubscriptionForm({
  subscription,
  customers,
  products,
  frequencies,
  onClose,
}) {
  const isEdit = !!subscription;

  const createMutation = useCreateCustomerSubscription();
  const updateMutation = useUpdateCustomerSubscription();
  const today = new Date().toISOString().split("T")[0];

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSubscriptionSchema),
    defaultValues: {
      customerId: "",
      productId: "",
      frequencyId: "",
      startDate: today,
      endDate: "",
      intervalDays: "",
      isActive: "true",
      schedules: [
        {
          dayOfWeek: null,
          dayOfMonth: null,
          patternOrder: 1,
          quantity: 1,
        },
      ],
    },
  });

  useEffect(() => {
    if (subscription) {
      console.log(
        "CustomerSubscriptionForm useEffect subscription:",
        subscription,
      );
      reset({
        ...subscription,
        intervalDays: subscription.intervalDays ?? "",
        isActive: subscription.isActive ? "true" : "false",
      });
    }
  }, [subscription, reset]);

  useEffect(() => {
    console.log("Validation Errors", errors);
  }, [errors]);

  const frequencyId = watch("frequencyId");

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!frequencyId) return;

    // Skip first render while editing
    if (isEdit && !isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    setValue("intervalDays", "");

    switch (Number(frequencyId)) {
      case 1: // Daily
      case 4: // Interval
        setValue("schedules", [
          {
            dayOfWeek: null,
            dayOfMonth: null,
            patternOrder: 1,
            quantity: 1,
          },
        ]);
        break;

      case 2: // Weekly
      case 3: // Monthly
        setValue("schedules", []);
        break;

      default:
        setValue("schedules", []);
        break;
    }

    isInitialized.current = true;
  }, [frequencyId, isEdit, setValue]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      isActive: data.isActive === "true",
      id: subscription?.id,
    };
    console.log("CustomerSubscriptionForm onSubmit payload:", payload);
    if (isEdit) {
      updateMutation.mutate(
        {
          id: subscription.id,
          data: payload,
        },
        {
          onSuccess: onClose,
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: onClose,
      });
    }
  };
  console.log("Form schedules:", watch("schedules"));
  return (
    <div className="p-6 bg-white rounded-2xl border">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Subscription" : "New Subscription"}
          </h2>
        </div>

        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormGrid cols={2} gap={5}>
          <AsyncTypeahead
            name="customerId"
            control={control}
            label="Customer"
            required
            loadOptions={loadCustomerOptions}
            selectedOption={
              subscription
                ? {
                  value: subscription.customerId,
                  label: subscription.customerName,
                }
                : null
            }
          />
          <ProductDropdown
            name="productId"
            control={control}
            label="Product"
            options={products}
            required
            error={errors.productId}
          />

          <SelectField
            name="frequencyId"
            control={control}
            label="Frequency"
            options={frequencies}
            required
            error={errors.frequencyId}
          />

          {Number(frequencyId) === 4 && (
            <InputField
              name="intervalDays"
              control={control}
              type="number"
              label="Interval (Days)"
              required
              error={errors.intervalDays}
            />
          )}

          <DateField
            name="startDate"
            control={control}
            label="Start Date"
            required
            error={errors.startDate}
          />

          <DateField name="endDate" control={control} label="End Date" />

          {isEdit && <StatusDropdown control={control} />}
        </FormGrid>

        <SubscriptionSchedule
          frequencyId={frequencyId}
          intervalDays={watch("intervalDays")}
          control={control}
          register={register}
          watch={watch}
          errors={errors}
        />

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            startIcon={<X size={18} />}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            startIcon={isEdit ? <Pencil size={18} /> : <Save size={18} />}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEdit
                ? "Update Subscription"
                : "Save Subscription"}
          </Button>
        </div>
      </form>
    </div>
  );
}
