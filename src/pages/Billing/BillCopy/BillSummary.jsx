export default function BillSummary({ summary }) {

    const adjustmentAmount = Number(
        summary.adjustmentAmount || 0
    );

    const isCredit = adjustmentAmount > 0;

    const adjustmentType = isCredit
        ? "Credit"
        : "Debit";

    const displayAdjustmentAmount = Math.abs(
        adjustmentAmount
    );

    return (
        <div className="mt-3 w-full">

            <table className="w-full border-collapse">

                <tbody>

                    <tr>
                        <td className="border px-4 py-3">
                            Product Amount
                        </td>

                        <td className="border px-4 py-3 text-right">
                            ₹{summary.productAmount.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-3">
                            Delivery Charge
                        </td>

                        <td className="border px-4 py-3 text-right">
                            ₹{summary.deliveryCharge.toFixed(2)}
                        </td>
                    </tr>

                    {adjustmentAmount !== 0 && (
                        <tr>
                            <td className="border px-4 py-3">
                                Adjustment
                            </td>

                            <td
                                className={`border px-4 py-3 text-right font-semibold ${
                                    isCredit
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {adjustmentType} ₹
                                {displayAdjustmentAmount.toFixed(2)}
                            </td>
                        </tr>
                    )}

                    <tr className="bg-gray-100 font-semibold">
                        <td className="border px-4 py-3">
                            Current Charges
                        </td>

                        <td className="border px-4 py-3 text-right">
                            ₹{summary.currentCharges.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-3">
                            Previous Outstanding
                        </td>

                        <td className="border px-4 py-3 text-right">
                            ₹{summary.previousOutstanding.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-3">
                            Paid Amount
                        </td>

                        <td className="border px-4 py-3 text-right text-green-700 font-semibold">
                            ₹{summary.paidAmount.toFixed(2)}
                        </td>
                    </tr>

                    <tr className="border-y-2 border-black">
                        <td className="px-3 py-3 font-bold text-lg">
                            TOTAL OUTSTANDING
                        </td>

                        <td className="px-3 py-3 text-right font-bold text-xl">
                            ₹{summary.totalOutstanding.toFixed(2)}
                        </td>
                    </tr>

                </tbody>

            </table>

        </div>
    );
}