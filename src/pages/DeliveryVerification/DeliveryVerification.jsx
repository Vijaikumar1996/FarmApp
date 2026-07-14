import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import InputField from "../../components/form/form-input/InputField";
import FormGrid from "../../components/form/FormGrid";
import { useDeliveryVerification, useMarkAllDelivered } from "../../queries/useDeliveryVerification";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";
import { loadCustomerOptions } from "../../utils/customerLoader";
import DateField from "../../components/form/form-input/DateField";
import { getTodayDate } from "../../utils/commonUtils";
import SelectField from "../../components/form/form-input/SelectField";



export default function DeliveryVerification() {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const todayDate = getTodayDate();




  const {
    control,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      customerId: "",
      deliveryDate: todayDate,
      status: "",
    },
  });
  const selectedDeliveryDate = watch("deliveryDate");
  const [searchRequest, setSearchRequest] =
    useState({
      customerId: "",
      deliveryDate: todayDate,
      status: "",
      pageNumber: 1,
      pageSize: 10,
    });

  const statusOptions = [
    { id: "PENDING", name: "Pending" },
    { id: "DELIVERED", name: "Delivered" },
    { id: "PARTIAL_DELIVERED", name: "Partial Delivered" },
  ];

  /*------------------------------------------
      Queries
  ------------------------------------------*/

  const {
    data,
    isLoading,
    refetch,
  } = useDeliveryVerification(searchRequest);


  const canMarkAllDelivered =
    selectedDeliveryDate === todayDate &&
    (data?.items?.length ?? 0) > 0;

  const markAllDeliveredMutation =
    useMarkAllDelivered();

  /*------------------------------------------
      Search
  ------------------------------------------*/

  const onSearch = (values) => {
    console.log("Search values:", values);
    setSearchRequest({
      customerId: values.customerId ? Number(values.customerId) : null,
      deliveryDate: values.deliveryDate,
      status: values.status,
      pageNumber: 1,
      pageSize: 10,
    });
  };

  /*------------------------------------------
      Mark All Delivered
  ------------------------------------------*/

  const handleMarkAllDelivered = async () => {
    try {
      await markAllDeliveredMutation.mutateAsync({
        deliveryDate: searchRequest.deliveryDate,
      });
      setShowConfirm(false);
      refetch();
    } catch {
      // handle error
    }
  };

  /*------------------------------------------
      Columns
  ------------------------------------------*/

  const columns = useMemo(() => [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: (info) => (
        <span className="font-medium">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "area",
      header: "Area",
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
    },
    {
      accessorKey: "plannedItems",
      header: "Ordered Items",
      cell: ({ row }) => (
        <div className="whitespace-normal text-sm">
          {row.original.plannedItems}
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const styles = {
          PENDING: "bg-orange-100 text-orange-700",
          DELIVERED: "bg-green-100 text-green-700",
          PARTIAL_DELIVERED: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}
          >
            {status.replaceAll("_", " ")}
          </span>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={() =>
            navigate(
              `/verifydelivery/${row.original.customerId}/${row.original.deliveryDate}`
            )
          }
          className="text-blue-600 hover:underline font-medium"
        >
          Verify
        </button>
      ),
    },

  ], [navigate]);
  return (
    <>
      <div className="space-y-6">

        {/* Header */}

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Delivery Verification
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Verify delivered products
          </p>
        </div>

        {/* Search Card */}

        <div className="bg-white rounded-2xl border border-gray-200 p-6">

          <form onSubmit={handleSubmit(onSearch)}>

            <FormGrid cols={5} gap={4}>

              <AsyncTypeahead
                name="customerId"
                control={control}
                label="Customer"
                required
                loadOptions={loadCustomerOptions}
              />

              <DateField
                control={control}
                name="deliveryDate"
                label="Delivery Date"
              />
              <SelectField
                name="status"
                control={control}
                label="Status"
                options={statusOptions}
              />

              <div className="col-span-2 flex items-end gap-3">

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black"
                >
                  Search
                </button>
                {
                  canMarkAllDelivered && (
                    <button
                      type="button"
                      onClick={() => setShowConfirm(true)}
                      className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 whitespace-nowrap"
                    >
                      Mark All Delivered
                    </button>

                  )
                }

              </div>

            </FormGrid>

          </form>

        </div>

        {/* Grid */}

        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <DataTable
            data={data?.items ?? []}
            columns={columns}
            loading={isLoading}
            pageSize={10}
            totalRecords={data?.totalRecords}
            currentPage={searchRequest.pageNumber}
            globalSearch={false}
            emptyMessage="No delivery verification records found."

            onPageChange={(page) =>
              setSearchRequest((prev) => ({
                ...prev,
                pageNumber: page,
              }))
            }

          />

        </div>

      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-1000">
          <div className="bg-white rounded-2xl shadow-xl w-[430px] p-6">
            <h2 className="text-xl font-semibold text-gray-800">Mark All Delivered</h2>
            <p className="mt-4 text-gray-600">
              This action will mark all pending deliveries as
              <strong> Delivered</strong>.
            </p>
            <p className="mt-2 text-gray-600">
              Delivered Quantity will be updated with Ordered Quantity.
            </p>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAllDelivered}
                disabled={markAllDeliveredMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {markAllDeliveredMutation.isPending ? "Processing..." : "Mark All"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>

  );

}