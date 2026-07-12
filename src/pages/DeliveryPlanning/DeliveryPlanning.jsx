import { useState } from "react";

import GenerateDeliveryTab from "./GenerateDeliveryTab";
import FarmSummaryTab from "./FarmSummaryTab";
import DriverLoadingTab from "./DriverLoadingTab";
import DeliveryBoyTab from "./DeliveryBoyTab";

const tabs = [
  {
    id: "generate",
    label: "Generate Delivery",
  },
  {
    id: "farmSummary",
    label: "Farm Summary",
  },
  {
    id: "driverLoading",
    label: "Driver Loading",
  },
  {
    id: "deliveryBoy",
    label: "Delivery Boy Sheet",
  },
];

export default function DeliveryPlanning() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Delivery Planning
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Generate deliveries and view planning reports.
        </p>
      </div>

      {/* Tabs */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6
                py-4
                text-sm
                font-medium
                transition
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "generate" && <GenerateDeliveryTab />}

          {activeTab === "farmSummary" && <FarmSummaryTab />}

          {activeTab === "driverLoading" && <DriverLoadingTab />}

          {activeTab === "deliveryBoy" && <DeliveryBoyTab />}
        </div>
      </div>
    </div>
  );
}