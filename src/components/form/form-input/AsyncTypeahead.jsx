import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";

export default function AsyncTypeahead({
  name,
  control,
  label,
  loadOptions,
  selectedOption = null,
  placeholder = "Search...",
  required = false,
  isClearable = true,
  defaultOptions = true,
  isDisabled = false,
}) {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <AsyncTypeaheadControl
            field={field}
            fieldState={fieldState}
            loadOptions={loadOptions}
            selectedOption={selectedOption}
            placeholder={placeholder}
            isClearable={isClearable}
            defaultOptions={defaultOptions}
            isDisabled={isDisabled}
          />
        )}
      />
    </div>
  );
}

function AsyncTypeaheadControl({
  field,
  fieldState,
  loadOptions,
  selectedOption,
  placeholder,
  isClearable,
  defaultOptions,
  isDisabled,
}) {
  const [option, setOption] = useState(selectedOption);

  useEffect(() => {
    if (selectedOption) {
      setOption(selectedOption);
    } else if (!field.value) {
      setOption(null);
    }
  }, [selectedOption, field.value]);

  return (
    <>
      <AsyncSelect
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        value={option}
        onChange={(selected) => {
          setOption(selected);
          field.onChange(selected?.value ?? null);
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: 44,
            borderRadius: 12,
            borderColor: fieldState.error ? "#ef4444" : "#d1d5db",
          }),
        }}
      />

      {fieldState.error && (
        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
      )}
    </>
  );
}
