import { useMemo } from "react";

import { useAreaDropdown } from "../../../queries/useArea";
import SelectField from "../form-input/SelectField";

export default function AreaDropdown({
  control,
  name = "areaId",
  label = "Area",
  required = false,
  placeholder = "Select Area",
  error,
  excludedAreaIds = [],
}) {
  const { data } = useAreaDropdown();

  const options = useMemo(() => {
    const areas = data?.data ?? data ?? [];

    return areas.filter(
      (x) => !excludedAreaIds.includes(Number(x.id))
    );
  }, [data, excludedAreaIds]);

  return (
    <SelectField
      name={name}
      control={control}
      label={label}
      required={required}
      options={options}
      placeholder={placeholder}
      error={error}
    />
  );
}