import {
  useFieldArray,
  useForm
} from "react-hook-form";

import {
  Trash2,
  Plus
} from "lucide-react";

import { useEffect } from "react";
import ProductDropdown from "../../components/form/custom-input/ProductDropdown";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function VerifyDeliveryForm({
  delivery,
  onSubmit,
  isSaving
}) {
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue
  } = useForm({

    defaultValues: {
      customerId: delivery.customerId,
      deliveryDate: delivery.deliveryDate,
      remarks: delivery.remarks,
      items: delivery.items.map(x => ({
        deliveryDetailId: x.deliveryDetailId,
        productId: x.productId,
        productCode: x.productCode,
        productName: x.productName,
        plannedQty: x.plannedQty,
        deliveredQty: x.deliveredQty,
      }))
    }

  });



  useEffect(() => {
    reset({
      customerId: delivery.customerId,
      deliveryDate: delivery.deliveryDate,
      remarks: delivery.remarks,
      items: delivery.items
    });

  }, [delivery]);

  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: "items"
  });

  const items = watch("items");
  const remarks = watch("remarks");

  const getExcludedProductIds = (currentIndex) =>
    items
      .filter((item, index) =>
        item.deliveryDetailId || index !== currentIndex
      )
      .map(item => Number(item.productId))
      .filter(Boolean);


  const handleSave = (data) => {

    const invalidRow = data.items.find(item =>
      !item.deliveryDetailId &&
      (
        !item.productId ||
        Number(item.deliveredQty) <= 0
      )
    );

    if (invalidRow) {

      if (!invalidRow.productId) {
        toast.error("Please select a product for the extra product.");
        return;
      }

      if (Number(invalidRow.deliveredQty) <= 0) {
        toast.error("Delivered quantity should be greater than zero.");
        return;
      }
    }

    onSubmit(data);

  };

  return (

    <form
      onSubmit={handleSubmit(handleSave)}
      className="space-y-6"
    >

      {/* Customer Details */}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">

        <div className="flex items-center justify-between gap-6">

          <div className="grid flex-1 grid-cols-[1.5fr_4fr_1fr] gap-6">

            {/* Customer */}

            <div>
              <p className="text-xs text-gray-500">
                Customer
              </p>

              <p className="font-semibold">
                {delivery.customerName}
                <br />
                <span className="text-sm font-normal text-gray-600">
                  {delivery.mobileNumber}
                </span>
              </p>
            </div>

            {/* Address */}

            <div>
              <p className="text-xs text-gray-500">
                Address
              </p>

              <p
                className="font-semibold break-words"
                title={delivery.address}
              >
                {delivery.address}
              </p>
            </div>

            {/* Delivery Date */}

            <div>
              <p className="text-xs text-gray-500">
                Delivery Date
              </p>

              <p className="font-semibold whitespace-nowrap">
                {delivery.deliveryDate}
              </p>
            </div>

          </div>

          {/* Add Product */}

          <button
            type="button"
            onClick={() =>
              append({
                deliveryDetailId: null,
                productId: "",
                productCode: "",
                productName: "",
                plannedQty: 0,
                deliveredQty: 1,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Product
          </button>

        </div>

      </div>

      {/* Product Grid */}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Ordered</th>
              <th className="px-4 py-3 text-center">Delivered</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {
              fields.map((field, index) => {
                const delivered = Number(items[index]?.deliveredQty || 0);
                const planned = Number(items[index]?.plannedQty || 0);


                let status = "DELIVERED";

                if (delivered === 0) {
                  status = "NOT_DELIVERED";
                }
                else if (
                  delivered < planned
                ) {
                  status =
                    "PARTIAL_DELIVERED";
                }

                return (
                  <tr key={field.id} className="border-t">
                    <td className="px-4 py-3 min-w-[100px]">
                      {field.deliveryDetailId ? (
                        <span className="font-medium">
                          {field.productCode}
                        </span>
                      ) : (
                        <ProductDropdown
                          name={`items.${index}.productId`}
                          control={control}
                          label=""
                          excludedProductIds={getExcludedProductIds(index)}
                        />
                      )}
                    </td>

                    <td className="text-center">{planned}</td>
                    <td className="px-3 text-center ">
                      <input
                        type="number"
                        min={0}
                        {...register(`items.${index}.deliveredQty`, {
                          valueAsNumber: true
                        })}
                        className="w-24 mx-auto border rounded-lg px-3 py-2 text-center"
                      />
                    </td>

                    <td className="text-center min-w-[150px]">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : status === "NOT_DELIVERED"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                          }`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="text-center">
                      {!field.deliveryDetailId && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="text-red-600" size={18} />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })
            }

          </tbody>

        </table>

      </div>

      {/* Remarks */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="block text-sm font-medium mb-2">Remarks</label>
        <textarea
          rows={2}
          {...register("remarks")}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center">

        <div className="space-x-3">
          <button type="button"
            onClick={() => navigate(-1)}
            className="border px-5 py-2 rounded-xl">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"

          >
            {isSaving ? "Saving..." : "Save Verification"}
          </button>
        </div>
      </div>
    </form>
  );
}