import qrscanner from "/images/qrscanner.png";
import luxuryqrscanner from "/images/luxuryqrscanner.png";

export default function BankDetails({ farm }) {

    // Select QR code based on customer type
    const qrCode =
        farm?.customerType?.toUpperCase() === "LUXURY"
            ? luxuryqrscanner
            : qrscanner;

    return (
        <div className="border overflow-hidden uppercase">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="px-3 py-2 border-b">
                <h3 className="text-base font-semibold text-black">
                    Payment Details
                </h3>
            </div>


            {/* =========================================
                BANK DETAILS
            ========================================= */}

            <div className="px-3 py-2">

                <table className="w-full text-sm">

                    <tbody>

                        {/* Account Name */}
                        <tr className="border-b">

                            <td className="py-1.5 font-semibold w-28">
                                Account
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm?.accountName}
                            </td>

                        </tr>


                        {/* Account Number */}
                        <tr className="border-b">

                            <td className="py-1.5 font-semibold">
                                A/C No
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm?.accountNumber}
                            </td>

                        </tr>


                        {/* Bank */}
                        <tr className="border-b">

                            <td className="py-1.5 font-semibold">
                                Bank
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm?.bankName}
                            </td>

                        </tr>


                        {/* IFSC */}
                        <tr className="border-b">

                            <td className="py-1.5 font-semibold">
                                IFSC
                            </td>

                            <td className="py-1.5 font-medium">
                                {farm?.ifscCode}
                            </td>

                        </tr>


                        {/* UPI */}
                        <tr>

                            <td className="py-1.5 font-semibold">
                                UPI
                            </td>

                            <td className="py-1.5 font-bold text-green-600">
                                {farm?.upiId}
                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =========================================
                    QR CODE
                ========================================= */}

                <div className="mt-3 flex justify-center">

                    {qrCode ? (

                        <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-100 h-100 object-contain"
                        />

                    ) : (

                        <div className="w-40 h-40 border-2 border-dashed flex items-center justify-center text-gray-400 text-sm">
                            QR Code
                        </div>

                    )}

                </div>


                {/* =========================================
                    FOOTER
                ========================================= */}

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