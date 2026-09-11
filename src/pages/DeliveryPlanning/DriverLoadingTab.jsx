import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import FormGrid from "../../components/form/FormGrid";
import DateField from "../../components/form/form-input/DateField";
import Button from "../../components/ui/button/Button";

import { useDriverLoading } from "../../queries/useDeliveryPlanning";

export default function DriverLoadingTab() {

  // Tomorrow's date
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

  // ---------------------------------------------------------
  // COPY SUMMARY
  // ---------------------------------------------------------

  const handleCopy = async () => {

    if (!data.length) {
      toast.error("No records found.");
      return;
    }

    let text = "";

    text += "🚛 Driver Loading\n\n";
    text += `Delivery Date : ${searchDate}\n\n`;

    data.forEach((area, index) => {

      text += `${index + 1}. ${area.areaName}\n`;

      text += `Total Litres : ${Number(area.totalLitres).toLocaleString()} L\n\n`;

      // Group products by category
      const categories = [];

      area.products.forEach(product => {

        const existingCategory = categories.find(
          x => x.categoryId === product.categoryId
        );

        if (existingCategory) {

          existingCategory.products.push(product);

        } else {

          categories.push({
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            products: [product]
          });

        }

      });

      // Products
      categories.forEach((category, categoryIndex) => {

        category.products.forEach(product => {

          text += `${product.productCode.padEnd(12)} ${product.quantity}\n`;

        });

        // Space between category groups
        if (categoryIndex < categories.length - 1) {
          text += "\n";
        }

      });

      text += "\n------------------------------\n\n";

    });

    await navigator.clipboard.writeText(text);

    toast.success("Driver loading copied.");
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="space-y-5">

      {/* ---------------------------------------------------
          SEARCH
      --------------------------------------------------- */}

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

      {/* ---------------------------------------------------
          LOADING
      --------------------------------------------------- */}

      {isLoading && (
        <div className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-10
          text-center
          text-gray-500
        ">
          Loading...
        </div>
      )}

      {/* ---------------------------------------------------
          NO DATA
      --------------------------------------------------- */}

      {!isLoading && data.length === 0 && (
        <div className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-10
          text-center
          text-gray-500
        ">
          No driver loading records found.
        </div>
      )}

      {/* ---------------------------------------------------
          AREA LIST
      --------------------------------------------------- */}

      {!isLoading && data.length > 0 && (

        <div className="
          rounded-xl
          border
          border-gray-200
          bg-white
          overflow-hidden
        ">

          <div className="
            grid
            grid-cols-1
            p-3
            lg:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            {data.map(area => {

              // ---------------------------------------------
              // GROUP PRODUCTS BY CATEGORY
              // ---------------------------------------------

              const categories = [];

              area.products.forEach(product => {

                const existingCategory = categories.find(
                  x => x.categoryId === product.categoryId
                );

                if (existingCategory) {

                  existingCategory.products.push(product);

                } else {

                  categories.push({
                    categoryId: product.categoryId,
                    categoryName: product.categoryName,
                    products: [product]
                  });

                }

              });

              return (

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

                  {/* -----------------------------------------
                      AREA HEADER
                  ----------------------------------------- */}

                  <div className="
                    bg-blue-50
                    px-4
                    py-3
                    border-b
                    flex
                    items-center
                    justify-between
                  ">

                    <h3 className="font-semibold text-blue-700">
                      📍 {area.areaName}
                    </h3>

                    <span className="
                      bg-blue-600
                      text-white
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                    ">
                      {Number(area.totalLitres).toLocaleString()} L
                    </span>

                  </div>

                  {/* -----------------------------------------
                      PRODUCTS
                  ----------------------------------------- */}

                  <div className="p-4">

                    {categories.map((category, categoryIndex) => (

                      <div
                        key={category.categoryId}
                        className={
                          categoryIndex > 0
                            ? "mt-5 pt-4 border-t border-gray-200"
                            : ""
                        }
                      >

                        <div className="space-y-3">

                          {category.products.map(product => (

                            <div
                              key={product.productId}
                              className="
                                flex
                                justify-between
                                items-center
                              "
                            >

                              {/* Product Code */}

                              <span className="font-medium">
                                {product.productCode}
                              </span>

                              {/* Quantity */}

                              <span className="
                                bg-blue-100
                                text-blue-700
                                px-3
                                py-1
                                rounded-full
                                font-semibold
                                min-w-[45px]
                                text-center
                              ">
                                {product.quantity}
                              </span>

                            </div>

                          ))}

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      )}

    </div>
  );
}