import { useNavigate } from "react-router";
import CustomerRequestForm from "./CustomerRequestForm";

export default function CustomerRequestCreate() {
  const navigate = useNavigate();
  return <CustomerRequestForm onClose={() => navigate("/customer-requests")} />;
}
