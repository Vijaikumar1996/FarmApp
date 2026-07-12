import { z } from "zod";

export const customerSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer Name is required.")
    .max(100, "Customer Name cannot exceed 100 characters."),

  mobileNo: z
    .string()
    .trim()
    .min(10, "Mobile Number must be 10 digits.")
    .max(10, "Mobile Number must be 10 digits.")
    .regex(/^[0-9]+$/, "Mobile Number must contain only digits."),

  alternateMobileNo: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^[0-9]{10}$/.test(value), {
      message: "Alternate Mobile Number must be 10 digits.",
    }),

  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email address.",
    }),

  areaId: z.coerce
    .number({
      required_error: "Area is required.",
    })
    .min(1, "Area is required."),

  deliveryLocationId: z.coerce
    .number({
      required_error: "Delivery Location is required.",
    })
    .min(1, "Delivery Location is required."),

  houseDoorNo: z
    .string()
    .trim()
    .min(1, "House / Door No is required.")
    .max(50, "Maximum 50 characters allowed."),

  landmark: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length <= 100, {
      message: "Maximum 100 characters allowed.",
    }),

  remarks: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length <= 500, {
      message: "Maximum 500 characters allowed.",
    }),

  deliveryNotes: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length <= 500, {
      message: "Maximum 500 characters allowed.",
    }),

  isActive: z.enum(["true", "false"]).optional(),
});
