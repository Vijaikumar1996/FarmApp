import { z } from "zod";

export const customerSubscriptionSchema = z
  .object({
    customerId: z.coerce
      .number({
        required_error: "Customer is required.",
        invalid_type_error: "Customer is required.",
      })
      .min(1, "Customer is required."),

    productId: z.coerce
      .number({
        required_error: "Product is required.",
        invalid_type_error: "Product is required.",
      })
      .min(1, "Product is required."),

    frequencyId: z.coerce
      .number({
        required_error: "Frequency is required.",
        invalid_type_error: "Frequency is required.",
      })
      .min(1, "Frequency is required."),

    startDate: z.string().min(1, "Start Date is required."),

    endDate: z.preprocess(
      (value) => (value === "" ? null : value),
      z.string().nullable().optional(),
    ),

    intervalDays: z.preprocess(
      (value) => (value === "" || value == null ? undefined : value),
      z.coerce
        .number()
        .positive("Interval Days must be greater than zero.")
        .optional(),
    ),

    isActive: z.enum(["true", "false"]).optional(),

    schedules: z
      .array(
        z.object({
          dayOfWeek: z.coerce.number().nullable().optional(),

          dayOfMonth: z.coerce.number().nullable().optional(),

          patternOrder: z.coerce.number().nullable().optional(),

          quantity: z.coerce
            .number({
              required_error: "Quantity is required.",
            })
            .positive("Quantity must be greater than zero."),
        }),
      )
      .min(1, "At least one schedule is required."),
  })
  .superRefine((data, ctx) => {
    // Interval frequency
    if (data.frequencyId === 4) {
      if (!data.intervalDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["intervalDays"],
          message: "Interval Days is required.",
        });
      }
    }
  });