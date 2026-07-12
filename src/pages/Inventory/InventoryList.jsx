import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import Loader from "../../../components/common/Loader";

import { useInventory, useCreateDailyStock } from "../hooks/useInventory";

export default function InventoryListPage() {
  const today = new Date().toISOString().split("T")[0];

  const [stockDate, setStockDate] = useState(today);

  const { data = [], isLoading } = useInventory({
    stockDate,
  });

  const createStockMutation = useCreateDailyStock();

  const handleCreateStock = () => {
    createStockMutation.mutate({
      stockDate,
    });
  };

  const columns = [
    {
      header: "Product Code",
      accessorKey: "productCode",
    },

    {
      header: "Product",
      accessorKey: "productName",
    },

    {
      header: "Opening",
      accessorKey: "openingStock",
    },

    {
      header: "Available",
      accessorKey: "availableStock",
    },

    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => {
            console.log(row.original);
          }}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Inventory" subtitle="Manage Daily Inventory" />

      <div
        className="
                    bg-white
                    rounded-xl
                    shadow
                    p-5
                    mb-5
                    flex
                    justify-between
                    items-center
                "
      >
        <div>
          <label className="block mb-2">Stock Date</label>

          <Flatpickr
            value={stockDate}
            options={{
              dateFormat: "Y-m-d",
            }}
            onChange={([date]) => {
              setStockDate(date.toISOString().split("T")[0]);
            }}
            className="
                            border
                            rounded-lg
                            px-3
                            py-2
                        "
          />
        </div>

        <Button
          onClick={handleCreateStock}
          loading={createStockMutation.isPending}
        >
          Create Today's Inventory
        </Button>
      </div>

      {isLoading ? <Loader /> : <Table columns={columns} data={data} />}
    </>
  );
}
