import { useMemo } from "react";
import { useNavigate } from "react-router";
import DataTable from "../common/DataTable";

export default function RecentOrders() {
  const navigate = useNavigate();

  // Sample Order Data

  const orders = [
    {
      customer: "Ravi Kumar",
      items: "3 Items",
      deliveryDate: "26 May 2026",
    },

    {
      customer: "Suresh",
      items: "2 Items",
      deliveryDate: "26 May 2026",
    },

    {
      customer: "Priya",
      items: "4 Items",
      deliveryDate: "26 May 2026",
    },

    {
      customer: "Mani",
      items: "1 Item",
      deliveryDate: "26 May 2026",
    },

    {
      customer: "Karthik",
      items: "5 Items",
      deliveryDate: "26 May 2026",
    },
  ];

  const pinnedColumns = useMemo(
    () => ({
      left: ["customer"],
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
        cell: (info) => (
          <span className="font-semibold text-gray-800 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "items",
        header: "Items",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "deliveryDate",
        header: "Delivery Date",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <button
            className="
              text-blue-600
              hover:underline
              whitespace-nowrap
            "
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 h-full">
      {/* Header */}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="
              px-4
              py-2
              text-sm
              font-medium
              border
              border-gray-300
              text-gray-700
              rounded-xl
              hover:bg-gray-50
            "
          >
            View All
          </button>

          <button
            onClick={() => navigate("/orders/create")}
            className="
              px-4
              py-2
              text-sm
              font-medium
              bg-blue-600
              text-white
              rounded-xl
              hover:bg-blue-700
            "
          >
            + New Order
          </button>
        </div>
      </div>

      {/* Table */}

      <DataTable
        data={orders}
        columns={columns}
        pageSize={5}
        pinnedColumns={pinnedColumns}
        emptyMessage="No recent orders found"
        globalSearch={false}
      />
    </div>
  );
}
