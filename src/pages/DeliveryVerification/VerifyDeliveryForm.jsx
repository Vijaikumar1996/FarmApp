// VerifyDeliveryForm.jsx

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export default function VerifyDeliveryForm({ order, onSubmit }) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      items: order.items.map((item) => ({
        ...item,
        remarks: "",
        delivered_items: [
          {
            product: item.product,
            qty: item.qty,
          },
        ],
      })),
    },
  });

  const products = ["HLB", "OLB", "PKT", "Tender Coconut", "Paneer"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Order Details */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-gray-500">Order No</p>

          <p className="font-semibold">{order.order_no}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Customer</p>

          <p className="font-semibold">{order.customer}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Area</p>

          <p className="font-semibold">{order.area}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Delivery Date</p>

          <p className="font-semibold">{order.delivery_date}</p>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {order.items.map((item, itemIndex) => (
          <OrderedItemSection
            key={item.id}
            item={item}
            itemIndex={itemIndex}
            register={register}
            control={control}
            products={products}
          />
        ))}
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          className="
            px-5
            py-2.5
            border
            border-gray-300
            rounded-xl
            hover:bg-gray-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            px-5
            py-2.5
            rounded-xl
            bg-blue-600
            text-white
            hover:bg-blue-700
          "
        >
          Save Verification
        </button>
      </div>
    </form>
  );
}

function OrderedItemSection({ item, itemIndex, register, control, products }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${itemIndex}.delivered_items`,
  });

  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      {/* Ordered Product Details */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ordered Product
          </label>

          <input
            readOnly
            value={item.product}
            className="
              w-full
              border
              border-gray-300
              bg-gray-100
              rounded-xl
              px-4
              py-2.5
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ordered Qty</label>

          <input
            readOnly
            value={item.qty}
            className="
              w-full
              border
              border-gray-300
              bg-gray-100
              rounded-xl
              px-4
              py-2.5
            "
          />
        </div>
      </div>

      {/* Delivered Products */}

      <div className="space-y-4">
        {fields.map((field, deliveredIndex) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
            {/* Delivered Product */}

            <div className="col-span-6">
              <label className="block text-sm font-medium mb-2">
                Delivered Product
              </label>

              <select
                {...register(
                  `items.${itemIndex}.delivered_items.${deliveredIndex}.product`,
                )}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-2.5
                "
              >
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivered Qty */}

            <div className="col-span-4">
              <label className="block text-sm font-medium mb-2">
                Delivered Qty
              </label>

              <input
                type="number"
                min={0}
                {...register(
                  `items.${itemIndex}.delivered_items.${deliveredIndex}.qty`,
                )}
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

            <div className="col-span-2 flex items-end">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(deliveredIndex)}
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

      {/* Add Alternative Product */}

      <button
        type="button"
        onClick={() =>
          append({
            product: "",
            qty: "",
          })
        }
        className="
          mt-4
          inline-flex
          items-center
          gap-2
          text-blue-600
          font-medium
        "
      >
        <Plus size={16} />
        Add Delivered Product
      </button>

      {/* Remarks */}

      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">Remarks</label>

        <textarea
          rows={2}
          placeholder="Enter remarks"
          {...register(`items.${itemIndex}.remarks`)}
          className="
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-3
          "
        />
      </div>
    </div>
  );
}
