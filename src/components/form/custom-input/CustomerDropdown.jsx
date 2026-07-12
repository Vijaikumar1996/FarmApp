import { useCustomers } from "../../../queries/useCustomer";
import SelectField from "../form-input/SelectField";

export default function CustomerDropdown({
  control,
  name = "customerId",
  label = "Customer",
  required = false,
  placeholder = "Select Customer",
}) {
  const { data } = useCustomers();
  console.log("CustomerDropdown data:", data);
  const options = (data?.data ?? data ?? []).map((customer) => ({
    id: String(customer.id),
    name: `${customer.customerName} - ${customer.mobileNo} - ${customer.deliveryLocationName} - ${customer.houseDoorNo}`,
  }));

  return (
    <SelectField
      name={name}
      control={control}
      label={label}
      required={required}
      options={options}
      placeholder={placeholder}
    />
  );
}
