import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const underseenJsonFile = getContentPath("data", "underseen.json");

const UnderseenJsonSchema = z.object({
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

export type UnderseenJson = z.infer<typeof UnderseenJsonSchema>;

export async function allUnderseenJson(): Promise<UnderseenJson[]> {
  const json = await fs.readFile(underseenJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return UnderseenJsonSchema.parse(item);
  });
}
