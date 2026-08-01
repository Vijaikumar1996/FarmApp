import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import FormGrid from "../../components/form/FormGrid";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";

import DateField from "../../components/form/form-input/DateField";
import SelectField from "../../components/form/form-input/SelectField";

import { useProductCategories } from "../../queries/useProductCategory";
import { useFarmSummary } from "../../queries/useDeliveryPlanning";
import { getTomorrowDate } from "../../utils/commonUtils";

export default function FarmSummaryTab() {

  const tomorrowDate = getTomorrowDate();

  const {
    control
  } = useForm({
    defaultValues: {
      deliveryDate: tomorrowDate,
      categoryId: ""
    }
  });

  const deliveryDate = useWatch({
    control,
    name: "deliveryDate"
  });

  const categoryId = useWatch({
    control,
    name: "categoryId"
  });

  const [searchFilter, setSearchFilter] = useState(null);

  const handleSearch = () => {

    setSearchFilter({
      deliveryDate,
      categoryId
    });

  };

  const { data: categories = [] } = useProductCategories();

  const {
    data = [],
    isLoading
  } = useFarmSummary(
    searchFilter?.deliveryDate,
    searchFilter?.categoryId
  );

  const hasSearched = searchFilter !== null;

  /* ---------------- Totals ---------------- */

  const totalQuantity = data.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalLitres = data.reduce(
    (sum, item) => sum + (item.litres ?? 0),
    0
  );

  const tableData =
    data.length > 0
      ? [
        ...data,
        {
          productId: 0,
          productCode: "",
          productName: "TOTAL",
          quantity: totalQuantity,
          litres: totalLitres
        }
      ]
      : [];

  const handleCopy = async () => {

    if (!data.length) {

      toast.error("No data available.");

      return;
    }

    let text = "";

    text += "🥛 Farm Summary\n\n";

    text += `Date : ${searchFilter.deliveryDate}\n\n`;

    data.forEach(item => {

      text += `${item.productCode.padEnd(10)} : ${item.quantity}`;

      if (item.litres != null) {

        text += ` (${item.litres} L)`;

      }

      text += "\n";

    });

    text += "\n----------------------------\n";

    text += `Total Quantity : ${totalQuantity}\n`;

    text += `Total Litres  : ${totalLitres}`;

    await navigator.clipboard.writeText(text);

    toast.success("Farm summary copied.");

  };

  const columns = useMemo(() => [

    {
      accessorKey: "productCode",
      header: "Code",

      cell: ({ row }) => (

        <span
          className={
            row.original.productName === "TOTAL"
              ? "font-bold text-blue-700"
              : "font-semibold text-gray-800"
          }
        >
          {row.original.productCode}
        </span>

      )
    },

    {
      accessorKey: "productName",
      header: "Product",

      cell: ({ row }) => (

        <span
          className={
            row.original.productName === "TOTAL"
              ? "font-bold text-blue-700"
              : "text-gray-700"
          }
        >
          {row.original.productName}
        </span>

      )
    }, {
      accessorKey: "quantity",
      header: "Quantity",

      cell: ({ row }) => (

        <span
          className={
            row.original.productName === "TOTAL"
              ? "font-bold text-blue-700"
              : "text-gray-700"
          }
        >
          {row.original.quantity}
        </span>

      )
    },

    {
      accessorKey: "litres",
      header: "Litres",

      cell: ({ row }) => (

        <span
          className={
            row.original.productName === "TOTAL"
              ? "font-bold text-green-700"
              : "text-blue-600 font-medium"
          }
        >
          {row.original.litres ?? "-"}
        </span>

      )
    }

  ], []);

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

          <SelectField
            control={control}
            name="categoryId"
            label="Category"
            options={[
              {
                id: "",
                name: "All Categories"
              },
              ...categories.map(x => ({
                id: x.id,
                name: x.name
              }))
            ]}
          />

          <div className="flex items-end gap-2">

            <Button
              type="button"
              onClick={handleSearch}
            >
              Search
            </Button>

            {
              data.length > 0 && hasSearched && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                >
                  Copy Summary
                </Button>)
            }


          </div>

        </FormGrid>

      </div>

      {/* Data */}

      <DataTable
        data={tableData}
        columns={columns}
        loading={isLoading}
        pageSize={20}       
        emptyMessage="No farm summary available."
      />

    </div>

  );

}