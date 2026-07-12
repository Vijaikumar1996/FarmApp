import { useMemo } from "react";
import { useForm } from "react-hook-form";

import DataTable from "../../components/common/DataTable";
import InputField from "../../components/form/form-input/InputField";
import FormGrid from "../../components/form/FormGrid";

/* ---------------- Component ---------------- */

export default function MISReport() {
  const { control } = useForm();

  /* ---------------- Dummy Data ---------------- */

  const reports = [
    {
      saleOrder: "350736762",
      shipmentDate: "27-Nov-2024",
      vehicleNumber: "TN01AB1234",
      destination: "New Delhi",
      expectedPackages: 160,
      scannedPackages: 145,
      pendingPackages: 15,
      status: "IN_TRANSIT",
      uploadedBy: "Ravi",
      createdAt: "11:20 AM",
    },

    {
      saleOrder: "350736763",
      shipmentDate: "28-Nov-2024",
      vehicleNumber: "TN09XY5521",
      destination: "Bangalore",
      expectedPackages: 85,
      scannedPackages: 85,
      pendingPackages: 0,
      status: "DELIVERED",
      uploadedBy: "Kumar",
      createdAt: "09:45 AM",
    },

    {
      saleOrder: "350736764",
      shipmentDate: "29-Nov-2024",
      vehicleNumber: "TN11AZ9912",
      destination: "Hyderabad",
      expectedPackages: 120,
      scannedPackages: 102,
      pendingPackages: 18,
      status: "OUT_FOR_DELIVERY",
      uploadedBy: "Arun",
      createdAt: "10:10 AM",
    },

    {
      saleOrder: "350736765",
      shipmentDate: "30-Nov-2024",
      vehicleNumber: "TN22BB7788",
      destination: "Mumbai",
      expectedPackages: 55,
      scannedPackages: 12,
      pendingPackages: 43,
      status: "PENDING_HUB_RECEIVE",
      uploadedBy: "Vijay",
      createdAt: "08:25 AM",
    },
  ];

  /* ---------------- Pinned Columns ---------------- */

  const pinnedColumns = useMemo(
    () => ({
      left: ["saleOrder"],
    }),
    [],
  );

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => [
      {
        accessorKey: "saleOrder",
        header: "Sales Order",
        cell: (info) => (
          <span className="font-semibold text-gray-800 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "shipmentDate",
        header: "Shipment Date",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "vehicleNumber",
        header: "Vehicle No",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "destination",
        header: "Destination",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "expectedPackages",
        header: "Expected",
        cell: (info) => (
          <span className="font-medium whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "scannedPackages",
        header: "Scanned",
        cell: (info) => (
          <span className="font-medium text-green-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "pendingPackages",
        header: "Pending",
        cell: (info) => (
          <span className="font-medium text-orange-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          const styles = {
            PENDING_HUB_RECEIVE: "bg-orange-100 text-orange-700",

            IN_TRANSIT: "bg-blue-100 text-blue-700",

            OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-700",

            DELIVERED: "bg-green-100 text-green-700",
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
              {status.replaceAll("_", " ")}
            </span>
          );
        },
      },

      {
        accessorKey: "uploadedBy",
        header: "Uploaded By",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => (
          <span className="text-gray-600 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">MIS Report</h1>

          <p className="text-sm text-gray-500 mt-1">
            Shipment management information system report
          </p>
        </div>

        <button
          className="
                        px-5
                        py-2.5
                        bg-green-600
                        text-white
                        rounded-xl
                        hover:bg-green-700
                        transition
                    "
        >
          Export Excel
        </button>
      </div>

      {/* Main Section */}

      <div className="bg-white p-5 rounded-2xl border border-gray-200">
        {/* Filters */}

        <div className="mb-5">
          <FormGrid cols={4}>
            <InputField
              name="sales_order"
              label="Sales Order"
              placeholder="Search sales order"
              control={control}
            />

            <InputField
              name="vehicle_number"
              label="Vehicle Number"
              placeholder="Search vehicle number"
              control={control}
            />

            <InputField
              name="from_date"
              label="From Date"
              type="date"
              control={control}
            />

            <InputField
              name="to_date"
              label="To Date"
              type="date"
              control={control}
            />
          </FormGrid>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>

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
                <option value="">All Status</option>

                <option value="PENDING_HUB_RECEIVE">Pending Hub Receive</option>

                <option value="IN_TRANSIT">In Transit</option>

                <option value="OUT_FOR_DELIVERY">Out For Delivery</option>

                <option value="DELIVERED">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Destination
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
                <option value="">All Destinations</option>

                <option value="NEW_DELHI">New Delhi</option>

                <option value="BANGALORE">Bangalore</option>

                <option value="HYDERABAD">Hyderabad</option>
              </select>
            </div>

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
          </div>
        </div>

        {/* Data Table */}

        <div className="overflow-x-auto">
          <DataTable
            data={reports}
            columns={columns}
            pageSize={10}
            pinnedColumns={pinnedColumns}
            emptyMessage="No MIS reports found"
            globalSearch={false}
          />
        </div>
      </div>
    </div>
  );
}
