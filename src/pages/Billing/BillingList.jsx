
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";

import DataTable from "../../components/common/DataTable";
import FormGrid from "../../components/form/FormGrid";
import { useBilling } from "../../queries/useBilling";
import DateField from "../../components/form/form-input/DateField";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";
import { loadCustomerOptions } from "../../utils/customerLoader";
import SelectField from "../../components/form/form-input/SelectField";
import SearchButton from "../../components/common/SearchButton";

export default function BillingList() {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationState = location.state || {};

    const customerTypeOptions = [
        { id: "", name: "All" },
        { id: "SUBSCRIPTION", name: "Subscription" },
        { id: "NON_SUBSCRIPTION", name: "Non-Subscription" },
    ];

    const paymentStatusOptions = [
        { id: "", name: "All" },
        { id: "PENDING", name: "Pending" },
        { id: "PAID", name: "Paid" },
    ];

    const defaultValues = {
        BillingMonth: navigationState.BillingMonth ?? new Date().toISOString().split("T")[0],
        CustomerId: null,
        customerType: navigationState.customerType ?? "",
        paymentStatus: navigationState.paymentStatus ?? "",
    };

    const [searchFilters, setSearchFilters] = useState(defaultValues);

    const { control, handleSubmit } = useForm({ defaultValues: defaultValues });
    const { data, isLoading, refetch } = useBilling(searchFilters);
    const billingList = data?.items ?? [];
    const summary =
        data?.summary ?? {
            customerCount: 0,
            totalBill: 0,
            totalPaid: 0,
            totalOutstanding: 0,
        };

    const onSubmit = (values) => setSearchFilters(values);

    const pinnedColumns = useMemo(() => ({ left: ["customerName"] }), []);

    const columns = useMemo(
        () => [
            {
                accessorKey: "customerName",
                header: "Customer",
                cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.customerName}</span>,
            },
            { accessorKey: "areaCode", header: "Area" },
            { accessorKey: "productAmount", header: "Products", cell: ({ row }) => <span>₹{row.original.productAmount.toFixed(2)}</span> },
            { accessorKey: "deliveryCharge", header: "Delivery", cell: ({ row }) => <span>₹{row.original.deliveryCharge.toFixed(2)}</span> },
            { accessorKey: "adjustmentAmount", header: "Adjustment", cell: ({ row }) => <span>₹{row.original.adjustmentAmount.toFixed(2)}</span> },
            {
                id: "totalBill",
                header: "Total Bill",
                cell: ({ row }) => {
                    const total = row.original.productAmount + row.original.deliveryCharge + row.original.adjustmentAmount;
                    return <span className="font-semibold">₹{total.toFixed(2)}</span>;
                },
            },
            { accessorKey: "paidAmount", header: "Paid", cell: ({ row }) => <span className="text-green-600 font-medium">₹{row.original.paidAmount.toFixed(2)}</span> },
            { accessorKey: "balanceAmount", header: "Balance", cell: ({ row }) => <span className="text-red-600 font-medium">₹{row.original?.currentMonthBalance?.toFixed(2)}</span> },
            {
                id: "status",
                header: "Status",
                cell: ({ row }) => {
                    const paid = row.original.paidAmount;
                    const balance = row.original.currentMonthBalance;
                    let status = "PENDING";
                    let css = "bg-red-100 text-red-700";
                    if (balance === 0) {
                        status = "PAID";
                        css = "bg-green-100 text-green-700";
                    } else if (paid > 0) {
                        status = "PARTIAL";
                        css = "bg-yellow-100 text-yellow-700";
                    }
                    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${css}`}>{status}</span>;
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        onClick={() =>
                            navigate("/billing/details", {
                                state: {
                                    customerId: row.original.customerId,
                                    billingMonth: row.original.billingMonth,
                                },
                            })
                        }
                        className="text-blue-600 hover:underline font-medium"
                    >
                        View Bill
                    </button>
                ),
            },
        ],
        [navigate]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Billing</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage monthly billing and collections</p>
                </div>
                {/* <button onClick={() => refetch()} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                    Refresh
                </button> */}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGrid cols={5} gap={4}>
                        <DateField control={control} name="BillingMonth" label="Billing Month" mode="month" />
                        <AsyncTypeahead name="CustomerId" control={control} label="Customer" required loadOptions={loadCustomerOptions} />

                        <SelectField
                            name="customerType"
                            label="Customer Type"
                            control={control}
                            options={customerTypeOptions}
                        />

                        <SelectField
                            name="paymentStatus"
                            label="Payment Status"
                            control={control}
                            options={paymentStatusOptions}
                        />
                        <div className="flex items-end">
                            <SearchButton onClick={handleSubmit(onSubmit)} />

                        </div>
                    </FormGrid>
                </form>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Customers</p>
                    <h2 className="text-3xl font-bold mt-2">{summary.customerCount}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Total Bill</p>
                    <h2 className="text-3xl font-bold mt-2">₹{summary.totalBill.toFixed(2)}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Collected</p>
                    <h2 className="text-3xl font-bold mt-2 text-green-600">₹{summary?.totalCollected?.toFixed(2)}</h2>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <h2 className="text-3xl font-bold mt-2 text-red-600">₹{summary.totalOutstanding.toFixed(2)}</h2>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <DataTable
                    data={billingList}
                    columns={columns}
                    pageSize={10}
                    pinnedColumns={pinnedColumns}
                    loading={isLoading}                   
                    emptyMessage="No billing records found."
                />
            </div>
        </div>
    );
}