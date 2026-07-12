import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import InputField from "../../components/form/form-input/InputField";
import FormGrid from "../../components/form/FormGrid";

export default function Inventory() {
  const { control } = useForm();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const inventory = [
    {
      id: 1,
      product: "Paneer",
      opening: 35,
      received: 50,
      ordered: 42,
      delivered: 40,
      balance: 43,
    },
    {
      id: 2,
      product: "Milk",
      opening: 20,
      received: 100,
      ordered: 80,
      delivered: 75,
      balance: 45,
    },
    {
      id: 3,
      product: "Curd",
      opening: 10,
      received: 30,
      ordered: 25,
      delivered: 25,
      balance: 15,
    },
    {
      id: 4,
      product: "Egg Tray",
      opening: 15,
      received: 20,
      ordered: 18,
      delivered: 16,
      balance: 19,
    },
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
      },
      {
        accessorKey: "opening",
        header: "Opening",
      },
      {
        accessorKey: "received",
        header: "Received",
        cell: (info) => (
          <span className="text-green-600 font-medium">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "ordered",
        header: "Ordered",
        cell: (info) => (
          <span className="text-blue-600 font-medium">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "delivered",
        header: "Delivered",
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => {
          const balance = row.original.balance;

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                balance <= 10
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {balance}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Inventory Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track daily stock movement
          </p>
        </div>

        <button
          onClick={() => navigate("/inventory/stockentry")}
          className="
                        px-5
                        py-2.5
                        bg-blue-600
                        text-white
                        rounded-xl
                        hover:bg-blue-700
                        transition
                    "
        >
          + Add Stock
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Products</p>

          <h3 className="text-2xl font-bold">4</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Received Today</p>

          <h3 className="text-2xl font-bold text-green-600">200</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Ordered Today</p>

          <h3 className="text-2xl font-bold text-blue-600">165</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-gray-500">Delivered Today</p>

          <h3 className="text-2xl font-bold text-orange-600">156</h3>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <div className="mb-5">
          <FormGrid cols={3} gap={4}>
            <InputField
              name="product"
              label="Product"
              placeholder="Search product"
              control={control}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>

              <input
                type="date"
                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-xl
                                    px-4
                                    py-2.5
                                "
              />
            </div>

            <div className="flex items-end">
              <button
                className="
                                    w-full
                                    bg-gray-900
                                    text-white
                                    rounded-xl
                                    px-4
                                    py-2.5
                                "
              >
                Search
              </button>
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={inventory}
          columns={columns}
          pageSize={10}
          emptyMessage="No inventory found"
          globalSearch={false}
        />
      </div>
    </div>
  );
}
