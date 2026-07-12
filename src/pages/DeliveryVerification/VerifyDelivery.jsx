// VerifyDelivery.jsx

import VerifyDeliveryForm from "./VerifyDeliveryForm";

/* ---------------- Component ---------------- */

export default function VerifyDelivery() {
  /* ---------------- Sample Order ---------------- */

  const order = {
    order_no: "ORD1001",
    customer: "Ravi Kumar",
    area: "MED",
    delivery_date: "2026-05-30",

    items: [
      {
        id: 1,
        product: "OLB",
        qty: 1,
      },

      {
        id: 2,
        product: "HLB",
        qty: 2,
      },

      {
        id: 3,
        product: "Paneer",
        qty: 1,
      },

      {
        id: 4,
        product: "Tender Coconut",
        qty: 3,
      },
    ],
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = (data) => {
    console.log("Verification Payload :", data);

    // API CALL HERE
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}

        <div className="border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Delivery Verification
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Verify delivered products and substitutions
          </p>
        </div>

        {/* Form */}

        <div className="p-8">
          <VerifyDeliveryForm order={order} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
