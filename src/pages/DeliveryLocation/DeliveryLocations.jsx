import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import SearchButton from "../../components/common/SearchButton";
import StatusFilter from "../../components/common/StatusFilter";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";

import Button from "../../components/ui/button/Button";

import CreateDeliveryLocation from "./CreateDeliveryLocation";
import EditDeliveryLocation from "./EditDeliveryLocation";

import { useAreas } from "../../queries/useArea";
import { useDeliveryLocations } from "../../queries/useDeliveryLocation";

export default function DeliveryLocations() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      areaId: "",
      locationName: "",
      isActive: "",
    },
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] =
    useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading } = useDeliveryLocations();
  const { data: areaData } = useAreas();

  const deliveryLocations = data?.data ?? data ?? [];
  const areas = areaData?.data ?? areaData ?? [];

  const areaOptions = areas.map((x) => ({
    id: x.id,
    name: x.areaName,
  }));

  useEffect(() => {
    setFilteredData(deliveryLocations);
  }, [deliveryLocations]);

  const onSearch = (values) => {
    const result = deliveryLocations.filter((x) => {
      const areaMatch = !values.areaId || x.areaId === Number(values.areaId);

      const locationMatch =
        !values.locationName ||
        x.locationName
          .toLowerCase()
          .includes(values.locationName.toLowerCase());

      const statusMatch =
        values.isActive === "" || x.isActive === (values.isActive === "true");

      return areaMatch && locationMatch && statusMatch;
    });

    setFilteredData(result);
  };

  const pinnedColumns = useMemo(
    () => ({
      left: ["areaName"],
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "areaName",
        header: "Area",
      },
      {
        accessorKey: "locationName",
        header: "Location",
      },
      {
        accessorKey: "deliveryOrder",
        header: "Order",
      },
      {
        accessorKey: "address",
        header: "Address",
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
            className="text-brand-600 hover:text-brand-700 hover:underline cursor-pointer font-medium"
            onClick={() => {
              setSelectedDeliveryLocation(row.original);
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
          <h1 className="text-2xl font-semibold">Delivery Locations</h1>

          <p className="text-sm text-gray-500">Manage delivery locations</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedDeliveryLocation(null);
            setIsEdit(false);
            setIsDrawerOpen(true);
          }}
        >
          Add Delivery Location
        </Button>
      </div>

      <div className="bg-white p-5 rounded-2xl border">
        <div className="mb-5">
          <FormGrid cols={4} gap={4}>
            <SelectField
              name="areaId"
              control={control}
              label="Area"
              options={areaOptions}
              placeholder="Select Area"
            />

            <InputField
              name="locationName"
              control={control}
              label="Location"
              placeholder="Search Location"
            />

            <StatusFilter control={control} />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={filteredData}
          columns={columns}
          pageSize={10}
          pinnedColumns={pinnedColumns}
          loading={isLoading}
          emptyMessage="No delivery locations found"
          globalSearch={false}
        />
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-1000 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full overflow-y-auto shadow-2xl">
            {isEdit ? (
              <EditDeliveryLocation
                deliveryLocation={selectedDeliveryLocation}
                onClose={() => setIsDrawerOpen(false)}
              />
            ) : (
              <CreateDeliveryLocation onClose={() => setIsDrawerOpen(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
