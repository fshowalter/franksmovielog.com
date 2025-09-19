import { z } from "zod";

/**
 * Zod schema for distribution data.
 */
export const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});
