// CollectPayment.jsx

import { useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function CollectPayment() {
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

  /* ---------------- State ---------------- */

  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [referenceNo, setReferenceNo] = useState("");
  const [remarks, setRemarks] = useState("");

  /* ---------------- Submit ---------------- */

  const handleSubmit = async () => {
    const payload = {
      billingId: bill.billingId,
      amount: Number(amount),
      paymentMode,
      referenceNo,
      remarks,
    };

    console.log("Collect Payment Payload :", payload);

    // API CALL HERE

    navigate(`/payments/bill/${bill.billingId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Collect Payment
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Record customer payment against bill
          </p>
        </div>

        <button
          onClick={() => navigate(`/payments/bill/${bill.billingId}`)}
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

      {/* Bill Info */}

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
            <p className="text-sm text-gray-500">Bill No</p>

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

      {/* Payment Form */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Payment Details</h2>

          <button
            type="button"
            onClick={() => setAmount(bill.balance)}
            className="
                            px-4 py-2
                            bg-green-600
                            text-white
                            rounded-xl
                            hover:bg-green-700
                        "
          >
            Pay Full Balance
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Amount */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount Received *
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            />
          </div>

          {/* Mode */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Mode *
            </label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            >
              <option value="UPI">UPI</option>

              <option value="Cash">Cash</option>

              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Reference */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Reference No
            </label>

            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="Transaction Reference"
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            />
          </div>

          {/* Remaining Balance Preview */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Remaining Balance
            </label>

            <input
              type="text"
              readOnly
              value={`₹ ${bill.balance - (Number(amount) || 0)}`}
              className="
                                w-full
                                bg-gray-50
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            />
          </div>

          {/* Remarks */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Remarks</label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
              className="
                                w-full
                                border border-gray-300
                                rounded-xl
                                px-4 py-2.5
                            "
            />
          </div>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(`/payments/bill/${bill.billingId}`)}
            className="
                            px-5 py-2.5
                            border border-gray-300
                            rounded-xl
                            hover:bg-gray-50
                        "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
                            px-5 py-2.5
                            bg-blue-600
                            text-white
                            rounded-xl
                            hover:bg-blue-700
                        "
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
}
