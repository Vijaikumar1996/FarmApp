import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, Pencil } from "lucide-react";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";
import Button from "../../components/ui/button/Button";

export default function AreaForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  isEdit = false,
}) {
  const areaSchema = z.object({
    areaCode: z
      .string()
      .trim()
      .min(1, "Area Code is required.")
      .max(10, "Maximum 10 characters allowed."),
    areaName: z
      .string()
      .trim()
      .min(1, "Area Name is required.")
      .max(100, "Maximum 100 characters allowed."),
    isActive: z.enum(["true", "false"]),
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(areaSchema),
    defaultValues,
  });

  const statusOptions = [
    { id: "true", name: "Active" },
    { id: "false", name: "Inactive" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={2} gap={6}>
        <InputField
          name="areaCode"
          control={control}
          label="Area Code"
          placeholder="Enter area code"
          required
        />

        <InputField
          name="areaName"
          control={control}
          label="Area Name"
          placeholder="Enter area name"
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

      <div className="flex items-center justify-end gap-3 pt-4">
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
          {isLoading ? "Saving..." : isEdit ? "Update Area" : "Save Area"}
        </Button>
      </div>
    </form>
  );
}
