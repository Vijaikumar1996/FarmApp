import { useNavigate, useParams, useSearchParams } from "react-router";

import CustomerRequestForm from "./CustomerRequestForm";

import { useCustomerRequest } from "../../queries/useCustomerRequest";

export default function CustomerRequestView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: request, isLoading } = useCustomerRequest(id);

    const [searchParams] = useSearchParams();

    const deliveryDate = searchParams.get("deliveryDate");
    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <CustomerRequestForm
            request={request}
            readOnly={true}
            deliveryDate={deliveryDate}
            onClose={() => navigate("/customer-requests")}
        />
    );
}