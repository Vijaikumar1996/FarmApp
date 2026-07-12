import ProductForm from "./ProductForm";
import { useUpdateProduct } from "../../queries/useProduct";
import DrawerForm from "../../components/common/DrawerForm";

export default function EditProduct({ product, onClose }) {
  const updateMutation = useUpdateProduct();

  const defaultValues = {
    productCode: product.productCode,
    productName: product.productName,
    categoryId: product.categoryId,
    litresPerUnit: product.litresPerUnit || "",
    trackInventory: product.trackInventory,
    displayOrder: product.displayOrder,
    isActive: product.isActive === true ? "true" : "false",
  };

  const handleSubmit = (formData) => {
    console.log("EditProduct handleSubmit formData:", formData);
    formData.isActive = formData.isActive === "true";
    updateMutation.mutate(
      {
        id: product.id,
        payload: formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <DrawerForm
      title="Edit Product"
      subtitle="Update product details."
      onClose={onClose}
    >
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={onClose}
        isEdit={true}
      />
    </DrawerForm>
  );
}
