import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import SearchButton from "../../components/common/SearchButton";
import StatusFilter from "../../components/common/StatusFilter";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";

import Button from "../../components/ui/button/Button";

import CreateCustomer from "./CreateCustomer";
import EditCustomer from "./EditCustomer";

import { useAreas } from "../../queries/useArea";
import { useCustomers } from "../../queries/useCustomer";
import { useDeliveryLocations } from "../../queries/useDeliveryLocation";
import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";
import { loadCustomerOptions } from "../../utils/customerLoader";

export default function Customers() {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      customerCode: "",
      customerName: "",
      mobileNo: "",
      areaId: "",
      deliveryLocationId: "",
      isActive: "",
    },
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const { data, isLoading } = useCustomers();
  const { data: areaData } = useAreas();
  const { data: locationData } = useDeliveryLocations();

  const customers = data?.data ?? data ?? [];
  const areas = areaData?.data ?? areaData ?? [];
  const deliveryLocations = locationData?.data ?? locationData ?? [];

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const selectedAreaId = watch("areaId");

  useEffect(() => {
    setValue("deliveryLocationId", "");
  }, [selectedAreaId, setValue]);

  const areaOptions = useMemo(
    () =>
      areas.map((x) => ({
        id: x.id,
        name: `${x.areaCode} - ${x.areaName}`,
      })),
    [areas],
  );

  const deliveryLocationOptions = useMemo(
    () =>
      deliveryLocations
        .filter((x) => !selectedAreaId || x.areaId === Number(selectedAreaId))
        .map((x) => ({
          id: x.id,
          name: x.locationName,
        })),
    [deliveryLocations, selectedAreaId],
  );

  const onSearch = (values) => {
    const result = customers.filter((x) => {
      const customerCodeMatch =
        !values.customerCode ||
        x.customerCode
          .toLowerCase()
          .includes(values.customerCode.toLowerCase());

      const customerNameMatch =
        !values.customerName ||
        x.customerName
          .toLowerCase()
          .includes(values.customerName.toLowerCase());

      const mobileMatch =
        !values.mobileNo || x.mobileNo.includes(values.mobileNo);

      const areaMatch = !values.areaId || x.areaId === Number(values.areaId);

      const locationMatch =
        !values.deliveryLocationId ||
        x.deliveryLocationId === Number(values.deliveryLocationId);

      const statusMatch =
        values.isActive === "" || x.isActive === (values.isActive === "true");

      return (
        customerCodeMatch &&
        customerNameMatch &&
        mobileMatch &&
        areaMatch &&
        locationMatch &&
        statusMatch
      );
    });

    setFilteredCustomers(result);
  };

  const pinnedColumns = useMemo(
    () => ({
      left: ["customerCode"],
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "customerCode",
        header: "Customer Code",
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
      },
      {
        accessorKey: "mobileNo",
        header: "Mobile",
      },
      {
        accessorKey: "areaName",
        header: "Area",
      },
      {
        accessorKey: "deliveryLocationName",
        header: "Delivery Location",
        cell: (info) => info.getValue() ?? "-",
      },
      {
        accessorKey: "houseDoorNo",
        header: "House / Door No",
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
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString()
            : "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <span
            className="cursor-pointer font-medium text-brand-600 hover:text-brand-700 hover:underline"
            onClick={() => {
              setSelectedCustomer(row.original);
              setIsEdit(true);
              setIsDrawerOpen(true);
            }}
          >
            Edit
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-sm text-gray-500">Manage farm customers</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedCustomer(null);
            setIsEdit(false);
            setIsDrawerOpen(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <div className="mb-5">
          <FormGrid cols={4} gap={2}>
            {/* <InputField
                            name="customerCode"
                            control={control}
                            label="Customer Code"
                            placeholder="Search Customer Code"
                        />

                        <InputField
                            name="customerName"
                            control={control}
                            label="Customer Name"
                            placeholder="Search Customer Name"
                        /> */}
            <SelectField
              name="areaId"
              control={control}
              label="Area"
              options={areaOptions}
              placeholder="Select Area"
            />

            <SelectField
              name="deliveryLocationId"
              control={control}
              label="Delivery Location"
              options={deliveryLocationOptions}
              placeholder="Select Location"
            />

            {/* <AsyncTypeahead
                            name="customerId"
                            control={control}
                            label="Customer"
                            required
                            loadOptions={loadCustomerOptions}
                        /> */}

            {/* <InputField
                            name="mobileNo"
                            control={control}
                            label="Mobile Number"
                            placeholder="Search Mobile Number"
                        /> */}

            <StatusFilter control={control} />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={filteredCustomers}
          columns={columns}
          pageSize={10}
          pinnedColumns={pinnedColumns}
          loading={isLoading}
          emptyMessage="No customers found"
          globalSearch={false}
        />
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-1000 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
            {isEdit ? (
              <EditCustomer
                customer={selectedCustomer}
                onClose={() => setIsDrawerOpen(false)}
              />
            ) : (
              <CreateCustomer onClose={() => setIsDrawerOpen(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
