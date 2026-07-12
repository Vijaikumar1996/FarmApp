import { useFieldArray } from "react-hook-form";

import QuantityInput from "../../../components/form/form-input/QuantityInput";

export default function MonthlySchedule({ control, register, watch, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const schedules = watch("schedules") ?? [];

  const handleAdd = () => {
    append({
      dayOfWeek: null,
      dayOfMonth: 1,
      quantity: 1,
    });
  };

  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Monthly Schedule</h3>

        <button
          type="button"
          onClick={handleAdd}
          className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                    "
        >
          + Add Day
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-gray-500">No schedules added.</div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="
                                grid
                                grid-cols-12
                                gap-4
                                items-end
                            "
          >
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-2">Day</label>

              <input
                type="number"
                min="1"
                max="31"
                className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-2.5
                                    "
                {...register(`schedules.${index}.dayOfMonth`, {
                  valueAsNumber: true,
                })}
              />

              <p className="text-red-500 text-sm">
                {errors?.schedules?.[index]?.dayOfMonth?.message}
              </p>
            </div>

            <div className="col-span-5">
              <QuantityInput
                register={register}
                name={`schedules.${index}.quantity`}
                error={errors?.schedules?.[index]?.quantity?.message}
              />
            </div>

            <div className="col-span-2">
              <button
                type="button"
                onClick={() => remove(index)}
                className="
                                        bg-red-500
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                    "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
