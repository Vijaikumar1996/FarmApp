import { useMemo } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../components/common/DataTable";

export default function RecentOrders({ data = [] }) {
  const navigate = useNavigate();
  console.log("Recent Orders", data);

  const pinnedColumns = useMemo(
    () => ({
      left: ["customerName"],
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: (info) => (
          <span className="font-semibold text-gray-800 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "request",
        header: "Request",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "deliveryDate",
        header: "Effective From",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {new Date(info.getValue()).toLocaleDateString("en-IN")}
          </span>
        ),
      },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   cell: () => (
      //     <button
      //       className="text-blue-600 hover:underline whitespace-nowrap"
      //     >
      //       View
      //     </button>
      //   ),
      // },
    ],
    []
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 h-full">
      {/* Header */}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Requests
        </h2>

        <button
          onClick={() => navigate("/customer-requests")}
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
      </div>

      <DataTable
        data={data}
        columns={columns}
        pageSize={5}
        pinnedColumns={pinnedColumns}
        emptyMessage="No recent requests found"
        globalSearch={false}
        showTotalRecords={false}
      />
    </div>
  );
}