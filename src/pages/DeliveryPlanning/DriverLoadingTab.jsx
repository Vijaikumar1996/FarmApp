import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import FormGrid from "../../components/form/FormGrid";
import DateField from "../../components/form/form-input/DateField";
import Button from "../../components/ui/button/Button";

import { useDriverLoading } from "../../queries/useDeliveryPlanning";

export default function DriverLoadingTab() {

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultDate = tomorrow.toISOString().split("T")[0];

  const { control } = useForm({
    defaultValues: {
      deliveryDate: defaultDate
    }
  });

  const deliveryDate = useWatch({
    control,
    name: "deliveryDate"
  });

  const [searchDate, setSearchDate] = useState(null);

  const handleSearch = () => {

    setSearchDate(deliveryDate);

  };

  const {
    data = [],
    isLoading
  } = useDriverLoading(searchDate);

  console.log("Driver Loading Data:", data);

  const handleCopy = async () => {

    if (!data.length) {

      toast.error("No records found.");

      return;
    }

    let text = "";

    text += "🚛 Driver Loading\n\n";

    text += `Delivery Date : ${searchDate}\n\n`;

    data.forEach((area, index) => {

      text += `${index + 1}. ${area.areaName}\n\n`;

      area.products.forEach(product => {

        text += `${product.productCode.padEnd(12)} ${product.quantity}\n`;

      });

      text += "------------------------------\n\n";

    });

    await navigator.clipboard.writeText(text);

    toast.success("Driver loading copied.");

  };
  return (

    <div className="space-y-5">

      {/* Filters */}

      <div className="rounded-xl border border-gray-200 bg-white p-5">

        <FormGrid cols={4} gap={4}>

          <DateField
            control={control}
            name="deliveryDate"
            label="Delivery Date"
          />

          <div className="flex items-end gap-2">

            <Button
              type="button"
              onClick={handleSearch}
            >
              Search
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              disabled={!data.length}
            >
              Copy Summary
            </Button>

          </div>

        </FormGrid>

      </div>

      {/* Loading */}

      {isLoading && (

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">

          Loading...

        </div>

      )}

      {/* Empty */}

      {!isLoading && data.length === 0 && (

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">

          No driver loading records found.

        </div>

      )}

      {/* Area Cards */}

      {!isLoading &&



        <div
          className="rounded-xl border border-gray-200 bg-white overflow-hidden"
        >



          {/* Products */}

          <div className="grid grid-cols-1 p-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">

            {data.map(area => (

              <div
                key={area.areaId}
                className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                overflow-hidden
            "
              >

                {/* Header */}

                <div className="bg-blue-50 px-4 py-3 border-b">

                  <h3 className="font-semibold text-blue-700">
                    📍 {area.areaName}
                  </h3>

                </div>

                {/* Products */}

                <div className="p-4 space-y-3">

                  {area.products.map(product => (

                    <div
                      key={product.productId}
                      className="flex justify-between items-center"
                    >

                      <span className="font-medium">
                        {product.productCode}
                      </span>

                      <span
                        className="
                                bg-blue-100
                                text-blue-700
                                px-3
                                py-1
                                rounded-full
                                font-semibold
                                min-w-[45px]
                                text-center
                            "
                      >
                        {product.quantity}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>



      }

    </div>

  );

}