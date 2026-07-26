import { useEffect } from "react";
import { useSearchParams } from "react-router";

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

    const { data, isLoading } = useSummaryBill(customerId, billingMonth);

    useEffect(() => {
        if (!data) return;

        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timer);
    }, [data]);

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
            <div className="bg-white w-[250mm] min-h-[297mm] mx-auto shadow-xl p-5 print:p-4 print:shadow-none">
                <BillHeader farm={data.farm} customer={data.customer} />

                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                        <BillProductTable products={data.products} />
                        <BillSummary summary={data.summary} />
                    </div>
                    <div>
                        <BankDetails farm={data.farm} />
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
                    Thank you for choosing
                    <span className="font-semibold"> {AppConfig.companyName}</span>
                    ❤️
                </div>
            </div>
        </div>
    );
}
