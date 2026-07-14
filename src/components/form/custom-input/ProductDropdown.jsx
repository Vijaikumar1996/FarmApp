import { useMemo } from "react";

import { useProductDropdown } from "../../../queries/useProduct";
import SelectField from "../form-input/SelectField";

export default function ProductDropdown({
  control,
  name = "productId",
  label = "Product",
  required = false,
  placeholder = "Select Product",
  error,
  excludedProductIds = [],
}) {
  const { data } = useProductDropdown();

  const options = useMemo(() => {
    const products = data?.data ?? data ?? [];

    return products.filter(
      (x) => !excludedProductIds.includes(Number(x.id))
    );
  }, [data, excludedProductIds]);

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