import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const overratedJsonFile = getContentPath("data", "overrated.json");

const OverratedJsonSchema = z.object({
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

export type OverratedJson = z.infer<typeof OverratedJsonSchema>;

export async function allOverratedJson(): Promise<OverratedJson[]> {
  const json = await fs.readFile(overratedJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return OverratedJsonSchema.parse(item);
  });
}
