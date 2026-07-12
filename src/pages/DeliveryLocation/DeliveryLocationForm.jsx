import { Pencil, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";
import TextAreaField from "../../components/form/form-input/TextAreaField";
import Button from "../../components/ui/button/Button";

import { useAreas } from "../../queries/useArea";

export default function DeliveryLocationForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  isEdit = false,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const { data } = useAreas();

  const areas = data?.data ?? data ?? [];

  const areaOptions = areas.map((x) => ({
    id: x.id,
    name: x.areaName,
  }));

  const statusOptions = [
    { id: "true", name: "Active" },
    { id: "false", name: "Inactive" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={2} gap={5}>
        <SelectField
          name="areaId"
          control={control}
          label="Area"
          options={areaOptions}
          required
          error={errors.areaId}
          placeholder="Select Area"
        />

        <InputField
          name="locationName"
          control={control}
          label="Location Name"
          placeholder="Enter Location Name"
          required
        />

        <InputField
          name="deliveryOrder"
          control={control}
          type="number"
          label="Delivery Order"
          placeholder="Enter Delivery Order"
          required
        />

        {isEdit && (
          <SelectField
            name="isActive"
            control={control}
            label="Status"
            options={statusOptions}
          />
        )}
      </FormGrid>

      <TextAreaField
        name="address"
        control={control}
        label="Address"
        placeholder="Enter Address"
        rows={4}
      />

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
              ? "Update Delivery Location"
              : "Save Delivery Location"}
        </Button>
      </div>
    </form>
  );
}
