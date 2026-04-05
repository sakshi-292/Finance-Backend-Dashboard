import { z } from "zod";

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type DateRangeFilter = z.infer<typeof dateRangeSchema>;
