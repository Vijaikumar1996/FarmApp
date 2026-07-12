import { Controller } from "react-hook-form";

export default function CheckboxField({
  name,
  control,
  label,
  disabled = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <div className="flex items-center gap-3 h-full pt-7">
            <input
              id={name}
              type="checkbox"
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
              className="
                                h-5
                                w-5
                                rounded
                                border-gray-300
                                text-blue-600
                                focus:ring-blue-500
                                disabled:bg-gray-100
                                disabled:cursor-not-allowed
                            "
            />

            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium cursor-pointer"
              >
                {label}
              </label>
            )}
          </div>

          {fieldState.error && (
            <p className="text-red-500 text-sm mt-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
