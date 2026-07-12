import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import FormGrid from "../../components/form/FormGrid";
import DataTable from "../../components/common/DataTable";

import Button from "../../components/ui/button/Button";
import DateField from "../../components/form/form-input/DateField";
import SelectField from "../../components/form/form-input/SelectField";

import { useAreas } from "../../queries/useArea";
import {
  useDeliveryBoySheet,
  useExportDeliveryBoySheet
} from "../../queries/useDeliveryPlanning";

export default function DeliveryBoyTab() {

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultDate = tomorrow.toISOString().split("T")[0];

  const { control } = useForm({
    defaultValues: {
      deliveryDate: defaultDate,
      areaId: ""
    }
  });

  const deliveryDate = useWatch({
    control,
    name: "deliveryDate"
  });

  const areaId = useWatch({
    control,
    name: "areaId"
  });

  const [filters, setFilters] = useState({
    deliveryDate: null,
    areaId: null
  });

  const handleSearch = () => {

    setFilters({
      deliveryDate,
      areaId: areaId || null
    });

  };

  const {
    data = [],
    isLoading
  } = useDeliveryBoySheet(
    filters.deliveryDate,
    filters.areaId
  );

  const {
    data: areas = []
  } = useAreas();

  const exportMutation = useExportDeliveryBoySheet();

  const handleExport = async () => {

    if (!data.length) {

      toast.error("No records available.");

      return;
    }

    try {

      const response = await exportMutation.mutateAsync({

        deliveryDate: filters.deliveryDate,

        areaId: filters.areaId

      });

      const blob = new Blob(
        [response.data],
        {
          type: response.headers["content-type"]
        });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const disposition =
        response.headers["content-disposition"];

      let fileName = "DeliveryBoySheet.xlsx";

      if (disposition) {

        const match = disposition.match(/filename="?(.+?)"?$/);

        if (match)
          fileName = match[1];

      }

      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Excel downloaded successfully.");

    }
    catch {

      toast.error("Failed to download Excel.");

    }

  };
  const columns = [
    {
      accessorKey: "areaCode",
      header: "Area",

      cell: ({ row }) => (
        <span className="font-semibold text-blue-700 whitespace-nowrap">
          {row.original.areaCode}
        </span>
      )
    },
    {
      accessorKey: "customerName",
      header: "Customer",

      cell: ({ row }) => (
        <span className="font-medium text-gray-800 whitespace-nowrap">
          {row.original.customerName}
        </span>
      )
    },

    {
      accessorKey: "address",
      header: "Address",

      cell: ({ row }) => (
        <div className="max-w-md whitespace-normal">
          {row.original.address}
        </div>
      )
    },

    {
      accessorKey: "milkProducts",
      header: "Milk",

      cell: ({ row }) => {

        if (!row.original.milkProducts.length)
          return "-";

        return (

          <div className="space-y-1">

            {row.original.milkProducts.map(product => (

              <div key={product.productId}>

                {product.quantity} {product.productCode}

              </div>

            ))}

          </div>

        );

      }
    },

    {
      accessorKey: "otherProducts",
      header: "Other",

      cell: ({ row }) => {

        if (!row.original.otherProducts.length)
          return "-";

        return (

          <div className="space-y-1">

            {row.original.otherProducts.map(product => (

              <div
                key={product.productId}
                className="font-medium text-green-700"
              >

                {product.quantity} {product.productCode}

              </div>

            ))}

          </div>

        );

      }
    }
  ];

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
            name="areaId"
            label="Area"
            options={[
              {
                id: "",
                name: "All Areas"
              },
              ...areas.map(area => ({
                id: area.id,
                name: area.areaName
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

            <Button
              type="button"
              onClick={handleExport}
              disabled={!data.length || exportMutation.isPending}
            >
              Export Excel
            </Button>

          </div>

        </FormGrid>

      </div>

      <DataTable

        data={data}

        columns={columns}

        loading={isLoading}

        pageSize={20}

        globalSearch={false}

        emptyMessage="No delivery records found."

        // pinnedColumns={{
        //   left: ["customerName"]
        // }}

      />

    </div>

  );

}