import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import DataTable from "../../components/common/DataTable";
import SearchButton from "../../components/common/SearchButton";
import StatusFilter from "../../components/common/StatusFilter";

import FormGrid from "../../components/form/FormGrid";
import Button from "../../components/ui/button/Button";

import { useCustomers } from "../../queries/useCustomer";
import { useProductDropdown } from "../../queries/useProduct";
import { useCustomerSubscriptions } from "../../queries/useCustomerSubscription";

import ProductDropdown from "../../components/form/custom-input/ProductDropdown";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";

import { loadCustomerOptions } from "../../utils/customerLoader";

export default function CustomerSubscriptions() {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      customerId: "",
      productId: "",
      isActive: "",
      pageNumber: 1,
      pageSize: 10,
    },
  });

  const [searchRequest, setSearchRequest] = useState({
    customerId: null,
    productId: null,
    isActive: null,
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useCustomerSubscriptions(searchRequest);
  const { data: customerData } = useCustomers();
  const { data: productData } = useProductDropdown();

  const result = data?.data ?? data;
  const subscriptions = result?.items ?? [];

  const customerOptions = (customerData?.data ?? customerData ?? []).map(
    (customer) => ({
      id: customer.id,
      name: `${customer.customerName} - ${customer.mobileNo} - ${customer.deliveryLocationName} - ${customer.houseDoorNo}`,
    }),
  );

  const onSearch = (values) => {
    setSearchRequest({
      customerId: values.customerId ? Number(values.customerId) : null,
      productId: values.productId ? Number(values.productId) : null,
      isActive: values.isActive === "" ? null : values.isActive === "true",
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
        accessorKey: "productName",
        header: "Product",
      },
      {
        accessorKey: "frequencyName",
        header: "Frequency",
      },
      {
        accessorKey: "scheduleSummary",
        header: "Schedule",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.isActive;

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {active ? "ACTIVE" : "INACTIVE"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <span
            className="cursor-pointer font-medium text-brand-600 hover:text-brand-700 hover:underline"
            onClick={() => navigate(`/subscriptions/edit/${row.original.id}`)}
          >
            Edit
          </span>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customer Subscriptions</h1>

          <p className="text-sm text-gray-500">Manage customer subscriptions</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/subscriptions/create")}
        >
          Add Subscription
        </Button>
      </div>

      <div className="bg-white p-5 rounded-2xl border">
        <div className="mb-5">
          <FormGrid cols={4} gap={4}>
            <AsyncTypeahead
              name="customerId"
              control={control}
              label="Customer"
              required
              loadOptions={loadCustomerOptions}
            />

            <ProductDropdown
              control={control}
              name="productId"
              label="Product"
              placeholder="Select Product"
            />

            <StatusFilter control={control} />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={subscriptions}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          globalSearch={false}
          emptyMessage="No subscriptions found"
        />
      </div>
    </div>
  );
}
