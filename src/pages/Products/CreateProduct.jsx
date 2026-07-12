import { useNavigate } from "react-router";

import ProductForm from "./ProductForm";

import { useCreateProduct } from "../../queries/useProduct";
import DrawerForm from "../../components/common/DrawerForm";

export default function CreateProduct({ onClose }) {
  const navigate = useNavigate();

  const createMutation = useCreateProduct();

  const defaultValues = {
    productCode: "",
    productName: "",
    categoryId: "",
    sellingPrice: "",
    litresPerUnit: "",
    trackInventory: true,
    displayOrder: 0,
  };

  const handleSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <DrawerForm
      title="Add Product"
      subtitle="Create a new product"
      onClose={onClose}
    >
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onClose()}
      />
    </DrawerForm>
  );
}
