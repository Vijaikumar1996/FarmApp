import DrawerForm from "../../components/common/DrawerForm";
import AreaForm from "./AreaForm";
import { useCreateArea } from "../../queries/useArea";

export default function CreateArea({ onClose }) {
  const createAreaMutation = useCreateArea();

  const handleCreateArea = async (data) => {
    await createAreaMutation.mutateAsync({
      areaCode: data.areaCode,
      areaName: data.areaName,
      isActive: data.isActive === "true",
    });

    onClose();
  };

  return (
    <DrawerForm
      title="Add Area"
      subtitle="Create delivery area"
      onClose={onClose}
    >
      <AreaForm
        defaultValues={{ areaCode: "", areaName: "", isActive: "true" }}
        onSubmit={handleCreateArea}
        isLoading={createAreaMutation.isPending}
        onCancel={onClose}
        isEdit={false}
      />
    </DrawerForm>
  );
}
