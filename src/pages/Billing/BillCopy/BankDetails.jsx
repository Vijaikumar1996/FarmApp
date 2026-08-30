import qrscanner from "/images/qrscanner.png";
export default function BankDetails({ farm }) {
    return (
        <div className="border overflow-hidden uppercase">

            {/* Header */}

            <div className="px-3 py-2 border-b">
                <h3 className="text-base font-semibold text-black">
                    Payment Details
                </h3>
            </div>


            {/* Bank Details */}

            <div className="px-3 py-2">

                <table className="w-full text-sm">

                    <tbody>

                        <tr className="border-b">
                            <td className="py-1.5 font-semibold w-28">
                                Account
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm.accountName}
                            </td>
                        </tr>

                        <tr className="border-b">
                            <td className="py-1.5 font-semibold">
                                A/C No
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm.accountNumber}
                            </td>
                        </tr>

                        <tr className="border-b">
                            <td className="py-1.5 font-semibold">
                                Bank
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm.bankName}
                            </td>
                        </tr>

                        <tr className="border-b">
                            <td className="py-1.5 font-semibold">
                                IFSC
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm.ifscCode}
                            </td>
                        </tr>

                        <tr>
                            <td className="py-1.5 font-semibold">
                                UPI
                            </td>

                            <td className="py-1.5 font-bold text-green-600">
                                {farm.upiId}
                            </td>
                        </tr>

                    </tbody>

                </table>


                {/* QR Code */}

                <div className="mt-3 flex justify-center">

                    {qrscanner ? (

                        <img
                            src={qrscanner}
                            alt="QR Code"
                            className="w-60 h-60 object-contain"
                        />

                    ) : (

                        <div className="w-40 h-40 border-2 border-dashed flex items-center justify-center text-gray-400 text-sm">
                            QR Code
                        </div>

                    )}

                </div>


                {/* Footer */}

                <div className="mt-3 text-center">

                    <p className="text-xs text-red-600 font-semibold leading-tight">
                        Please share the payment screenshot
                        <br />
                        after completing the payment.
                    </p>

                </div>

            </div>

        </div>
    );
}