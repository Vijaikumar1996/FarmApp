import DrawerForm from "../../components/common/DrawerForm";
import DeliveryLocationForm from "./DeliveryLocationForm";
import { useCreateDeliveryLocation } from "../../queries/useDeliveryLocation";

export default function CreateDeliveryLocation({ onClose }) {
  const createDeliveryLocationMutation = useCreateDeliveryLocation();

  const handleCreateDeliveryLocation = async (data) => {
    const payload = {
      areaId: Number(data.areaId),

      locationName: data.locationName,

      deliveryOrder: Number(data.deliveryOrder),

      address: data.address,
    };

    await createDeliveryLocationMutation.mutateAsync(payload);

    onClose();
  };

  return (
    <DrawerForm
      title="Add Delivery Location"

      subtitle="Create delivery location"

      onClose={onClose}
    >
      <DeliveryLocationForm
        defaultValues={{
          areaId: "",

          locationName: "",

          deliveryOrder: 1,

          address: "",
        }}

        onSubmit={handleCreateDeliveryLocation}

        isLoading={createDeliveryLocationMutation.isPending}

        onCancel={onClose}
      />
    </DrawerForm>
  );
}
