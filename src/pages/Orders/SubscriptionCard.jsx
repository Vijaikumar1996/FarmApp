import Button from "../../components/ui/button/Button";

export default function SubscriptionCard({
  subscription,
  onPause,
  onReplace,
  readOnly = false,
}) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-lg font-semibold">
            {subscription.productCode}
          </div>

          <div className="text-sm mt-1">
            {subscription.scheduleDescription}           
          </div>

        </div>

        {!readOnly && !subscription.hasPendingRequest && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onReplace(subscription)}
            >
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

        {subscription.hasPendingRequest && (
          <div className="mt-3">
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