// VerifyDeliveryDrawer.jsx

import { useForm, useFieldArray } from "react-hook-form";

/* ---------------- Component ---------------- */

export default function VerifyDeliveryDrawer({ order, onClose }) {
  /* ---------------- Form ---------------- */

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      items: [
        {
          product: "HLB - Half Litre Bottle",
          ordered_qty: 2,
          delivered_qty: 2,
          item_status: "DELIVERED",
          remarks: "",
        },

        {
          product: "OLB - One Litre Bottle",
          ordered_qty: 1,
          delivered_qty: 1,
          item_status: "DELIVERED",
          remarks: "",
        },

        {
          product: "Tender Coconut",
          ordered_qty: 3,
          delivered_qty: 1,
          item_status: "PARTIAL",
          remarks: "Customer not available",
        },

        {
          product: "Paneer",
          ordered_qty: 1,
          delivered_qty: 0,
          item_status: "FAILED",
          remarks: "Out of stock",
        },
      ],
    },
  });

  /* ---------------- Field Array ---------------- */

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  /* ---------------- Submit ---------------- */

  const handleVerify = async (data) => {
    console.log("Verification Payload :", data);

    // API CALL HERE

    onClose();
  };

  /* ---------------- Summary ---------------- */

  const items = watch("items");

  const totalOrderedQty = items.reduce(
    (sum, item) => sum + Number(item.ordered_qty || 0),
    0,
  );

  const totalDeliveredQty = items.reduce(
    (sum, item) => sum + Number(item.delivered_qty || 0),
    0,
  );

  let finalStatus = "DELIVERED";

  if (totalDeliveredQty === 0) {
    finalStatus = "FAILED";
  } else if (totalDeliveredQty < totalOrderedQty) {
    finalStatus = "PARTIAL";
  }

  return (
    <form
      onSubmit={handleSubmit(handleVerify)}
      className="flex flex-col h-full"
    >
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Verify Order - {order?.order_no}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Verify actual delivered products
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            text-gray-500
            hover:text-black
            text-2xl
          "
        >
          ×
        </button>
      </div>

      {/* Customer Info */}

      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">Customer</p>

            <h3 className="mt-1 font-semibold text-gray-800">
              {order?.customer}
            </h3>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase">Area</p>

            <h3 className="mt-1 font-semibold text-gray-800">{order?.area}</h3>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase">Delivery Date</p>

            <h3 className="mt-1 font-semibold text-gray-800">
              {order?.delivery_date}
            </h3>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase">Total Items</p>

            <h3 className="mt-1 font-semibold text-gray-800">{order?.items}</h3>
          </div>
        </div>
      </div>

      {/* Items */}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header */}

          <div className="grid grid-cols-5 gap-4 bg-gray-50 border-b px-5 py-4">
            <div className="text-xs font-semibold uppercase text-gray-500">
              Product
            </div>

            <div className="text-xs font-semibold uppercase text-gray-500">
              Ordered Qty
            </div>

            <div className="text-xs font-semibold uppercase text-gray-500">
              Delivered Qty
            </div>

            <div className="text-xs font-semibold uppercase text-gray-500">
              Status
            </div>

            <div className="text-xs font-semibold uppercase text-gray-500">
              Remarks
            </div>
          </div>

          {/* Rows */}

          <div className="divide-y divide-gray-100">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-5 gap-4 px-5 py-4 items-center"
              >
                {/* Product */}

                <div>
                  <p className="font-medium text-gray-800">{field.product}</p>
                </div>

                {/* Ordered Qty */}

                <div>
                  <input
                    readOnly
                    {...register(`items.${index}.ordered_qty`)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-gray-100
                      px-4
                      py-2.5
                      text-sm
                    "
                  />
                </div>

                {/* Delivered Qty */}

                <div>
                  <input
                    type="number"
                    min={0}
                    {...register(`items.${index}.delivered_qty`)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-brand-500
                    "
                  />
                </div>

                {/* Status */}

                <div>
                  <select
                    {...register(`items.${index}.item_status`)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-brand-500
                    "
                  >
                    <option value="DELIVERED">Delivered</option>

                    <option value="PARTIAL">Partial</option>

                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                {/* Remarks */}

                <div>
                  <input
                    type="text"
                    placeholder="Remarks"
                    {...register(`items.${index}.remarks`)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-brand-500
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Ordered Qty</p>

            <h3 className="mt-2 text-3xl font-bold text-gray-800">
              {totalOrderedQty}
            </h3>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Delivered Qty</p>

            <h3 className="mt-2 text-3xl font-bold text-gray-800">
              {totalDeliveredQty}
            </h3>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm text-yellow-700">Final Order Status</p>

            <h3 className="mt-2 text-3xl font-bold text-yellow-700">
              {finalStatus}
            </h3>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-end gap-3 p-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="
            rounded-xl
            border
            border-gray-300
            px-5
            py-2.5
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-100
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-medium
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
