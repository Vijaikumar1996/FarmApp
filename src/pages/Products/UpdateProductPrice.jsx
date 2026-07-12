import { useForm } from "react-hook-form";

import InputField from "../../components/form/form-input/InputField";
import { useUpdateProductPrice } from "../../queries/useProduct";
import toast from "react-hot-toast";
import DateField from "../../components/form/form-input/DateField";

export default function UpdateProductPrice({ product, onClose }) {
  console.log("product", product);
  const updatePriceMutation = useUpdateProductPrice();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      sellingPrice: product.currentPrice,
      effectiveFrom: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data) => {
    updatePriceMutation.mutate(
      {
        id: product.id,
        payload: data,
      },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message ?? "Product price updated successfully.",
          );
          onClose();
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ??
            error?.message ??
            "Failed to update product price.";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Update Product Price</h2>

        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="border rounded-xl p-4 bg-blue-50">
          <p className="text-sm text-gray-500">Current Price</p>

          <p className="text-2xl font-bold text-blue-600">
            ₹ {product.currentPrice}
          </p>
        </div>

        <InputField
          name="sellingPrice"
          control={control}
          label="New Price"
          type="number"
          required
        />

        <DateField
          name="effectiveFrom"
          control={control}
          label="Effective From"
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updatePriceMutation.isPending}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
