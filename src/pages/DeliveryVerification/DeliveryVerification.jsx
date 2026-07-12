// DeliveryVerification.jsx

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import InputField from "../../components/form/form-input/InputField";
import FormGrid from "../../components/form/FormGrid";

/* ---------------- Component ---------------- */

export default function DeliveryVerification() {
  const navigate = useNavigate();

  const { control } = useForm();

  /* ---------------- Sample Data ---------------- */

  const data = [
    {
      id: 1,
      order_no: "ORD1001",
      customer: "Ravi Kumar",
      area: "MED",
      order_date: "29-May-2026",
      delivery_date: "30-May-2026",
      verification_status: "PENDING",
    },

    {
      id: 2,
      order_no: "ORD1002",
      customer: "Manju",
      area: "VEL",
      order_date: "29-May-2026",
      delivery_date: "30-May-2026",
      verification_status: "PENDING",
    },

    {
      id: 3,
      order_no: "ORD1003",
      customer: "Suresh",
      area: "OMR",
      order_date: "29-May-2026",
      delivery_date: "30-May-2026",
      verification_status: "VERIFIED",
    },
  ];

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => [
      {
        accessorKey: "order_no",
        header: "Order No",

        cell: (info) => (
          <span className="font-semibold text-gray-800 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "customer",
        header: "Customer",
      },

      {
        accessorKey: "area",
        header: "Area",
      },

      {
        accessorKey: "order_date",
        header: "Order Date",
      },

      {
        accessorKey: "delivery_date",
        header: "Delivery Date",
      },

      {
        accessorKey: "verification_status",
        header: "Verification Status",

        cell: ({ row }) => {
          const status = row.original.verification_status;

          const styles = {
            PENDING: "bg-orange-100 text-orange-700",

            VERIFIED: "bg-green-100 text-green-700",
          };

          return (
            <span
              className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                whitespace-nowrap
                                ${styles[status]}
                            `}
            >
              {status}
            </span>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",

        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/verifydelivery/${row.original.id}`)}
            className="
                            text-blue-600
                            hover:underline
                            whitespace-nowrap
                            font-medium
                        "
          >
            Verify
          </button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Delivery Verification
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Verify actual delivered products
        </p>
      </div>

      {/* Summary Cards */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-white border border-gray-200 rounded-2xl p-5">

                    <p className="text-sm text-gray-500">
                        Pending Verification
                    </p>

                    <h3 className="text-3xl font-bold text-orange-600 mt-2">
                        12
                    </h3>

                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">

                    <p className="text-sm text-gray-500">
                        Verified Today
                    </p>

                    <h3 className="text-3xl font-bold text-green-600 mt-2">
                        8
                    </h3>

                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">

                    <p className="text-sm text-gray-500">
                        Partial Deliveries
                    </p>

                    <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                        2
                    </h3>

                </div>

            </div> */}

      {/* Main Section */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        {/* Filters */}

        <div className="mb-6">
          <FormGrid cols={5} gap={4}>
            <InputField
              name="customer"
              label="Customer"
              placeholder="Search customer"
              control={control}
            />

            {/* Order Date */}

            {/* <div>

                            <label className="block text-sm font-medium mb-2">
                                Order Date
                            </label>

                            <input
                                type="date"
                                className="
                                    w-full
                                    border border-gray-300
                                    rounded-xl
                                    px-4 py-2.5
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div> */}

            {/* Delivery Date */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Delivery Date
              </label>

              <input
                type="date"
                className="
                                    w-full
                                    border border-gray-300
                                    rounded-xl
                                    px-4 py-2.5
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
              />
            </div>

            {/* Status */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Verification Status
              </label>

              <select
                className="
                                    w-full
                                    border border-gray-300
                                    rounded-xl
                                    px-4 py-2.5
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
              >
                <option value="">All</option>

                <option value="PENDING">Pending</option>

                <option value="VERIFIED">Verified</option>
              </select>
            </div>

            {/* Search */}

            <div className="flex items-end">
              <button
                className="
                                    w-full
                                    bg-gray-900
                                    text-white
                                    rounded-xl
                                    px-4 py-2.5
                                    hover:bg-black
                                    transition
                                "
              >
                Search
              </button>
            </div>
          </FormGrid>
        </div>

        {/* Data Table */}

        <DataTable
          data={data}
          columns={columns}
          pageSize={10}
          emptyMessage="No delivery verifications found"
          globalSearch={false}
        />
      </div>
    </div>
  );
}
