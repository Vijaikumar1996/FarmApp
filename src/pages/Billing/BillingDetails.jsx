import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
// import PaymentDialog from "./PaymentDialog";
// import AdjustmentDialog from "./AdjustmentDialog";
import { useBillingDetails } from "../../queries/useBilling";
import CreatePayment from "./Payment/CreatePayment";
import CreateAdjustment from "./Adjustment/CreateAdjustment";
import CommonDrawer from "../../components/common/CommonDrawer";

export default function BillingDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const { customerId, billingMonth } = location.state;

    console.log("Customerid ", customerId);
    console.log("billingMonth ", billingMonth);

    const { data, isLoading, refetch } = useBillingDetails(customerId, billingMonth);
    const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
    const [showAdjustmentDrawer, setShowAdjustmentDrawer] = useState(false);

    const productColumns = useMemo(
        () => [
            {
                accessorKey: "deliveryDate",
                header: "Date",
            },
            {
                accessorKey: "productName",
                header: "Product",
            },
            {
                accessorKey: "quantity",
                header: "Qty",
            },
            // {
            //     accessorKey: "unitPrice",
            //     header: "Rate",
            //     cell: ({ row }) => <>₹{row.original.unitPrice.toFixed(2)}</>,
            // },
            {
                accessorKey: "amount",
                header: "Amount",
                cell: ({ row }) => (
                    <span className="font-semibold">₹{row.original.amount.toFixed(2)}</span>
                ),
            },
        ],
        []
    );

    const paymentColumns = useMemo(
        () => [
            {
                accessorKey: "paymentDate",
                header: "Date",
            },
            {
                accessorKey: "paymentMode",
                header: "Mode",
            },
            {
                accessorKey: "amount",
                header: "Amount",
                cell: ({ row }) => (
                    <span className="text-green-600 font-medium">₹{row.original.amount.toFixed(2)}</span>
                ),
            },
            {
                accessorKey: "remarks",
                header: "Remarks",
            },
        ],
        []
    );

    const adjustmentColumns = useMemo(
        () => [
            {
                accessorKey: "adjustmentDate",
                header: "Date",
            },
            {
                accessorKey: "reason",
                header: "Reason",
            },
            {
                accessorKey: "amount",
                header: "Amount",
                cell: ({ row }) => {
                    const css = row.original.amount >= 0 ? "text-green-600" : "text-red-600";
                    return <span className={css}>₹{row.original.amount.toFixed(2)}</span>;
                },
            },
            {
                accessorKey: "remarks",
                header: "Remarks",
            },
        ],
        []
    );

    if (isLoading) {
        return <div className="p-10">Loading...</div>;
    }

    if (!data) {
        return <div className="p-10">No billing details found.</div>;
    }

    const customer = data.customer;
    console.log("data", data);
    const summary = data.summary;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Customer Bill</h1>
                    <p className="text-gray-500 mt-1">Billing Details</p>
                </div>
                <button onClick={() => navigate(-1)} className="border rounded-xl px-4 py-2">
                    Back
                </button>
            </div>

            <div className="bg-white border rounded-2xl px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    {/* Customer Details */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                Customer
                            </span>

                            <span className="font-semibold text-gray-900">
                                {summary.customerName}
                            </span>
                        </div>

                        <div className="mt-1 text-sm text-gray-600 leading-5">
                            {summary.areaName}
                        </div>
                    </div>

                    {/* Billing Month */}
                    <div className="shrink-0 bg-gray-50 border rounded-xl px-4 py-2">
                        <div className="text-xs text-gray-500">
                            Billing Month
                        </div>

                        <div className="font-semibold text-gray-900">
                            {summary.billingMonth}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Previous Outstanding</p>
                    <h2 className="text-2xl font-bold mt-2">₹{summary.previousOutstanding.toFixed(2)}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Current Charges</p>
                    <h2 className="text-2xl font-bold mt-2">₹{summary.currentCharges.toFixed(2)}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Paid</p>
                    <h2 className="text-2xl font-bold mt-2 text-green-600">₹{summary.paidAmount.toFixed(2)}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <h2 className="text-2xl font-bold mt-2 text-red-600">₹{summary.totalOutstanding.toFixed(2)}</h2>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    disabled={summary.totalOutstanding <= 0}
                    onClick={() => setShowPaymentDrawer(true)}
                    className="bg-green-600 text-white px-5 py-2 rounded-xl"
                >
                    Receive Payment
                </button>
                <button
                    disabled={summary.totalOutstanding <= 0}
                    onClick={() => setShowAdjustmentDrawer(true)}
                    className="bg-yellow-500 text-white px-5 py-2 rounded-xl"
                >
                    Add Adjustment
                </button>
                <button
                    onClick={() =>
                        window.open(
                            `/billing/summary-print?customerId=${customerId}&billingMonth=${billingMonth}`,
                            "_blank"
                        )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-colors"
                >
                    Print Summary Bill
                </button>
            </div>

            {summary.totalOutstanding <= 0 && (
                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">✅</div>
                    <div>
                        <h3 className="font-semibold text-green-800">Bill Fully Settled</h3>
                        <p className="text-sm text-green-700 mt-1">
                            This customer's bill has been paid in full. No further payment or adjustment is required.
                        </p>
                    </div>
                </div>
            )}

            {/* Delivered Products */}
            <div className="bg-white border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Delivered Products</h2>
                </div>
                <DataTable
                    data={data.deliveries}
                    columns={productColumns}
                    pageSize={20}
                    globalSearch={false}
                    emptyMessage="No products found."
                />
            </div>

            {/* Payment History */}
            <div className="bg-white border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Payment History</h2>
                </div>
                <DataTable
                    data={data.payments}
                    columns={paymentColumns}
                    pageSize={10}
                    globalSearch={false}
                    emptyMessage="No payments found."
                />
            </div>

            {/* Adjustments */}
            <div className="bg-white border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Billing Adjustments</h2>
                </div>
                <DataTable
                    data={data.adjustments}
                    columns={adjustmentColumns}
                    pageSize={10}
                    globalSearch={false}
                    emptyMessage="No adjustments found."
                />
            </div>

            <CommonDrawer open={showPaymentDrawer} onClose={() => setShowPaymentDrawer(false)}>
                <CreatePayment
                    customerId={customerId}
                    billingMonth={billingMonth}
                    summary={summary}
                    onClose={() => setShowPaymentDrawer(false)}
                    onSuccess={() => {
                        refetch();
                        setShowPaymentDrawer(false);
                    }}
                />
            </CommonDrawer>
            <CommonDrawer open={showAdjustmentDrawer} onClose={() => setShowAdjustmentDrawer(false)}>
                <CreateAdjustment
                    customerId={customerId}
                    billingMonth={billingMonth}
                    summary={summary}
                    onClose={() => setShowAdjustmentDrawer(false)}
                    onSuccess={() => {
                        refetch();
                        setShowAdjustmentDrawer(false);
                    }}
                />
            </CommonDrawer>
        </div>
    );
}
