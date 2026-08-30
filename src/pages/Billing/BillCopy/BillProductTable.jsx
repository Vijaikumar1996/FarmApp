export default function BillProductTable({
    products
}) {
    const totalQuantity = products.reduce(
        (sum, x) => sum + (Number(x.quantity) || 0),
        0
    );

    const totalAmount = products.reduce(
        (sum, x) => sum + (Number(x.amount) || 0),
        0
    );

    return (
        <div className="w-full">

            <table className="w-full table-fixed border-collapse text-base">

                <thead>
                    <tr>

                        <th className="border px-2 py-2 text-left font-semibold text-black w-[8%]">
                            S.No
                        </th>

                        <th className="border px-2 py-2 text-left font-semibold text-black w-[38%]">
                            Product
                        </th>

                        <th className="border px-2 py-2 text-center font-semibold text-black w-[14%]">
                            Total Days
                        </th>

                        <th className="border px-2 py-2 text-right font-semibold text-black w-[10%]">
                            Quantity
                        </th>

                        <th className="border px-2 py-2 text-right font-semibold text-black w-[15%]">
                            Rate
                        </th>

                        <th className="border px-2 py-2 text-right font-semibold text-black w-[15%]">
                            Amount
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {products.map((item, index) => (

                        <tr
                            key={index}
                            className="leading-tight"
                        >

                            {/* S.No */}

                            <td className="border px-2 py-2 text-black">
                                {index + 1}
                            </td>

                            {/* Product */}

                            <td className="border px-2 py-2 text-black break-words">
                                {item.productName}
                            </td>

                            {/* Total Days */}

                            <td className="border px-2 py-2 text-center text-black">
                                {item.totalDays}
                            </td>

                            {/* Quantity */}

                            <td className="border px-2 py-2 text-right text-black">
                                {item.quantity}
                            </td>

                            {/* Rate */}

                            <td className="border px-2 py-2 text-right text-black whitespace-nowrap">
                                ₹{Number(item.unitPrice).toFixed(2)}
                            </td>

                            {/* Amount */}

                            <td className="border px-2 py-2 text-right text-black font-medium whitespace-nowrap">
                                ₹{Number(item.amount).toFixed(2)}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}