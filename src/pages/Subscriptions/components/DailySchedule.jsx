import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import QuantityInput from "../../../components/form/form-input/QuantityInput";
import Button from "../../../components/ui/button/Button";

export default function DailySchedule({
  control,
  register,
  watch,
  errors,
  frequencyId,
}) {
  const { fields, append, replace } = useFieldArray({
    control,
    name: "schedules",
  });

  const schedules = watch("schedules") ?? [];

  useEffect(() => {
    if (fields.length === 0) {
      append({
        patternOrder: 1,
        quantity: 1,
      });
    }
  }, [fields.length, append]);

  const addDay = () => {
    append({
      patternOrder: fields.length + 1,
      quantity: 1,
    });
  };

  const removeDay = (index) => {
    const updated = schedules.filter((_, i) => i !== index);

    replace(
      updated.map((item, idx) => ({
        ...item,
        patternOrder: idx + 1,
      })),
    );
  };

  const label =
    Number(frequencyId) === 4 ? "Delivery" : "Day";

  const addButtonText =
    Number(frequencyId) === 4 ? "Add Delivery" : "Add Day";

  const footer =
    Number(frequencyId) === 4
      ? "The quantities repeat on each scheduled delivery."
      : "The quantities repeat every day.";

  return (
    <div className="rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daily Schedule</h3>

        <Button
          type="button"
          size="sm"
          variant="outline"
          startIcon={<Plus size={16} />}
          onClick={addDay}
        >
          {addButtonText}
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 items-end gap-3"
          >
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {label}
              </label>

              <div className="flex h-10 items-center justify-center rounded-lg border bg-gray-100">
                {index + 1}
              </div>

              <input
                type="hidden"
                {...register(`schedules.${index}.patternOrder`)}
                value={index + 1}
              />
            </div>

            <div className="col-span-8">
              <QuantityInput
                register={register}
                name={`schedules.${index}.quantity`}
                error={errors?.schedules?.[index]?.quantity?.message}
              />
            </div>

            <div className="col-span-2">
              <Button
                type="button"
                variant="outline"
                disabled={fields.length === 1}
                onClick={() => removeDay(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {footer}
      </p>
    </div>
  );
}