// CustomerLedger.jsx

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import DataTable from "../../components/common/DataTable";

export default function CustomerLedger() {
  const navigate = useNavigate();
  const { billingId } = useParams();

  /* ---------------- Sample Bill ---------------- */

  const bill = {
    billingId,

    customer: "Manju",
    area: "MED",
    billingMonth: "June 2026",

    milkLitres: 30,

    milkAmount: 2400,
    otherProductsAmount: 350,

    totalBill: 2750,

    received: 1000,
    balance: 1750,
  };

  /* ---------------- Delivery History ---------------- */

  const deliveryHistory = [
    {
      id: 1,
      date: "01-Jun-2026",
      product: "OLB",
      qty: 1,
      rate: 80,
      amount: 80,
    },

    {
      id: 2,
      date: "02-Jun-2026",
      product: "OLB",
      qty: 1,
      rate: 80,
      amount: 80,
    },

    {
      id: 3,
      date: "05-Jun-2026",
      product: "Paneer",
      qty: 1,
      rate: 120,
      amount: 120,
    },

    {
      id: 4,
      date: "10-Jun-2026",
      product: "TCO",
      qty: 2,
      rate: 50,
      amount: 100,
    },

    {
      id: 5,
      date: "15-Jun-2026",
      product: "HLB",
      qty: 2,
      rate: 40,
      amount: 80,
    },
  ];

  /* ---------------- Payment History ---------------- */

  const paymentHistory = [
    {
      id: 1,
      date: "12-Jun-2026",
      amount: 500,
      mode: "UPI",
      referenceNo: "UPI123456",
    },

    {
      id: 2,
      date: "22-Jun-2026",
      amount: 500,
      mode: "Cash",
      referenceNo: "-",
    },
  ];

  /* ---------------- Delivery Columns ---------------- */

  const deliveryColumns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
      },

      {
        accessorKey: "product",
        header: "Product",
      },

      {
        accessorKey: "qty",
        header: "Qty",
      },

      {
        accessorKey: "rate",
        header: "Rate",

        cell: (info) => <span>₹{info.getValue()}</span>,
      },

      {
        accessorKey: "amount",
        header: "Amount",

        cell: (info) => <span className="font-medium">₹{info.getValue()}</span>,
      },
    ],
    [],
  );

  /* ---------------- Payment Columns ---------------- */

  const paymentColumns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
      },

      {
        accessorKey: "amount",
        header: "Amount",

        cell: (info) => (
          <span className="font-medium text-green-600">₹{info.getValue()}</span>
        ),
      },

      {
        accessorKey: "mode",
        header: "Mode",
      },

      {
        accessorKey: "referenceNo",
        header: "Reference No",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Customer Ledger
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Bill Details & Payment History
          </p>
        </div>

        <button
          onClick={() => navigate("/payments")}
          className="
                        px-4 py-2
                        border border-gray-300
                        rounded-xl
                        hover:bg-gray-50
                    "
        >
          Back
        </button>
      </div>

      {/* Bill Information */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Customer</p>

            <p className="font-semibold mt-1">{bill.customer}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Area</p>

            <p className="font-semibold mt-1">{bill.area}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Billing Month</p>

            <p className="font-semibold mt-1">{bill.billingMonth}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Billing Id</p>

            <p className="font-semibold mt-1">#{bill.billingId}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Milk Litres</p>

          <h3 className="text-2xl font-bold mt-2 text-blue-600">
            {bill.milkLitres} L
          </h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Milk Amount</p>

          <h3 className="text-2xl font-bold mt-2">₹{bill.milkAmount}</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Other Products</p>

          <h3 className="text-2xl font-bold mt-2">
            ₹{bill.otherProductsAmount}
          </h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Total Bill</p>

          <h3 className="text-2xl font-bold mt-2">₹{bill.totalBill}</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Received</p>

          <h3 className="text-2xl font-bold mt-2 text-green-600">
            ₹{bill.received}
          </h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Balance</p>

          <h3 className="text-2xl font-bold mt-2 text-red-600">
            ₹{bill.balance}
          </h3>
        </div>
      </div>

      {/* Actions */}

      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/payments/bill/${bill.billingId}/collect`)}
          className="
                        px-5 py-2.5
                        bg-blue-600
                        text-white
                        rounded-xl
                        hover:bg-blue-700
                    "
        >
          Collect Payment
        </button>
      </div>

      {/* Delivery History */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Delivery History</h2>

        <DataTable
          data={deliveryHistory}
          columns={deliveryColumns}
          pageSize={10}
          emptyMessage="No delivery history found"
          globalSearch={false}
        />
      </div>

      {/* Payment History */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>

        <DataTable
          data={paymentHistory}
          columns={paymentColumns}
          pageSize={10}
          emptyMessage="No payment history found"
          globalSearch={false}
        />
      </div>
    </div>
  );
}
