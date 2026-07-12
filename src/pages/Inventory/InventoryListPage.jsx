import { useInventoryTransactions } from "../hooks/useInventory";

import Loader from "../../../components/common/Loader";

export default function InventoryTransactionTable({
  productId,

  stockDate,
}) {
  const {
    data = [],

    isLoading,
  } = useInventoryTransactions(
    productId,

    stockDate,
  );

  if (isLoading) return <Loader />;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Transactions</h3>

        <span className="text-sm text-gray-500">
          {data.length} Transaction(s)
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead
            className="
                            bg-gray-100
                        "
          >
            <tr>
              <th className="p-3 text-left">Time</th>

              <th className="p-3 text-left">Type</th>

              <th className="p-3 text-right">Qty</th>

              <th className="p-3 text-left">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="
                                        p-6
                                        text-center
                                        text-gray-400
                                    "
                >
                  No Transactions Found
                </td>
              </tr>
            )}

            {data.map((item) => (
              <tr
                key={item.id}
                className="
                                        border-t
                                    "
              >
                <td className="p-3">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="p-3">
                  {getTransactionBadge(item.transactionType)}
                </td>

                <td
                  className={`
                                            p-3
                                            text-right
                                            font-semibold
                                            ${getQuantityColor(item.transactionType)}
                                        `}
                >
                  {getQuantityPrefix(item.transactionType)}

                  {item.quantity}
                </td>

                <td className="p-3">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getQuantityPrefix(type) {
  switch (type) {
    case "Production":

    case "Purchase":
      return "+";

    case "Delivery":

    case "Waste":
      return "-";

    case "Adjustment":
      return "";

    default:
      return "";
  }
}

function getQuantityColor(type) {
  switch (type) {
    case "Production":

    case "Purchase":
      return "text-green-600";

    case "Delivery":

    case "Waste":
      return "text-red-600";

    case "Adjustment":
      return "text-blue-600";

    default:
      return "";
  }
}

function getTransactionBadge(type) {
  const badges = {
    Production: "🥛 Production",

    Purchase: "🛒 Purchase",

    Delivery: "🚚 Delivery",

    Waste: "🗑 Waste",

    Adjustment: "⚖ Adjustment",
  };

  return badges[type] || type;
}
