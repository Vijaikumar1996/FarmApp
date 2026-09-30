import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

import BillHeader from "./BillCopy/BillHeader";
import BillProductTable from "./BillCopy/BillProductTable";
import BillSummary from "./BillCopy/BillSummary";
import BankDetails from "./BillCopy/BankDetails";

import { useBilling } from "../../queries/useBilling";
import { getSummaryBill } from "../../services/billingService";
import AppConfig from "../../utils/appConfig";

export default function BulkBills() {

    const [searchParams] = useSearchParams();

    const billingMonth =
        searchParams.get("billingMonth");

    const billRef = useRef(null);

    const [currentBill, setCurrentBill] = useState(null);

    const [isGenerating, setIsGenerating] =
        useState(false);

    const [progress, setProgress] =
        useState(0);

    const [currentCustomer, setCurrentCustomer] =
        useState("");

    // Get all customers for billing month
    const {
        data: billingData,
        isLoading: isBillingLoading
    } = useBilling({
        BillingMonth: billingMonth
    });


    const handleDownloadAll = async () => {

        if (!billingData?.items?.length) {
            toast.error("No bills found.");
            return;
        }

        if (isGenerating) return;

        setIsGenerating(true);
        setProgress(0);

        const zip = new JSZip();

        const customers =
            billingData.items;

        try {

            for (let i = 0; i < customers.length; i++) {

                const customer =
                    customers[i];

                setCurrentCustomer(
                    customer.customerName
                );

                // Get complete bill data
                const billData =
                    await getSummaryBill(
                        customer.customerId,
                        billingMonth
                    );

                // Render bill
                setCurrentBill(billData);

                // Give React time to render
                await waitForRender();

                if (!billRef.current) {
                    throw new Error(
                        "Bill element not found."
                    );
                }

                // Convert bill to PNG
                const dataUrl =
                    await toPng(
                        billRef.current,
                        {
                            backgroundColor:
                                "#ffffff",

                            pixelRatio: 2,

                            cacheBust: true,

                            width:
                                billRef.current
                                    .scrollWidth,

                            height:
                                billRef.current
                                    .scrollHeight,
                        }
                    );

                // Convert base64 to zip file
                const base64 =
                    dataUrl.split(",")[1];

                const fileName =
                    `${String(i + 1).padStart(3, "0")}-${sanitizeFileName(
                        customer.customerName
                    )}.png`;

                zip.file(
                    fileName,
                    base64,
                    {
                        base64: true
                    }
                );

                setProgress(i + 1);
            }

            // Generate ZIP
            const zipBlob =
                await zip.generateAsync({
                    type: "blob"
                });

            saveAs(
                zipBlob,
                `Bills-${billingMonth}.zip`
            );

            toast.success(
                `${customers.length} bills downloaded successfully.`
            );

        } catch (error) {

            console.error(
                "Bulk bill generation failed:",
                error
            );

            toast.error(
                "Failed to generate bills."
            );

        } finally {

            setIsGenerating(false);
            setCurrentCustomer("");
            setCurrentBill(null);
        }
    };


    if (isBillingLoading) {

        return (
            <div className="flex justify-center items-center h-screen">
                Loading customers...
            </div>
        );
    }


    const customerCount =
        billingData?.items?.length ?? 0;


    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}

            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-xl shadow p-6">

                    <h1 className="text-xl font-semibold">
                        Download Customer Bills
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Billing Month:{" "}
                        <span className="font-medium">
                            {billingMonth}
                        </span>
                    </p>

                    <div className="mt-6">

                        <p className="text-sm text-gray-600">
                            Total Customers
                        </p>

                        <p className="text-2xl font-bold">
                            {customerCount}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleDownloadAll}
                        disabled={
                            isGenerating ||
                            customerCount === 0
                        }
                        className="
                            mt-6
                            px-6
                            py-3
                            bg-green-600
                            text-white
                            rounded-lg
                            disabled:bg-gray-400
                            disabled:cursor-not-allowed
                        "
                    >
                        {isGenerating
                            ? "Generating Bills..."
                            : "Download All Bills"}
                    </button>


                    {/* PROGRESS */}

                    {isGenerating && (

                        <div className="mt-6">

                            <div className="flex justify-between text-sm mb-2">

                                <span>
                                    Generating:
                                    {" "}
                                    {currentCustomer}
                                </span>

                                <span>
                                    {progress} /{" "}
                                    {customerCount}
                                </span>

                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">

                                <div
                                    className="bg-green-600 h-3 rounded-full transition-all"
                                    style={{
                                        width: `${customerCount
                                            ? (progress / customerCount) * 100
                                            : 0
                                            }%`
                                    }}
                                />

                            </div>

                        </div>
                    )}

                </div>

            </div>


            {/* HIDDEN BILL */}

            {currentBill && (

                <div
                    style={{
                        position: "fixed",
                        left: "-10000px",
                        top: 0,
                        zIndex: -1,
                    }}
                >

                    <div
                        ref={billRef}
                        className="
                            bg-white
                            w-[250mm]
                            min-h-[297mm]
                            p-5
                        "
                    >

                        <BillHeader
                            farm={
                                currentBill.farm
                            }
                            customer={
                                currentBill.customer
                            }
                        />

                        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-2">

                            <div className="min-w-0">

                                <BillProductTable
                                    products={
                                        currentBill.products
                                    }
                                />

                                <BillSummary
                                    summary={
                                        currentBill.summary
                                    }
                                />

                            </div>


                            <div className="min-w-0">

                                <BankDetails
                                    farm={
                                        currentBill.farm
                                    }
                                />

                            </div>

                        </div>


                        <div className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">

                            Thank you for choosing

                            <span className="font-semibold">
                                {" "}
                                {AppConfig.companyName}
                            </span>

                            ❤️

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


/**
 * Wait for React DOM rendering
 */
function waitForRender() {

    return new Promise(resolve => {

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                resolve();

            });

        });

    });
}


/**
 * Make customer name safe for filename
 */
function sanitizeFileName(name) {

    return name
        ?.replace(/[<>:"/\\|?*]/g, "")
        ?.replace(/\s+/g, "-")
        ?.trim()
        || "Customer";
}