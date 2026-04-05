import { z } from "zod";

export const createRecordSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").max(9999999999.99, "Amount exceeds maximum allowed value"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().trim().min(1, "Category is required").max(50),
  date: z.coerce.date({ message: "A valid date is required" }),
  notes: z.string().trim().max(500).optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").max(9999999999.99, "Amount exceeds maximum allowed value").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().trim().min(1, "Category cannot be empty").max(50).optional(),
  date: z.coerce.date({ message: "A valid date is required" }).optional(),
  notes: z.string().trim().max(500).nullable().optional(),
});

export const recordIdParamSchema = z.object({
  id: z.string().uuid("Invalid record ID"),
});

export const recordFilterSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().trim().max(50).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().max(100).optional().transform((val) => val || undefined),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordFilter = z.infer<typeof recordFilterSchema>;
