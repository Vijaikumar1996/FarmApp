import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import FormGrid from "../../components/form/FormGrid";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";

import DateField from "../../components/form/form-input/DateField";
import SelectField from "../../components/form/form-input/SelectField";

import {
    useExpectedDeliveries,
    useHoldExpectedDelivery,
    useHoldAllExpectedDeliveries,
} from "../../queries/useDeliveryPlanning";

import { getTomorrowDate } from "../../utils/commonUtils";
import ProductDropdown from "../../components/form/custom-input/ProductDropdown";

export default function ExpectedDeliveriesTab() {

    const tomorrowDate = getTomorrowDate();

    const { control } = useForm({
        defaultValues: {
            deliveryDate: tomorrowDate,
            source: "all",
            productId: "",
        },
    });

    const deliveryDate = useWatch({
        control,
        name: "deliveryDate",
    });

    const source = useWatch({
        control,
        name: "source",
    });

    const productId = useWatch({
        control,
        name: "productId",
    });

    const [searchFilter, setSearchFilter] = useState(null);

    const handleSearch = () => {

        if (!productId) {
            toast.error("Please select a product.");
            return;
        }

        setSearchFilter({
            deliveryDate,
            source,
            productId,
        });
    };


    // ============================================================
    // Expected Deliveries
    // ============================================================

    const {
        data = [],
        isLoading,
    } = useExpectedDeliveries(
        searchFilter?.deliveryDate,
        searchFilter?.source,
        searchFilter?.productId
    );


    // ============================================================
    // Hold mutations
    // ============================================================

    const holdMutation = useHoldExpectedDelivery();

    const holdAllMutation =
        useHoldAllExpectedDeliveries();


    const hasSearched = searchFilter !== null;


    // ============================================================
    // Totals
    // ============================================================

    const totalCustomers = data.length;

    const totalQuantity = data.reduce(
        (sum, item) =>
            sum + Number(item.quantity ?? 0),
        0
    );


    // ============================================================
    // Individual Hold
    // ============================================================

    const handleHold = (row) => {

        if (!row.subscriptionId) {
            toast.error(
                "This delivery cannot be put on hold."
            );

            return;
        }

        holdMutation.mutate({
            subscriptionId: row.subscriptionId,
            deliveryDate:
                searchFilter.deliveryDate,

            productId: row.productId,

            quantity: row.quantity,
        });
    };


    // ============================================================
    // Hold All
    // ============================================================

    const handleHoldAll = () => {

        if (!data.length) {
            toast.error(
                "No expected deliveries available."
            );

            return;
        }

        if (!searchFilter?.deliveryDate) {
            toast.error(
                "Please select a delivery date."
            );

            return;
        }

        if (!searchFilter?.productId) {
            toast.error(
                "Please select a product."
            );

            return;
        }


        const subscriptionRows = data.filter(
            x => x.subscriptionId
        );


        if (!subscriptionRows.length) {
            toast.error(
                "There are no subscription deliveries to hold."
            );

            return;
        }


        const confirmed = window.confirm(
            `Hold all ${subscriptionRows.length} expected ` +
            `deliveries for this product on ` +
            `${searchFilter.deliveryDate}?\n\n` +
            `Total Quantity: ${subscriptionRows.reduce(
                (sum, item) =>
                    sum + Number(item.quantity ?? 0),
                0
            )}`
        );


        if (!confirmed)
            return;


        holdAllMutation.mutate({
            deliveryDate:
                searchFilter.deliveryDate,

            productId:
                Number(searchFilter.productId),

            source:
                searchFilter.source,
        });
    };


    // ============================================================
    // Table columns
    // ============================================================

    const columns = useMemo(
        () => [

            {
                accessorKey: "customerName",
                header: "Customer",

                cell: ({ row }) => (

                    <span className="font-semibold text-gray-800">
                        {row.original.customerName}
                    </span>

                ),
            },


            {
                accessorKey: "productCode",
                header: "Code",

                cell: ({ row }) => (

                    <span className="font-semibold text-gray-700">
                        {row.original.productCode}
                    </span>

                ),
            },


            {
                accessorKey: "productName",
                header: "Product",

                cell: ({ row }) => (

                    <span className="text-gray-700">
                        {row.original.productName}
                    </span>

                ),
            },


            {
                accessorKey: "quantity",
                header: "Expected Qty",

                cell: ({ row }) => (

                    <span className="font-semibold text-blue-700">
                        {row.original.quantity}
                    </span>

                ),
            },


            {
                accessorKey: "source",
                header: "Source",

                cell: ({ row }) => {

                    const source =
                        row.original.source;

                    return (

                        <span
                            className={
                                source === "Replace"
                                    ? "rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                                    : source === "Request"
                                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                        : "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                            }
                        >
                            {source}
                        </span>

                    );
                },
            },


            {
                id: "action",
                header: "Action",

                cell: ({ row }) => {

                    const item =
                        row.original;


                    // Non-subscription requests
                    // cannot be held using
                    // subscriptionId.

                    if (!item.subscriptionId) {

                        return (

                            <span className="text-xs text-gray-400">
                                —
                            </span>

                        );
                    }


                    return (


                        <button
                            type="button"
                            disabled={
                                holdMutation.isPending ||
                                holdAllMutation.isPending
                            }
                            onClick={() => handleHold(item)}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Hold
                        </button>
                        // <Button
                        //     type="button"
                        //     variant="outline"
                        //     disabled={
                        //         holdMutation.isPending ||
                        //         holdAllMutation.isPending
                        //     }
                        //     onClick={() =>
                        //         handleHold(item)
                        //     }
                        // >
                        //     Hold Delivery
                        // </Button>

                    );
                },
            },

        ],
        [
            holdMutation.isPending,
            holdAllMutation.isPending,
            searchFilter?.deliveryDate,
        ]
    );


    return (

        <div className="space-y-5">

            {/* ======================================================
                Filters
            ======================================================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-5">

                <FormGrid
                    cols={4}
                    gap={4}
                >

                    <DateField
                        control={control}
                        name="deliveryDate"
                        label="Delivery Date"
                    />


                    <SelectField
                        control={control}
                        name="source"
                        label="Source"
                        options={[
                            {
                                id: "all",
                                name: "All",
                            },
                            {
                                id: "subscription",
                                name: "Subscription",
                            },
                            {
                                id: "request",
                                name: "Request",
                            },
                        ]}
                    />


                    <ProductDropdown
                        name="productId"
                        control={control}
                        label="Product"
                        required
                    />


                    <div className="flex items-end">

                        <Button
                            type="button"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>

                    </div>

                </FormGrid>

            </div>


            {/* ======================================================
                Summary
            ======================================================= */}

            {hasSearched && !isLoading && (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="rounded-xl border border-gray-200 bg-white p-5">

                        <p className="text-sm text-gray-500">
                            Expected Customers
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-gray-800">
                            {totalCustomers}
                        </p>

                    </div>


                    <div className="rounded-xl border border-gray-200 bg-white p-5">

                        <p className="text-sm text-gray-500">
                            Total Expected Quantity
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-blue-700">
                            {totalQuantity}
                        </p>

                    </div>


                    <div className="flex items-center justify-end rounded-xl border border-gray-200 bg-white p-5">

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                !data.length ||
                                holdAllMutation.isPending ||
                                holdMutation.isPending
                            }
                            onClick={handleHoldAll}
                        >
                            {holdAllMutation.isPending
                                ? "Holding..."
                                : "Hold All"}
                        </Button>

                    </div>

                </div>

            )}


            {/* ======================================================
                Data Table
            ======================================================= */}

            <DataTable
                data={data}
                columns={columns}
                loading={isLoading}
                pageSize={20}
                emptyMessage="No expected deliveries available."
            />

        </div>

    );
}