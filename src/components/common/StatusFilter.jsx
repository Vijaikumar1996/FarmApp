import SelectField from "../form/form-input/SelectField";

export default function StatusFilter({
  control,
  name = "isActive",
  label = "Status",
}) {
  const statusOptions = [
    {
      id: "",
      name: "All",
    },
    {
      id: "true",
      name: "Active",
    },
    {
      id: "false",
      name: "Inactive",
    },
  ];

  return (
    <SelectField
      name={name}
      control={control}
      label={label}
      options={statusOptions}
    />
  );
}
