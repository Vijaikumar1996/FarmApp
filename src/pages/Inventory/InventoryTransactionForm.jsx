import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import Button from "../../components/ui/button/Button";
import { useAddInventoryTransaction } from "../../queries/useInventory";

const schema = z.object({
  transactionType: z.string().min(1),

  quantity: z.coerce.number().positive(),

  remarks: z.string().optional(),
});

const transactionTypes = [
  {
    value: "Production",
    icon: "🥛",
  },

  {
    value: "Purchase",
    icon: "🛒",
  },

  {
    value: "Delivery",
    icon: "🚚",
  },

  {
    value: "Waste",
    icon: "🗑",
  },

  {
    value: "Adjustment",
    icon: "⚖",
  },
];

export default function InventoryTransactionForm({
  product,

  stockDate,
}) {
  const mutation = useAddInventoryTransaction();

  const {
    register,

    watch,

    setValue,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      transactionType: "Production",

      quantity: "",

      remarks: "",
    },
  });

  const selectedType = watch("transactionType");

  useEffect(() => {
    reset({
      transactionType: "Production",

      quantity: "",

      remarks: "",
    });
  }, [product]);

  const onSubmit = (values) => {
    mutation.mutate({
      transactionDate: stockDate,

      productId: product.productId,

      transactionType: values.transactionType,

      quantity: values.quantity,

      remarks: values.remarks,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3
        className="
                    font-semibold
                    text-lg
                "
      >
        Add Transaction
      </h3>

      <div
        className="
                    grid
                    grid-cols-2
                    gap-3
                "
      >
        {transactionTypes.map((item) => (
          <button
            key={item.value}

            type="button"

            onClick={() => setValue("transactionType", item.value)}

            className={`
                                rounded-xl
                                border
                                p-4
                                transition

                                ${
                                  selectedType === item.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                                }
                            `}
          >
            <div className="text-2xl">{item.icon}</div>

            <div>{item.value}</div>
          </button>
        ))}
      </div>

      <div>
        <label>Quantity</label>

        <input
          type="number"

          step="0.01"

          {...register("quantity")}

          className="
                        w-full
                        border
                        rounded-xl
                        p-3
                    "
        />

        <p className="text-red-500">{errors.quantity?.message}</p>
      </div>

      <div>
        <label>Remarks</label>

        <textarea
          rows={3}

          {...register("remarks")}

          className="
                        w-full
                        border
                        rounded-xl
                        p-3
                    "
        />
      </div>

      <Button
        type="submit"

        loading={mutation.isPending}

        className="w-full"
      >
        Save Transaction
      </Button>
    </form>
  );
}
