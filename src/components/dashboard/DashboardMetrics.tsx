import { Truck, AlertTriangle, Wallet, CircleCheckBig } from "lucide-react";

export default function DashboardMetrics() {
  /* ---------------- Dashboard Data ---------------- */

  const data = {
    tomorrowDeliveries: 126,
    lowStockProducts: 4,
    pendingPayments: 18,
    pendingDeliveryVerifications: 12,
  };

  /* ---------------- Summary Cards ---------------- */

  const summaryCards = [
    {
      title: "Tomorrow Deliveries",
      value: data.tomorrowDeliveries,
      icon: Truck,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      title: "Pending Verifications",
      value: data.pendingDeliveryVerifications,
      icon: CircleCheckBig,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },
    {
      title: "Low Stock Products",
      value: data.lowStockProducts,
      icon: AlertTriangle,
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-700",
    },

    {
      title: "Pending Payments",
      value: data.pendingPayments,
      icon: Wallet,
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`
                ${card.bg}
                ${card.border}
                border
                rounded-2xl
                p-5
                transition-all
                hover:shadow-md
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h3
                    className={`
                      mt-2
                      text-3xl
                      font-bold
                      ${card.valueColor}
                    `}
                  >
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    ${card.iconBg}
                    rounded-2xl
                    p-3
                  `}
                >
                  <Icon
                    className={`
                      w-7
                      h-7
                      ${card.iconColor}
                    `}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
