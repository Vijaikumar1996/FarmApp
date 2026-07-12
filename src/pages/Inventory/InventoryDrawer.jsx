import { useState } from "react";

// import Drawer from "../../../components/common/Drawer";

import InventorySummaryCard from "./InventorySummaryCard";
import InventoryTransactionForm from "./InventoryTransactionForm";
import InventoryTransactionTable from "./InventoryTransactionTable";

const TABS = {
  SUMMARY: "SUMMARY",
  TRANSACTIONS: "TRANSACTIONS",
};

export default function InventoryDrawer({ open, onClose, product, stockDate }) {
  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);

  if (!product) return null;

  return (
    <div open={open} onClose={onClose} title={product.productName} width={650}>
      <div className="flex border-b mb-5">
        <button
          className={`
                        px-5
                        py-3
                        font-medium
                        border-b-2
                        ${
                          activeTab === TABS.SUMMARY
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent"
                        }
                    `}
          onClick={() => setActiveTab(TABS.SUMMARY)}
        >
          Summary
        </button>

        <button
          className={`
                        px-5
                        py-3
                        font-medium
                        border-b-2
                        ${
                          activeTab === TABS.TRANSACTIONS
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent"
                        }
                    `}
          onClick={() => setActiveTab(TABS.TRANSACTIONS)}
        >
          Transactions
        </button>
      </div>

      {activeTab === TABS.SUMMARY && (
        <>
          <InventorySummaryCard product={product} />

          <InventoryTransactionForm product={product} stockDate={stockDate} />
        </>
      )}

      {activeTab === TABS.TRANSACTIONS && (
        <InventoryTransactionTable
          productId={product.productId}
          stockDate={stockDate}
        />
      )}
    </div>
  );
}
