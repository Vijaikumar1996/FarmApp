import Select from "react-select";
import { Controller } from "react-hook-form";

export default function SelectField({
  name,
  control,
  label,
  options = [],
  error,
  placeholder = "Select",
  disabled = false,
  required = false,
}) {
  const formattedOptions = options.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

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
        render={({ field, fieldState }) => {
          const selectedOption = formattedOptions.find(
            (opt) => opt.value === String(field.value),
          );

          return (
            <Select
              options={formattedOptions}
              value={selectedOption || null} // ✅ THIS FIXES DEFAULT VALUE
              onChange={(selected) =>
                field.onChange(selected ? selected.value : "")
              }
              placeholder={placeholder}
              isClearable={!required}
              isDisabled={disabled}
              className={`p-1 rounded ${
                fieldState.error ? "border-red-500" : "border-gray-300"
              }`}
              styles={{
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
          );
        }}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
