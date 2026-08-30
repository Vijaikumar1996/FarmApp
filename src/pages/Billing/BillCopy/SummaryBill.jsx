import { useRef } from "react";
import { useSearchParams } from "react-router";
import { toPng } from "html-to-image";

import BillHeader from "./BillHeader";
import BillProductTable from "./BillProductTable";
import BillSummary from "./BillSummary";
import { useSummaryBill } from "../../../queries/useBilling";
import "../../../css/print.css";
import BankDetails from "./BankDetails";
import AppConfig from "../../../utils/appConfig";

export default function SummaryBill() {
    const [searchParams] = useSearchParams();

    const customerId = searchParams.get("customerId");
    const billingMonth = searchParams.get("billingMonth");

    const billRef = useRef(null);

    const { data, isLoading } = useSummaryBill(
        customerId,
        billingMonth
    );

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadImage = async () => {
        if (!billRef.current) return;

        try {
            const element = billRef.current;

            const width = element.scrollWidth;
            const height = element.scrollHeight;

            const dataUrl = await toPng(element, {
                width,
                height,
                canvasWidth: width * 2,
                canvasHeight: height * 2,
                pixelRatio: 1,
                backgroundColor: "#ffffff",
                cacheBust: true,
            });

            const link = document.createElement("a");

            link.download = `Bill-${data.customer.customerName}-${billingMonth}.png`;
            link.href = dataUrl;

            link.click();
        } catch (error) {
            console.error(
                "Failed to generate bill image:",
                error
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading Bill...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                Bill not found.
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-3 py-4 print:hidden">

                <button
                    type="button"
                    onClick={handlePrint}
                    className="
                        px-5
                        py-2
                        bg-gray-800
                        text-white
                        rounded-lg
                    "
                >
                    Print Bill
                </button>

                <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="
                        px-5
                        py-2
                        bg-green-600
                        text-white
                        rounded-lg
                    "
                >
                    Download Image
                </button>

            </div>

            {/* BILL */}
            <div
                ref={billRef}
                className="
                    bg-white
                    mx-auto
                    p-5
                    shadow-xl
                    print:shadow-none
                "
            >

                <BillHeader
                    farm={data.farm}
                    customer={data.customer}
                />

                <div
                    className="
                        grid
                        grid-cols-[minmax(0,3fr)_minmax(0,1fr)]
                        gap-8
                    "
                >

                    {/* LEFT SIDE */}
                    <div className="min-w-0">

                        <BillProductTable
                            products={data.products}
                        />

                        <BillSummary
                            summary={data.summary}
                        />

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="min-w-0">

                        <BankDetails
                            farm={data.farm}
                        />

                    </div>

                </div>

                {/* FOOTER */}
                <div
                    className="
                        mt-12
                        pt-6
                        border-t
                        text-center
                        text-gray-500
                        text-sm
                    "
                >
                    Thank you for choosing

                    <span className="font-semibold">
                        {" "}
                        {AppConfig.companyName}
                    </span>

                    ❤️
                </div>

            </div>

        </div>
    );
}