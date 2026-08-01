import { useEffect } from "react";

import DrawerForm from "../../components/common/DrawerForm";
import DeliveryLocationForm from "./DeliveryLocationForm";
import { useUpdateDeliveryLocation } from "../../queries/useDeliveryLocation";

export default function EditDeliveryLocation({ deliveryLocation, onClose }) {
  const updateDeliveryLocationMutation = useUpdateDeliveryLocation();

  const handleUpdateDeliveryLocation = async (data) => {
    const payload = {
      areaId: Number(data.areaId),

      locationName: data.locationName,

      deliveryOrder: Number(data.deliveryOrder),

      address: data.address,

      isActive: data.isActive === "true",
    };

    await updateDeliveryLocationMutation.mutateAsync({
      id: deliveryLocation.id,

      payload,
    });

    onClose();
  };

  return (
    <DrawerForm
      title="Edit Delivery Location"

      subtitle="Update delivery location"

      onClose={onClose}
    >
      <DeliveryLocationForm
        defaultValues={{
          areaId: deliveryLocation.areaId,

          locationName: deliveryLocation.locationName,

          deliveryOrder: deliveryLocation.deliveryOrder,

          address: deliveryLocation.address ?? "",

          isActive: deliveryLocation.isActive ? "true" : "false",
        }}

        onSubmit={handleUpdateDeliveryLocation}

        isLoading={updateDeliveryLocationMutation.isPending}

        onCancel={onClose}

        isEdit={true}
      />
    </DrawerForm>
  );
}
