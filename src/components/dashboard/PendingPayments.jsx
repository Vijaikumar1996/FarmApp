import { Wallet } from "lucide-react";

export default function PendingPayments() {
  const pendingPayments = [
    {
      customer: "Ravi Kumar",
      month: "April 2026",
      amount: "₹1,250",
    },

    {
      customer: "Priya",
      month: "April 2026",
      amount: "₹980",
    },

    {
      customer: "Suresh",
      month: "April 2026",
      amount: "₹1,540",
    },

    {
      customer: "Deepak",
      month: "April 2026",
      amount: "₹860",
    },

    {
      customer: "Arjun",
      month: "April 2026",
      amount: "₹1,120",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 h-full">
      {/* Header */}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-xl">
            <Wallet className="h-5 w-5 text-orange-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Payments
            </h2>
          </div>
        </div>

        <button
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

      {/* Table Header */}

      <div
        className="
          grid
          grid-cols-3
          gap-4
          px-1
          pb-3
          border-b
          border-gray-100
        "
      >
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Customer
        </p>

        <p className="text-xs font-semibold text-gray-500 uppercase">
          Pending Month
        </p>

        <p className="text-xs font-semibold text-gray-500 uppercase text-right">
          Amount
        </p>
      </div>

      {/* Table Rows */}

      <div className="divide-y divide-gray-100">
        {pendingPayments.map((item, index) => (
          <div
            key={index}
            className="
              grid
              grid-cols-3
              gap-4
              py-4
              items-center
            "
          >
            <p className="text-sm font-semibold text-gray-800">
              {item.customer}
            </p>

            <p className="text-sm text-gray-500">{item.month}</p>

            <p className="text-sm font-medium text-right text-orange-600">
              {item.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
