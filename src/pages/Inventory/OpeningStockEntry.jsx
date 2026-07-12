import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import { useInventory } from "./hooks/useInventory";
import { useSaveOpeningStock } from "./hooks/useInventory";

export default function OpeningStockEntry() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { data = [], isLoading } = useInventory({
    stockDate: today,
  });

  const saveMutation = useSaveOpeningStock();

  const {
    control,

    register,

    handleSubmit,

    reset,
  } = useForm({
    defaultValues: {
      stockDate: today,

      items: [],
    },
  });

  const { fields } = useFieldArray({
    control,

    name: "items",
  });

  useEffect(() => {
    if (data.length > 0) {
      reset({
        stockDate: today,

        items: data.map((x) => ({
          productId: x.productId,

          productCode: x.productCode,

          productName: x.productName,

          quantity: x.availableStock ?? 0,
        })),
      });
    }
  }, [data]);

  const onSubmit = (values) => {
    saveMutation.mutate(values, {
      onSuccess: () => {
        navigate("/inventory");
      },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title="Opening Stock"

        subtitle="Enter today's available stock"
      />

      <div
        className="
                    bg-white
                    rounded-2xl
                    border
                    p-6
                "
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Code</th>

              <th className="text-left">Product</th>

              <th className="text-right">Available Stock</th>
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="border-b">
                <td className="py-3">{field.productCode}</td>

                <td>{field.productName}</td>

                <td>
                  <input
                    type="number"

                    step="0.01"

                    {...register(`items.${index}.quantity`)}

                    className="
                                                w-32
                                                border
                                                rounded-lg
                                                px-3
                                                py-2
                                                text-right
                                                ml-auto
                                            "
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"

          variant="secondary"

          onClick={() => navigate("/inventory")}
        >
          Cancel
        </Button>

        <Button
          type="submit"

          loading={saveMutation.isPending}
        >
          Save Opening Stock
        </Button>
      </div>
    </form>
  );
}
