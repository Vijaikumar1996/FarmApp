import { Pencil } from "lucide-react";
import Button from "../../components/ui/button/Button";

export default function ActiveRequestCard({
  request,
  onEdit,
  readOnly = false,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">
            {request.requestDescription}
          </h4>

          <div className="mt-2 flex items-center gap-6 text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-700">From:</span>
              <span className="ml-1">{request.effectiveFrom}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700">To:</span>
              <span className="ml-1">{request.effectiveTo ?? "-"}</span>
            </div>
          </div>
        </div>

        {!readOnly ? (
          <Button
            size="sm"
            variant="outline"
            startIcon={<Pencil size={16} />}
            onClick={() => onEdit(request)}
          >
            Edit
          </Button>
        ) : ((
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${request.status === "INPROGRESS"
                ? "bg-yellow-100 text-yellow-700"
                : request.status === "PROCESSED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
            >
              {request.status}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}