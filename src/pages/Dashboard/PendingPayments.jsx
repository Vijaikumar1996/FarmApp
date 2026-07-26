import { Wallet } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../components/common/DataTable";
import { getPreviousMonth } from "../../utils/commonUtils";

export default function PendingPayments({ data = [] }) {
  const navigate = useNavigate();

  const previousMonth = getPreviousMonth();

  const columns = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <span className="font-semibold text-gray-800">
            {row.original.customerName}
          </span>
        ),
      },
      {
        accessorKey: "billingMonth",
        header: "Pending Month",
        cell: ({ row }) => (
          <span>
            {row.original.billingMonth
              ? new Date(row.original.billingMonth).toLocaleDateString(
                "en-IN",
                {
                  month: "long",
                  year: "numeric",
                }
              )
              : "-"}
          </span>
        ),
      },
      {
        accessorKey: "pendingAmount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-medium text-orange-600">
            ₹{Number(row.original.pendingAmount).toLocaleString("en-IN")}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-xl">
            <Wallet className="h-5 w-5 text-orange-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Pending Payments
          </h2>
        </div>

        <button
          onClick={() =>
            navigate("/billing", {
              state: {
                BillingMonth: previousMonth,
                paymentStatus: "PENDING",
              },
            })
          }
          className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
        >
          View All
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pageSize={5}
        globalSearch={false}
        emptyMessage="No pending payments found."
      />
    </div>
  );
}