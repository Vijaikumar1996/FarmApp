import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Pencil } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";
import Button from "../../components/ui/button/Button";

import { useProductCategories } from "../../queries/useProductCategory";
import StatusDropdown from "../../components/form/custom-input/StatusDropdown";

export default function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  isEdit = false,
}) {
  const productSchema = z
    .object({
      productCode: z
        .string()
        .trim()
        .min(1, "Product Code is required.")
        .max(20, "Maximum 20 characters allowed."),

      productName: z
        .string()
        .trim()
        .min(1, "Product Name is required.")
        .max(100, "Maximum 100 characters allowed."),

      categoryId: z.coerce
        .number({
          required_error: "Category is required.",
        })
        .min(1, "Category is required."),

      sellingPrice: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z
          .number()
          .positive("Selling Price must be greater than zero.")
          .optional(),
      ),

      litresPerUnit: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z
          .number()
          .positive("Litres Per Unit must be greater than zero.")
          .optional(),
      ),

      displayOrder: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number().min(0, "Display Order cannot be negative.").optional(),
      ),

      isActive: z.enum(["true", "false"]).optional(),

      isMilkProduct: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isEdit && data.sellingPrice === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sellingPrice"],
          message: "Selling Price is required.",
        });
      }

      if (data.isMilkProduct && data.litresPerUnit === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["litresPerUnit"],
          message: "Litres Per Unit is required.",
        });
      }
    });

  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { data: categoryData } = useProductCategories();

  const categoryOptions = categoryData?.data ?? categoryData ?? [];

  const selectedCategoryId = watch("categoryId");
  console.log("ProductForm selectedCategoryId:", selectedCategoryId);
  const selectedCategory = categoryOptions.find(
    (x) => x.id === Number(selectedCategoryId),
  );

  const isMilkCategory = selectedCategory?.name?.toLowerCase() === "milk";

  useEffect(() => {
    setValue("isMilkProduct", !!isMilkCategory);
  }, [isMilkCategory, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={2} gap={5}>
        <InputField
          name="productCode"
          control={control}
          label="Product Code"
          placeholder="Enter Product Code"
          required
        />

        <InputField
          name="productName"
          control={control}
          label="Product Name"
          placeholder="Enter Product Name"
          required
        />

        <SelectField
          name="categoryId"
          control={control}
          label="Category"
          options={categoryOptions}
          placeholder="Select Category"
          required
          error={errors.categoryId}
        />

        {!isEdit && (
          <InputField
            name="sellingPrice"
            control={control}
            label="Selling Price"
            type="number"
            placeholder="Enter Selling Price"
            required
          />
        )}

        {isMilkCategory && (
          <InputField
            name="litresPerUnit"
            control={control}
            label="Litres Per Unit"
            type="number"
            placeholder="Enter Litres Per Unit"
            required
          />
        )}

        {/* Uncomment if you need it later */}
        {/*
                <InputField
                    name="displayOrder"
                    control={control}
                    label="Display Order"
                    type="number"
                    placeholder="Enter Display Order"
                />
                */}

        {isEdit && <StatusDropdown control={control} />}
      </FormGrid>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          startIcon={<X size={18} />}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          startIcon={isEdit ? <Pencil size={18} /> : <Save size={18} />}
        >
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
