import { Controller } from "react-hook-form";

export default function InputField({
  name,
  control,
  label,
  type = "text",
  placeholder,
  required = false,
  rules = {},
}) {
  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`w-full border px-3 py-2 rounded ${
                fieldState.error ? "border-red-500" : "border-gray-300"
              }`}
            />

            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
