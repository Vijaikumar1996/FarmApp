import {
    ClipboardList,
    IndianRupee,
    CreditCard,
    Wallet,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function DashboardMetrics({ data }) {
    const navigate = useNavigate();

    const today = new Date();

    const billingMonth = `${today.getFullYear()}-${String(
        today.getMonth()
    ).padStart(2, "0")}-01`;
    const summaryCards = [
        
        {
            title: "Today's Requests",
            value: data?.todayRequests ?? 0,
            icon: ClipboardList,
            bg: "bg-blue-50",
            border: "border-blue-200",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            valueColor: "text-blue-700",
        },
        {
            title: "Today's Collection",
            value: `₹${(data?.todayCollection ?? 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            bg: "bg-green-50",
            border: "border-green-200",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            valueColor: "text-green-700",
        },
        {
            title: "Subscription Pending",
            value: data?.subscriptionPendingCustomers ?? 0,
            icon: CreditCard,
            bg: "bg-orange-50",
            border: "border-orange-200",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            valueColor: "text-orange-700",
            onClick: () =>
                navigate("/billing", {
                    state: {
                        BillingMonth: billingMonth,
                        customerType: "SUBSCRIPTION",
                        paymentStatus: "PENDING",
                    },
                }),
        },
        {
            title: "Non-Subscription Pending",
            value: data?.nonSubscriptionPendingCustomers ?? 0,
            icon: Wallet,
            bg: "bg-red-50",
            border: "border-red-200",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            valueColor: "text-red-700",
            onClick: () =>
                navigate("/billing", {
                    state: {
                        customerType: "NON_SUBSCRIPTION",
                        paymentStatus: "PENDING",
                    },
                }),
        },
    ];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={index}
                            onClick={card.onClick}
                            className={`
                                ${card.bg}
                                ${card.border}
                                border
                                rounded-2xl
                                p-5
                                transition-all
                                hover:shadow-md
                                ${card.onClick ? "cursor-pointer hover:scale-[1.02]" : ""}
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