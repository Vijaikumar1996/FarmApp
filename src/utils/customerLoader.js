import { getCustomerTypeahead } from "../services/customerService";

export const loadCustomerOptions = async (inputValue) => {
  const response = await getCustomerTypeahead(inputValue);

  const customers = response?.data ?? response ?? [];

  return customers.map((customer) => ({
    value: customer.id,

    label: customer.name,
  }));
};
