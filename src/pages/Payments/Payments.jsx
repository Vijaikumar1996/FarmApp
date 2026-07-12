// Payments.jsx

import { useMemo } from "react";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import FormGrid from "../../components/form/FormGrid";

export default function Payments() {
  const navigate = useNavigate();

  /* ---------------- Sample Data ---------------- */

  const payments = [
    {
      billingId: 125,
      customer: "Manju",
      area: "MED",
      billingMonth: "June 2026",

      milkLitres: 30,
      milkAmount: 2400,

      otherProductsAmount: 350,

      totalBill: 2750,

      paid: 1000,
      balance: 1750,

      status: "PARTIAL",
    },

    {
      billingId: 126,
      customer: "Manju",
      area: "MED",
      billingMonth: "May 2026",

      milkLitres: 28,
      milkAmount: 2240,

      otherProductsAmount: 260,

      totalBill: 2500,

      paid: 2500,
      balance: 0,

      status: "PAID",
    },

    {
      billingId: 127,
      customer: "Ravi",
      area: "OMR",
      billingMonth: "June 2026",

      milkLitres: 25,
      milkAmount: 2000,

      otherProductsAmount: 0,

      totalBill: 2000,

      paid: 2000,
      balance: 0,

      status: "PAID",
    },

    {
      billingId: 128,
      customer: "Kumar",
      area: "VEL",
      billingMonth: "June 2026",

      milkLitres: 0,
      milkAmount: 0,

      otherProductsAmount: 850,

      totalBill: 850,

      paid: 0,
      balance: 850,

      status: "PENDING",
    },
  ];

  /* ---------------- Summary ---------------- */

  const totalBill = payments.reduce((sum, item) => sum + item.totalBill, 0);

  const totalPaid = payments.reduce((sum, item) => sum + item.paid, 0);

  const totalBalance = payments.reduce((sum, item) => sum + item.balance, 0);

  /* ---------------- Pinned Columns ---------------- */

  const pinnedColumns = useMemo(
    () => ({
      left: ["customer"],
    }),
    [],
  );

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",

        cell: (info) => (
          <span className="font-semibold text-gray-800">{info.getValue()}</span>
        ),
      },

      {
        accessorKey: "area",
        header: "Area",
      },

      {
        accessorKey: "billingMonth",
        header: "Bill Month",
      },

      {
        accessorKey: "milkLitres",
        header: "Milk Litres",

        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/payments/bill/${row.original.billingId}`)}
            className="
                            text-blue-600
                            hover:underline
                            font-medium
                        "
          >
            {row.original.milkLitres} L
          </button>
        ),
      },

      {
        accessorKey: "milkAmount",
        header: "Milk Amount",

        cell: (info) => <span>₹{info.getValue()}</span>,
      },

      {
        accessorKey: "otherProductsAmount",
        header: "Other Products",

        cell: (info) => <span>₹{info.getValue()}</span>,
      },

      {
        accessorKey: "totalBill",
        header: "Total Bill",

        cell: (info) => (
          <span className="font-semibold">₹{info.getValue()}</span>
        ),
      },

      {
        accessorKey: "paid",
        header: "Paid",

        cell: (info) => (
          <span className="font-medium text-green-600">₹{info.getValue()}</span>
        ),
      },

      {
        accessorKey: "balance",
        header: "Balance",

        cell: (info) => (
          <span className="font-medium text-red-600">₹{info.getValue()}</span>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",

        cell: ({ row }) => {
          const status = row.original.status;

          const styles = {
            PAID: "bg-green-100 text-green-700",

            PARTIAL: "bg-yellow-100 text-yellow-700",

            PENDING: "bg-red-100 text-red-700",
          };

          return (
            <span
              className={`
                                px-3 py-1
                                rounded-full
                                text-xs
                                font-medium
                                ${styles[status]}
                            `}
            >
              {status}
            </span>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",

        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/payments/bill/${row.original.billingId}`)}
            className="
                            text-blue-600
                            hover:underline
                            font-medium
                        "
          >
            View Ledger
          </button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>

        <p className="text-sm text-gray-500 mt-1">
          Monthly billing and collections
        </p>
      </div>

      {/* Filters */}

      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <FormGrid cols={5} gap={4}>
          <div>
            <label className="block text-sm font-medium mb-2">
              Billing Month
            </label>

            <select
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            >
              <option>June 2026</option>
              <option>May 2026</option>
              <option>April 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Customer</label>

            <select
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            >
              <option>All Customers</option>
              <option>Manju</option>
              <option>Ravi</option>
              <option>Kumar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Area</label>

            <select
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            >
              <option>All Areas</option>
              <option>MED</option>
              <option>OMR</option>
              <option>VEL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>

            <select
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            >
              <option>All Status</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="
                                w-full
                                bg-blue-600
                                text-white
                                rounded-xl
                                px-4
                                py-2.5
                                hover:bg-blue-700
                            "
            >
              Search
            </button>
          </div>
        </FormGrid>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Bills</p>

          <h2 className="text-3xl font-bold mt-2">{payments.length}</h2>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Total Bill</p>

          <h2 className="text-3xl font-bold mt-2">₹{totalBill}</h2>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Collected</p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            ₹{totalPaid}
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Outstanding</p>

          <h2 className="text-3xl font-bold mt-2 text-red-600">
            ₹{totalBalance}
          </h2>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <DataTable
          data={payments}
          columns={columns}
          pageSize={10}
          pinnedColumns={pinnedColumns}
          emptyMessage="No billing records found"
          globalSearch={false}
        />
      </div>
    </div>
  );
}
