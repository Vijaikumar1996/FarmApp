import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import SearchButton from "../../components/common/SearchButton";
import StatusFilter from "../../components/common/StatusFilter";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";
import Button from "../../components/ui/button/Button";

import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import UpdateProductPrice from "./UpdateProductPrice";
import ProductPriceHistory from "./ProductPriceHistory";

import { useProductCategories } from "../../queries/useProductCategory";
import { useProductSearch } from "../../queries/useProduct";

export default function Products() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      searchText: "",
      categoryId: "",
      isActive: "",
      pageNumber: 1,
      pageSize: 10,
    },
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isPriceDrawerOpen, setIsPriceDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchRequest, setSearchRequest] = useState({
    searchText: "",
    categoryId: null,
    isActive: null,
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useProductSearch(searchRequest);
  const { data: categoryData } = useProductCategories();

  const result = data?.data ?? data;
  const products = result?.items ?? [];

  const categoryOptions = categoryData?.data ?? categoryData ?? [];

  const onSearch = (values) => {
    setSearchRequest({
      searchText: values.searchText,
      categoryId: values.categoryId ? Number(values.categoryId) : null,
      isActive: values.isActive === "" ? null : values.isActive === "true",
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const pinnedColumns = useMemo(
    () => ({
      left: ["productCode"],
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "productCode",
        header: "Product Code",
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "productName",
        header: "Product Name",
      },
      {
        accessorKey: "categoryName",
        header: "Category",
      },
      {
        accessorKey: "currentPrice",
        header: "Price",
        cell: (info) =>
          info.getValue() != null ? `₹ ${info.getValue()}` : "-",
      },
      {
        accessorKey: "litresPerUnit",
        header: "Litres",
      },
      {
        accessorKey: "trackInventory",
        header: "Inventory",
        cell: ({ row }) => (row.original.trackInventory ? "Yes" : "No"),
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
          <div className="flex gap-4">
            <span
              className="cursor-pointer font-medium text-brand-600 hover:text-brand-700 hover:underline"
              onClick={() => {
                setSelectedProduct(row.original);
                setIsEdit(true);
                setIsDrawerOpen(true);
              }}
            >
              Edit
            </span>

            <span
              className="cursor-pointer font-medium text-green-600 hover:text-green-700 hover:underline"
              onClick={() => {
                setSelectedProduct(row.original);
                setIsPriceDrawerOpen(true);
              }}
            >
              Price
            </span>

            <span
              className="cursor-pointer font-medium text-purple-600 hover:text-purple-700 hover:underline"
              onClick={() => {
                setSelectedProduct(row.original);
                setIsHistoryDrawerOpen(true);
              }}
            >
              History
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>

          <p className="text-sm text-gray-500">Manage farm products</p>
        </div>

        <Button
          startIcon={<Plus size={18} />}
          onClick={() => {
            setSelectedProduct(null);
            setIsEdit(false);
            setIsDrawerOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="mb-5">
          <FormGrid cols={4} gap={4}>
            <InputField
              name="searchText"
              control={control}
              label="Search"
              placeholder="Product Code / Name"
            />

            <SelectField
              name="categoryId"
              control={control}
              label="Category"
              options={categoryOptions}
              placeholder="Select Category"
            />

            <StatusFilter control={control} />

            <div className="flex items-end">
              <SearchButton onClick={handleSubmit(onSearch)} />
            </div>
          </FormGrid>
        </div>

        <DataTable
          data={products}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          pinnedColumns={pinnedColumns}
          emptyMessage="No products found"
          globalSearch={false}
        />
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-1000 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
            {isEdit ? (
              <EditProduct
                product={selectedProduct}
                onClose={() => setIsDrawerOpen(false)}
              />
            ) : (
              <CreateProduct onClose={() => setIsDrawerOpen(false)} />
            )}
          </div>
        </div>
      )}

      {isPriceDrawerOpen && (
        <div className="fixed inset-0 z-1000 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-3xl overflow-y-auto bg-white shadow-2xl">
            <UpdateProductPrice
              product={selectedProduct}
              onClose={() => setIsPriceDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-1000 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-3xl overflow-y-auto bg-white shadow-2xl">
            <ProductPriceHistory
              product={selectedProduct}
              onClose={() => setIsHistoryDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
