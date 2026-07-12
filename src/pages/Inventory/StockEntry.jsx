// StockEntry.jsx

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function StockEntry() {
  const navigate = useNavigate();

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      entry_date: new Date().toISOString().split("T")[0],

      items: [
        {
          product_id: "",
          quantity: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const products = [
    { id: 1, name: "OLB" },
    { id: 2, name: "HLB" },
    { id: 3, name: "Paneer" },
    { id: 4, name: "Curd" },
    { id: 5, name: "Egg Tray" },
  ];

  const onSubmit = (data) => {
    console.log(data);

    // Save API

    navigate("/inventory");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Stock Entry</h1>

        <p className="text-sm text-gray-500 mt-1">
          Enter today's received stock
        </p>
      </div>

      {/* Entry Details */}

      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-5">Entry Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Entry Date</label>

            <input
              type="date"
              {...register("entry_date")}
              className="
                                w-full
                                border
                                border-gray-300
                                rounded-xl
                                px-4
                                py-2.5
                            "
            />
          </div>
        </div>
      </div>

      {/* Products */}

      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Stock Items</h2>

          <button
            type="button"
            onClick={() =>
              append({
                product_id: "",
                quantity: "",
              })
            }
            className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            rounded-xl
                            hover:bg-blue-700
                        "
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="
                                grid
                                grid-cols-12
                                gap-3
                                items-end
                            "
            >
              {/* Product */}

              <div className="col-span-8">
                <label className="block text-sm font-medium mb-2">
                  Product
                </label>

                <select
                  {...register(`items.${index}.product_id`)}
                  className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-2.5
                                    "
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty */}

              <div className="col-span-3">
                <label className="block text-sm font-medium mb-2">
                  Qty Received
                </label>

                <input
                  type="number"
                  min="0"
                  {...register(`items.${index}.quantity`)}
                  className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-2.5
                                    "
                />
              </div>

              {/* Remove */}

              <div className="col-span-1">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="
                                            p-2
                                            text-red-600
                                            hover:bg-red-50
                                            rounded-lg
                                        "
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/inventory")}
          className="
                        px-5
                        py-2.5
                        border
                        border-gray-300
                        rounded-xl
                    "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
                        px-5
                        py-2.5
                        bg-blue-600
                        text-white
                        rounded-xl
                        hover:bg-blue-700
                    "
        >
          Save Stock Entry
        </button>
      </div>
    </form>
  );
}
