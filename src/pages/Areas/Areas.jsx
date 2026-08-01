// Areas.jsx
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import DataTable from "../../components/common/DataTable";
import InputField from "../../components/form/form-input/InputField";
import FormGrid from "../../components/form/FormGrid";
import StatusFilter from "../../components/common/StatusFilter";
import SearchButton from "../../components/common/SearchButton";

import CreateArea from "./CreateArea";
import EditArea from "./EditArea";
import { useAreas } from "../../queries/useArea";
import Button from "../../components/ui/button/Button";
import { FilePlus, Plus } from "lucide-react";
import CommonDrawer from "../../components/common/CommonDrawer";

export default function Areas() {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      areaCode: "",
      areaName: "",
      isActive: "",
    },
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredAreas, setFilteredAreas] = useState([]);

  const { data, isLoading } = useAreas();

  const areas = data?.data ?? data ?? [];

  useEffect(() => {
    setFilteredAreas(areas);
  }, [areas]);

  const onSearch = (values) => {
    const result = areas.filter((area) => {
      const codeMatch =
        !values.areaCode ||
        area.areaCode?.toLowerCase().includes(values.areaCode.toLowerCase());

      const nameMatch =
        !values.areaName ||
        area.areaName?.toLowerCase().includes(values.areaName.toLowerCase());

      const statusMatch =
        values.isActive === "" ||
        values.isActive === undefined ||
        area.isActive === (values.isActive === "true");

      return codeMatch && nameMatch && statusMatch;
    });

    setFilteredAreas(result);
  };

  const pinnedColumns = useMemo(
    () => ({
      left: ["areaCode"],
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "areaCode",
        header: "Area Code",
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "areaName",
        header: "Area Name",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.isActive;

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${active
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
        cell: (info) => (
          <span>
            {info.getValue()
              ? new Date(info.getValue()).toLocaleDateString()
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="text-brand-600 hover:text-brand-700 hover:underline cursor-pointer font-medium"
            onClick={() => {
              setSelectedArea(row.original);
              setIsEdit(true);
              setIsDrawerOpen(true);
            }}
          >
            Edit
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Areas</h1>
          <p className="text-sm text-gray-500">Manage delivery areas</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedArea(null);
            setIsEdit(false);
            setIsDrawerOpen(true);
          }}
        >
          Add Area
        </Button>
      </div>

      <div className="bg-white p-5 rounded-2xl border">
        <div className="mb-5">
          <FormGrid cols={4} gap={4}>
            <InputField
              name="areaCode"
              label="Area Code"
              placeholder="Search Area Code"
              control={control}
            />

            <InputField
              name="areaName"
              label="Area Name"
              placeholder="Search Area Name"
              control={control}
            />

            <StatusFilter control={control} />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={filteredAreas}
          columns={columns}
          pageSize={10}
          pinnedColumns={pinnedColumns}
          loading={isLoading}
          emptyMessage="No areas found"      
        />
      </div>

      <CommonDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >

        {isEdit ? (

          <EditArea
            area={selectedArea}
            onClose={() => setIsDrawerOpen(false)}
          />

        ) : (

          <CreateArea
            onClose={() => setIsDrawerOpen(false)}
          />

        )}

      </CommonDrawer>
    </div>
  );
}
