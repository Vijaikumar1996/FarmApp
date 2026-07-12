import { z } from "zod";

export const customerRequestSchema = z
  .object({

    requestAction: z.string().min(1, "Request Action is required"),

    productId: z.string().optional(),

    quantity: z.coerce.number().nullable().optional(),

    effectiveFrom: z.string().min(1, "Effective From Date is required"),

    effectiveTo: z.string().nullable().optional(),

    remarks: z
      .string()
      .max(500, "Remarks cannot exceed 500 characters")
      .optional(),

    status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const action = data.requestAction?.toUpperCase();

    if (action === "ADD") {
      if (!data.productId) {
        ctx.addIssue({
          code: "custom",
          path: ["productId"],
          message: "Product is required.",
        });
      }

      if (!data.quantity || data.quantity <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Quantity should be greater than zero.",
        });
      }
    }

    if (action === "REPLACE") {
      if (!data.productId) {
        ctx.addIssue({
          code: "custom",
          path: ["productId"],
          message: "Modified Product is required.",
        });
      }
    }

    if (
      data.effectiveTo &&
      data.effectiveFrom &&
      data.effectiveTo < data.effectiveFrom
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["effectiveTo"],
        message:
          "Effective To Date should be greater than or equal to Effective From Date.",
      });
    }
  });
