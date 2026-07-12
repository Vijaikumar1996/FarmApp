import { useFieldArray } from "react-hook-form";
import QuantityInput from "../../../components/form/form-input/QuantityInput";

const WEEK_DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

export default function WeeklySchedule({ control, register, watch }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const schedules = watch("schedules") ?? [];

  const isSelected = (day) => schedules.some((x) => x.dayOfWeek === day);

  const getIndex = (day) => schedules.findIndex((x) => x.dayOfWeek === day);

  const handleToggle = (day, checked) => {
    if (checked) {
      append({
        dayOfWeek: day,
        dayOfMonth: null,
        quantity: 1,
      });
    } else {
      const index = getIndex(day);

      if (index >= 0) remove(index);
    }
  };

  return (
    <div className="border rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-5">Weekly Schedule</h3>

      <div className="space-y-4">
        {WEEK_DAYS.map((day) => {
          const checked = isSelected(day.id);

          const index = getIndex(day.id);

          return (
            <div key={day.id} className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => handleToggle(day.id, e.target.checked)}
              />

              <div className="w-32">{day.name}</div>

              {checked ? (
                <QuantityInput
                  register={register}
                  name={`schedules.${index}.quantity`}
                />
              ) : (
                <QuantityInput register={() => ({})} name="" disabled />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
