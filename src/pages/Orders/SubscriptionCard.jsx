import Button from "../../components/ui/button/Button";

export default function SubscriptionCard({
  subscription,
  onPause,
  onReplace,
  deliveryDate,
  readOnly = false,
}) {
  
  const selectedDateLabel = new Date(deliveryDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  );

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* Product + Pattern (INLINE) */}
          <div className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <span>{subscription.productCode}</span>
            <span className="text-gray-400 text-sm font-normal">
              • {subscription.scheduleDescription}
            </span>
          </div>

          {/* Quantity with Date */}
          {


            (subscription.selectedDateQuantity === 0 ? (
              <div className="text-sm mt-2 text-red-500 font-medium">
                {selectedDateLabel} : No Delivery
              </div>
            ) : (
              <div className="text-sm font-bold text-green-600 mt-2">
                {selectedDateLabel} : {subscription.selectedDateQuantity}
              </div>
            )
            )

          }

        </div>

        {/* RIGHT ACTIONS */}
        {!readOnly && !subscription.hasPendingRequest && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onReplace(subscription)}>
              Replace
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onPause(subscription)}
            >
              Pause
            </Button>
          </div>
        )}

        {/* Pending Badge */}
        {subscription.hasPendingRequest && (
          <div className="">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${subscription.pendingRequestAction === "PAUSE"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
                }`}
            >
              {subscription.pendingRequestAction === "PAUSE"
                ? "Pause Scheduled"
                : "Replacement Scheduled"}
            </span>
          </div>
        )}
      </div>


    </div>
  );
}