export default function BillProductTable({
    products
}) {
    const totalQuantity = products.reduce(
        (sum, x) => sum + x.quantity,
        0
    );

    const totalAmount = products.reduce(
        (sum, x) => sum + x.amount,
        0
    );

    return (
        <div className="">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-700 text-white">
                        <th className="border px-2 py-1 text-left w-16">
                            S.No
                        </th>
                        <th className="border px-2 py-1 text-left">
                            Product
                        </th>
                        <th className="border px-2 py-1 text-left">
                            Total Days
                        </th>
                        <th className="border px-2 py-1 text-right">
                            Quantity
                        </th>
                        <th className="border px-2 py-1 text-right">
                            Rate
                        </th>
                        <th className="border px-2 py-1 text-right">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border px-4 py-3">
                                {index + 1}
                            </td>
                            <td className="border px-4 py-3">
                                {item.productName}
                            </td>
                            <td className="border px-4 py-3">
                                {item.totalDays}
                            </td>
                            <td className="border px-4 py-3 text-right">
                                {item.quantity}
                            </td>
                            <td className="border px-4 py-3 text-right">
                                ₹{item.unitPrice.toFixed(2)}
                            </td>
                            <td className="border px-4 py-3 text-right font-medium">
                                ₹{item.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
