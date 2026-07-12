import AreaForm from "./AreaForm";
import { useUpdateArea } from "../../queries/useArea";

export default function EditArea({ area, onClose }) {
  const updateMutation = useUpdateArea();

  const handleUpdateArea = async (data) => {
    console.log("handleUpdateArea data:", data);
    const payload = {
      areaCode: data.areaCode,
      areaName: data.areaName,
      isActive: data.isActive === "true",
    };

    await updateMutation.mutateAsync({
      id: area.id,
      payload,
    });

    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold">Edit Area</h2>
          <p className="text-sm text-gray-500 mt-1">Update delivery area</p>
        </div>
        <button onClick={onClose} className="text-2xl">
          ×
        </button>
      </div>

      <div className="p-6">
        <AreaForm
          defaultValues={{
            areaCode: area.areaCode,
            areaName: area.areaName,
            isActive: area.isActive,
          }}
          onSubmit={handleUpdateArea}
          isLoading={updateMutation.isPending}
          onCancel={onClose}
          isEdit={true}
        />
      </div>
    </div>
  );
}
