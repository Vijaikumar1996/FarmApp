export default function BankDetails({ farm }) {
    return (
        <div className="border overflow-hidden">
            {/* Header */}
            <div className="bg-green-700 text-white px-3 py-1">
                <h3 className="font-semibold">Payment Details</h3>
            </div>
            {/* Bank Details */}
            <div className="p-3">
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 font-semibold w-28">Account</td>
                            <td className="py-2 font-medium">{farm.accountName}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-semibold">A/C No</td>
                            <td className="py-2 font-medium">{farm.accountNumber}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-semibold">Bank</td>
                            <td className="py-2 font-medium">{farm.bankName}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-semibold">IFSC</td>
                            <td className="py-2 font-medium">{farm.ifscCode}</td>
                        </tr>
                        <tr>
                            <td className="py-2 font-semibold">UPI</td>
                            <td className="py-2 font-bold text-green-600">{farm.upiId}</td>
                        </tr>
                    </tbody>
                </table>
                {/* QR Code */}
                <div className="mt-4 flex justify-center">
                    {farm.qrCodeUrl ? (
                        <img
                            src={farm.qrCodeUrl}
                            alt="QR Code"
                            className="w-44 h-44 object-contain border rounded"
                        />
                    ) : (
                        <div className="w-44 h-44 border-2 border-dashed rounded flex items-center justify-center text-gray-400 text-sm">
                            QR Code
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="mt-4 text-center">
                    <p className="text-[11px] text-red-600 font-semibold">
                        Please share the payment screenshot after completing the payment.
                    </p>
                </div>
            </div>
        </div>
    );
}
