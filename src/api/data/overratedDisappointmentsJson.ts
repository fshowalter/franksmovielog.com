import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const overratedDisappointmentsJsonFile = getContentPath(
  "data",
  "overrated-disappointments.json",
);

const OverratedDisappointmentsJsonSchema = z.object({
  genres: z.array(z.string()),
  grade: z.string(),
  gradeValue: z.number(),
  imdbId: z.string(),
  releaseSequence: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  year: z.string(),
});

export type OverratedDisappointmentsJson = z.infer<
  typeof OverratedDisappointmentsJsonSchema
>;

export async function allOverratedDisappointmentsJson(): Promise<
  OverratedDisappointmentsJson[]
> {
  const json = await fs.readFile(overratedDisappointmentsJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return OverratedDisappointmentsJsonSchema.parse(item);
  });
}
