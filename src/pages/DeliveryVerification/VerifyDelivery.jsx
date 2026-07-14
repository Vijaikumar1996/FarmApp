import { useNavigate, useParams } from "react-router";
import VerifyDeliveryForm from "./VerifyDeliveryForm";
import {
  useDeliveryVerificationDetails,
  useSaveVerification
} from "../../queries/useDeliveryVerification";

export default function VerifyDelivery() {

  const navigate = useNavigate();
  const { customerId, deliveryDate } = useParams();

  const {
    data,
    isLoading,
    refetch
  } = useDeliveryVerificationDetails(
    customerId,
    deliveryDate
  );
  console.log("data", data);
  const saveMutation = useSaveVerification();
  const handleSubmit = async (payload) => {
    await saveMutation.mutateAsync(payload);
    await refetch();
    navigate("/deliveryverification");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No Data Found</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Delivery Verification</h1>
          <p className="text-gray-500 mt-1">Verify delivered products</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="border px-4 py-2 rounded-xl hover:bg-gray-50"
        >
          Back
        </button>
      </div>
      <VerifyDeliveryForm
        delivery={data}
        onSubmit={handleSubmit}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}