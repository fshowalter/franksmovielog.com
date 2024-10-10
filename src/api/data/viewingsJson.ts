import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const viewingsJsonFile = getContentPath("data", "viewings.json");

const ViewingJsonSchema = z.object({
  genres: z.array(z.string()),
  medium: z.nullable(z.string()),
  releaseSequence: z.string(),
  sequence: z.number(),
  slug: z.nullable(z.string()),
  sortTitle: z.string(),
  title: z.string(),
  venue: z.nullable(z.string()),
  viewingDate: z.string(),
  viewingYear: z.string(),
  year: z.string(),
});

export type ViewingJson = z.infer<typeof ViewingJsonSchema>;

export async function allViewingsJson(): Promise<ViewingJson[]> {
  const json = await fs.readFile(viewingsJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ViewingJsonSchema.parse(item);
  });
}
