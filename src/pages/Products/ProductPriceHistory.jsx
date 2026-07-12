import { usePriceHistory } from "../../queries/useProduct";

export default function ProductPriceHistory({ product, onClose }) {
  const { data, isLoading } = usePriceHistory(product.id);

  const prices = data?.data ?? data ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Price History</h2>

          <p className="text-sm text-gray-500">{product.productName}</p>
        </div>

        <button onClick={onClose} className="px-4 py-2 border rounded-xl">
          Close
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Price</th>

            <th className="border px-4 py-2">Effective From</th>

            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : prices.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6">
                No price history found.
              </td>
            </tr>
          ) : (
            prices.map((price) => (
              <tr key={price.id}>
                <td className="border px-4 py-2">₹ {price.sellingPrice}</td>

                <td className="border px-4 py-2">{price.effectiveFrom}</td>

                <td className="border px-4 py-2">
                  {new Date(price.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
