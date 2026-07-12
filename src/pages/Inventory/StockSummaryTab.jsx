// tabs/StockSummaryTab.jsx

import { useMemo } from "react";

import DataTable from "../../components/common/DataTable";

export default function StockSummaryTab() {
  const stockData = [
    {
      id: 1,
      product: "Paneer",
      openingStock: 50,
      ordered: 15,
      available: 35,
    },

    {
      id: 2,
      product: "TCO",
      openingStock: 40,
      ordered: 35,
      available: 5,
    },

    {
      id: 3,
      product: "Egg Box",
      openingStock: 100,
      ordered: 25,
      available: 75,
    },

    {
      id: 4,
      product: "Curd",
      openingStock: 20,
      ordered: 20,
      available: 0,
    },
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
      },

      {
        accessorKey: "openingStock",
        header: "Opening Stock",
      },

      {
        accessorKey: "ordered",
        header: "Ordered",
      },

      {
        accessorKey: "available",
        header: "Available",
      },

      {
        id: "status",
        header: "Status",

        cell: ({ row }) => {
          const available = row.original.available;

          if (available === 0) {
            return (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                Out Of Stock
              </span>
            );
          }

          if (available <= 10) {
            return (
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                Low Stock
              </span>
            );
          }

          return (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
              Available
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <DataTable
        data={stockData}
        columns={columns}
        pageSize={10}
        globalSearch={false}
        emptyMessage="No inventory records found"
      />
    </div>
  );
}
