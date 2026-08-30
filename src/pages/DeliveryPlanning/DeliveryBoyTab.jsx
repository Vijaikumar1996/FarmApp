import { useMemo, useState } from "react";
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

  // ============================================
  // Default delivery date = tomorrow
  // ============================================

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultDate = tomorrow.toISOString().split("T")[0];

  // ============================================
  // Form
  // ============================================

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

  // ============================================
  // Search filters
  // ============================================

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

  // ============================================
  // Delivery data
  // ============================================

  const {
    data = [],
    isLoading
  } = useDeliveryBoySheet(
    filters.deliveryDate,
    filters.areaId
  );

  // ============================================
  // Areas
  // ============================================

  const {
    data: areas = []
  } = useAreas();

  // ============================================
  // Export
  // ============================================

  const exportMutation = useExportDeliveryBoySheet();

  const handleExport = async () => {

    if (!data.length) {

      toast.error("No records available.");

      return;
    }

    try {

      const response =
        await exportMutation.mutateAsync({
          deliveryDate: filters.deliveryDate,
          areaId: filters.areaId
        });

      const blob = new Blob(
        [response.data],
        {
          type: response.headers["content-type"]
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const disposition =
        response.headers["content-disposition"];

      let fileName =
        "DeliveryBoySheet.xlsx";

      if (disposition) {

        const match =
          disposition.match(
            /filename="?(.+?)"?$/
          );

        if (match) {
          fileName = match[1];
        }

      }

      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Excel downloaded successfully."
      );

    }
    catch {

      toast.error(
        "Failed to download Excel."
      );

    }

  };

  // ============================================
  // Flatten API response for DataTable
  //
  // API:
  //
  // DeliveryOrder
  //   -> Houses
  //       -> Customers
  //
  // DataTable:
  //
  // One row = one customer
  // ============================================

  const tableData = useMemo(() => {

    if (!data?.length) {
      return [];
    }

    return data.flatMap(deliveryOrder =>

      (deliveryOrder.houses ?? []).flatMap(house =>

        (house.customers ?? []).map(customer => ({

          ...customer,

          deliveryOrder:
            deliveryOrder.deliveryOrder,

          deliveryLocation:
            deliveryOrder.deliveryLocation,

          houseDoorNo:
            house.houseDoorNo

        }))

      )

    );

  }, [data]);

  // ============================================
  // Columns
  // ============================================

  const columns = [

    // ==========================================
    // Delivery Order
    // ==========================================

    {
      accessorKey: "deliveryOrder",
      header: "Order",

      cell: ({ row }) => (

        <span className="font-bold text-blue-700 whitespace-nowrap">

          {row.original.deliveryOrder}

        </span>

      )
    },

    // ==========================================
    // House No
    // ==========================================

    // {
    //   accessorKey: "houseDoorNo",
    //   header: "House No",

    //   cell: ({ row }) => (

    //     <span className="font-semibold text-gray-800 whitespace-nowrap">

    //       {row.original.houseDoorNo || "-"}

    //     </span>

    //   )
    // },

    // ==========================================
    // Area
    // ==========================================

    {
      accessorKey: "areaCode",
      header: "Area",

      cell: ({ row }) => (

        <span className="font-semibold text-blue-700 whitespace-nowrap">

          {row.original.areaCode}

        </span>

      )
    },

    // ==========================================
    // Customer
    // ==========================================

    {
      accessorKey: "customerName",
      header: "Customer",

      cell: ({ row }) => (

        <span className="font-medium text-gray-800 whitespace-nowrap">

          {row.original.customerName}

        </span>

      )
    },

    // ==========================================
    // Address
    // ==========================================

    {
      accessorKey: "address",
      header: "Address",

      cell: ({ row }) => (

        <div className="max-w-md whitespace-normal">

          {row.original.address}

        </div>

      )
    },

    // ==========================================
    // Milk
    // ==========================================

    {
      accessorKey: "milkProducts",
      header: "Milk",

      cell: ({ row }) => {

        const products =
          row.original.milkProducts ?? [];

        if (!products.length) {
          return "-";
        }

        return (

          <div className="space-y-1">

            {products.map(product => (

              <div
                key={product.productId}
                className="whitespace-nowrap"
              >

                {product.quantity}{" "}
                {product.productCode}

              </div>

            ))}

          </div>

        );

      }
    },

    // ==========================================
    // Other Products
    // ==========================================

    {
      accessorKey: "otherProducts",
      header: "Other",

      cell: ({ row }) => {

        const products =
          row.original.otherProducts ?? [];

        if (!products.length) {
          return "-";
        }

        return (

          <div className="space-y-1">

            {products.map(product => (

              <div
                key={product.productId}
                className="font-medium text-green-700 whitespace-nowrap"
              >

                {product.quantity}{" "}
                {product.productCode}

              </div>

            ))}

          </div>

        );

      }
    }

  ];

  // ============================================
  // UI
  // ============================================

  return (

    <div className="space-y-5">

      {/* ========================================
          Filters
      ======================================== */}

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

            {/* Search */}

            <Button
              type="button"
              onClick={handleSearch}
            >
              Search
            </Button>

            {/* Export */}

            <Button
              type="button"
              onClick={handleExport}
              disabled={
                !data.length ||
                exportMutation.isPending
              }
            >
              {exportMutation.isPending
                ? "Exporting..."
                : "Export Excel"}
            </Button>

          </div>

        </FormGrid>

      </div>

      {/* ========================================
          Delivery Table
      ======================================== */}

      <DataTable
        data={tableData}
        columns={columns}
        loading={isLoading}
        pageSize={20}
        emptyMessage="No delivery records found."
      />

    </div>

  );

}