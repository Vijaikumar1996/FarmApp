import SelectField from "../form-input/SelectField";

const statusOptions = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];

export default function StatusDropdown({
  control,
  name = "isActive",
  label = "Status",
  required = false,
  error,
  placeholder = "Select Status",
}) {
  return (
    <SelectField
      name={name}
      control={control}
      label={label}
      options={statusOptions}
      required={required}
      error={error}
      placeholder={placeholder}
    />
  );
}
