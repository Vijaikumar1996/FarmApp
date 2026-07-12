import { useNavigate } from "react-router";

import CustomerSubscriptionForm from "./CustomerSubscriptionForm";

import { useCustomers } from "../../queries/useCustomer";
import { useProductDropdown } from "../../queries/useProduct";
import { useSubscriptionFrequencyDropdown } from "../../queries/useSubscriptionFrequency";

export default function CreateSubscription() {
  const navigate = useNavigate();

  const { data: customerData } = useCustomers();
  const { data: productData } = useProductDropdown();
  const { data: frequencyData } = useSubscriptionFrequencyDropdown();

  const customerOptions = (customerData?.data ?? customerData ?? []).map(
    (customer) => ({
      id: customer.id,
      name: `${customer.customerName} - ${customer.mobileNo} - ${customer.deliveryLocationName} - ${customer.houseDoorNo}`,
    }),
  );

  const productOptions = productData?.data ?? productData ?? [];
  const frequencyOptions = frequencyData?.data ?? frequencyData ?? [];

  return (
    <CustomerSubscriptionForm
      customers={customerOptions}
      products={productOptions}
      frequencies={frequencyOptions}
      onClose={() => navigate("/subscriptions")}
    />
  );
}
