import DrawerForm from "../../components/common/DrawerForm";
import CustomerForm from "./CustomerForm";

import { useCreateCustomer } from "../../queries/useCustomer";

export default function CreateCustomer({ onClose }) {
  const createCustomerMutation = useCreateCustomer();

  const handleCreateCustomer = async (data) => {
    const payload = {
      customerName: data.customerName,

      mobileNo: data.mobileNo,

      alternateMobileNo: data.alternateMobileNo,

      email: data.email,

      areaId: Number(data.areaId),

      deliveryLocationId: data.deliveryLocationId
        ? Number(data.deliveryLocationId)
        : null,

      houseDoorNo: data.houseDoorNo,

      landmark: data.landmark,

      remarks: data.remarks,

      deliveryNotes: data.deliveryNotes,
    };

    await createCustomerMutation.mutateAsync(payload);

    onClose();
  };

  return (
    <DrawerForm
      title="Add Customer"

      subtitle="Create farm delivery customer"

      onClose={onClose}
    >
      <CustomerForm
        defaultValues={{
          customerCode: "",

          customerName: "",

          mobileNo: "",

          alternateMobileNo: "",

          email: "",

          areaId: "",

          deliveryLocationId: "",

          houseDoorNo: "",

          landmark: "",

          remarks: "",

          deliveryNotes: "",
        }}

        onSubmit={handleCreateCustomer}

        isLoading={createCustomerMutation.isPending}

        onCancel={onClose}
      />
    </DrawerForm>
  );
}
