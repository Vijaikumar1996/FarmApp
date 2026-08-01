import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import SearchButton from "../../components/common/SearchButton";
import StatusFilter from "../../components/common/StatusFilter";

import FormGrid from "../../components/form/FormGrid";
import Button from "../../components/ui/button/Button";
import SelectField from "../../components/form/form-input/SelectField";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";

import { useCustomerRequests } from "../../queries/useCustomerRequest";

import { loadCustomerOptions } from "../../utils/customerLoader";
import ProductDropdown from "../../components/form/custom-input/ProductDropdown";
import DateField from "../../components/form/form-input/DateField";
import { getTomorrowDate, isFutureDate } from "../../utils/commonUtils";

export default function CustomerRequests() {
  const navigate = useNavigate();

  const tomorrowDate = getTomorrowDate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      customerId: "",
      productId: "",
      requestAction: "",
      status: "",
      requestDate: tomorrowDate,
      pageNumber: 1,
      pageSize: 10,
    },
  });

  const [searchRequest, setSearchRequest] = useState({
    customerId: null,
    productId: null,
    requestAction: null,
    status: "",
    requestDate: tomorrowDate,
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useCustomerRequests(searchRequest);

  const result = data?.data ?? data;

  const requests = result?.items ?? [];

  const requestActions = [
    {
      id: "ADD",
      name: "Add",
    },
    {
      id: "REPLACE",
      name: "Replace",
    },
    {
      id: "PAUSE",
      name: "Pause",
    },
  ];

  const statusOptions = [
    {
      id: "",
      name: "All",
    },
    {
      id: "PENDING",
      name: "Pending",
    },
    {
      id: "INPROGRESS",
      name: "In Progress",
    },
    {
      id: "PROCESSED",
      name: "Processed",
    },
    {
      id: "CANCELLED",
      name: "Cancelled",
    },
  ];


  const onSearch = (values) => {
    setSearchRequest({
      customerId: values.customerId
        ? Number(values.customerId)
        : null,

      productId: values.productId
        ? Number(values.productId)
        : null,

      requestAction: values.requestAction || null,

      status: values.status || null,

      requestDate: values.requestDate || null,

      pageNumber: 1,
      pageSize: 10,
    });
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
      },
      {
        accessorKey: "requestDescription",
        header: "Description",
      },
      {
        accessorKey: "effectiveFrom",
        header: "From Date",
      },
      {
        accessorKey: "effectiveTo",
        header: "To Date",
        cell: ({ row }) => row.original.effectiveTo ?? "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          console.log("status", row.original);
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : status === "PROCESSED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {status}
            </span>
          );
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const { id, canEdit } = row.original;

          return (
            <span
              className="cursor-pointer font-medium text-brand-600 hover:text-brand-700 hover:underline"
              onClick={() =>
                navigate(
                  canEdit
                    ? `/customer-requests/edit/${id}?deliveryDate=${searchRequest.requestDate}`
                    : `/customer-requests/view/${id}?deliveryDate=${searchRequest.requestDate}`
                )
              }
            >
              {canEdit ? "Edit" : "View"}
            </span>
          );
        },
      }
    ],
    [navigate, searchRequest.requestDate],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customer Requests</h1>

          <p className="text-sm text-gray-500">Manage customer requests</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/customer-requests/create")}
        >
          Add Request
        </Button>
      </div>

      <div className="bg-white p-5 rounded-2xl border">
        <div className="mb-5">
          <FormGrid cols={4} gap={4}>
            <DateField
              name="requestDate"
              control={control}
              label="Delivery Date"
            />

            <AsyncTypeahead
              name="customerId"
              control={control}
              label="Customer"
              loadOptions={loadCustomerOptions}
            />

            <ProductDropdown
              name="productId"
              control={control}
              label="Products"
            />

            <SelectField
              control={control}
              name="requestAction"
              label="Request Action"
              options={requestActions}
            />

            <SelectField
              name="status"
              control={control}
              label="Status"
              options={statusOptions}
            />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={requests}
          columns={columns}
          loading={isLoading}
          pageSize={10}   
          emptyMessage="No customer requests found"
        />
      </div>
    </div>
  );
}
