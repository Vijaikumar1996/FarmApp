import { useNavigate, useParams } from "react-router";

import CustomerSubscriptionForm from "./CustomerSubscriptionForm";

import { useCustomerSubscription } from "../../queries/useCustomerSubscription";
import { useCustomers } from "../../queries/useCustomer";
import { useProductDropdown } from "../../queries/useProduct";
import { useSubscriptionFrequencyDropdown } from "../../queries/useSubscriptionFrequency";

export default function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscriptionData, isLoading } = useCustomerSubscription(id);

  const { data: customerData } = useCustomers();
  const { data: productData } = useProductDropdown();
  const { data: frequencyData } = useSubscriptionFrequencyDropdown();

  const subscription = subscriptionData?.data ?? subscriptionData;
  console.log("EditSubscription subscription:", subscription);
  const customerOptions = (customerData?.data ?? customerData ?? []).map(
    (customer) => ({
      id: customer.id,
      name: `${customer.customerName} - ${customer.mobileNo} - ${customer.deliveryLocationName} - ${customer.houseDoorNo}`,
    }),
  );

  const productOptions = productData?.data ?? productData ?? [];
  const frequencyOptions = frequencyData?.data ?? frequencyData ?? [];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!subscription) {
    return <div className="p-6">Subscription not found.</div>;
  }

  return (
    <CustomerSubscriptionForm
      subscription={subscription}
      customers={customerOptions}
      products={productOptions}
      frequencies={frequencyOptions}
      onClose={() => navigate("/subscriptions")}
    />
  );
}
