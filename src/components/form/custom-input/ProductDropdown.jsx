import { useProductDropdown } from "../../../queries/useProduct";
import SelectField from "../form-input/SelectField";

export default function ProductDropdown({
  control,
  name = "productId",
  label = "Product",
  required = false,
  placeholder = "Select Product",
  error,
}) {
  const { data } = useProductDropdown();
  console.log("ProductDropdown data:", data);
  const options = data?.data ?? data ?? [];

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
