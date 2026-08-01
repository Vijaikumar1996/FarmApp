import DrawerForm from "../../components/common/DrawerForm";
import CustomerForm from "./CustomerForm";

import { useUpdateCustomer } from "../../queries/useCustomer";

export default function EditCustomer({ customer, onClose }) {
  const updateCustomerMutation = useUpdateCustomer();

  const handleUpdateCustomer = async (data) => {
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

      isActive: data.isActive === "true",
    };

    await updateCustomerMutation.mutateAsync({
      id: customer.id,

      payload,
    });

    onClose();
  };

  return (
    <DrawerForm
      title="Edit Customer"

      subtitle="Update customer details"

      onClose={onClose}
    >
      <CustomerForm
        defaultValues={{
          customerCode: customer.customerCode,

          customerName: customer.customerName,

          mobileNo: customer.mobileNo,

          alternateMobileNo: customer.alternateMobileNo ?? "",

          email: customer.email ?? "",

          areaId: customer.areaId,

          deliveryLocationId: customer.deliveryLocationId ?? "",

          houseDoorNo: customer.houseDoorNo,

          landmark: customer.landmark ?? "",

          remarks: customer.remarks ?? "",

          deliveryNotes: customer.deliveryNotes ?? "",
        
          isActive: customer.isActive === true ? "true" : "false",
        }}

        onSubmit={handleUpdateCustomer}

        isLoading={updateCustomerMutation.isPending}

        onCancel={onClose}

        isEdit={true}
      />
    </DrawerForm>
  );
}
