export default function InventorySummaryCard({ product }) {
  return (
    <div
      className="
                bg-blue-50
                rounded-xl
                p-4
            "
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Opening Stock</p>

          <h2 className="text-2xl font-bold">{product.openingStock}</h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Available Stock</p>

          <h2 className="text-2xl font-bold text-green-600">
            {product.availableStock}
          </h2>
        </div>
      </div>
    </div>
  );
}
