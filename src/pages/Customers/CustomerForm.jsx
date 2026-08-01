import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Pencil } from "lucide-react";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";
import TextAreaField from "../../components/form/form-input/TextAreaField";
import Button from "../../components/ui/button/Button";

import { useAreas } from "../../queries/useArea";
import { useDeliveryLocations } from "../../queries/useDeliveryLocation";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "./CustomerSchema";
import StatusDropdown from "../../components/form/custom-input/StatusDropdown";

export default function CustomerForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  isEdit = false,
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });
  console.log(errors);
  const { data: areaData } = useAreas();
  const { data: deliveryLocationData } = useDeliveryLocations();

  const areas = areaData?.data ?? areaData ?? [];
  const deliveryLocations =
    deliveryLocationData?.data ?? deliveryLocationData ?? [];

  const selectedAreaId = watch("areaId");

  const areaOptions = useMemo(
    () =>
      areas.map((x) => ({
        id: x.id,
        name: `${x.areaCode} - ${x.areaName}`,
      })),
    [areas],
  );

  const deliveryLocationOptions = useMemo(
    () =>
      deliveryLocations
        .filter((x) => !selectedAreaId || x.areaId === Number(selectedAreaId))
        .map((x) => ({
          id: x.id,
          name: x.locationName,
        })),
    [deliveryLocations, selectedAreaId],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={3} gap={5}>
        <InputField
          name="customerName"
          control={control}
          label="Customer Name"
          placeholder="Enter Customer Name"
          required
        />

        <InputField
          name="mobileNo"
          control={control}
          label="Mobile Number"
          placeholder="Enter Mobile Number"
          required
        />

        <InputField
          name="alternateMobileNo"
          control={control}
          label="Alternate Mobile"
          placeholder="Enter Alternate Mobile"
        />

        <InputField
          name="email"
          control={control}
          label="Email"
          placeholder="Enter Email"
        />

        <SelectField
          name="areaId"
          control={control}
          label="Area"
          options={areaOptions}
          placeholder="Select Area"
          required
          error={errors.areaId}
        />

        <SelectField
          name="deliveryLocationId"
          control={control}
          required
          label="Delivery Location"
          options={deliveryLocationOptions}
          placeholder="Select Delivery Location"
          error={errors.deliveryLocationId}
        />

        <InputField
          name="houseDoorNo"
          control={control}
          label="House / Door No"
          placeholder="Enter House / Door No"
          required
        />

        <InputField
          name="landmark"
          control={control}
          label="Landmark"
          placeholder="Enter Landmark"
        />

        {isEdit && <StatusDropdown control={control} />}
      </FormGrid>
      <FormGrid cols={2} gap={5}>
        <TextAreaField
          name="remarks"
          control={control}
          label="Remarks"
          placeholder="Enter Remarks"
          rows={3}
        />

        <TextAreaField
          name="deliveryNotes"
          control={control}
          label="Delivery Notes"
          placeholder="Enter Delivery Notes"
          rows={3}
        />
      </FormGrid>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          startIcon={<X size={18} />}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          startIcon={isEdit ? <Pencil size={18} /> : <Save size={18} />}
        >
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Customer"
              : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
