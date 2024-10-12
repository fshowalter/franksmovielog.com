import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

const viewingsJsonFile = getContentPath("data", "viewings.json");

const ViewingJsonSchema = z
  .object({
    genres: z.array(z.string()),
    medium: nullableString(),
    releaseSequence: z.string(),
    sequence: z.number(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    viewingDate: z.string(),
    viewingYear: z.string(),
    year: z.string(),
  })
  .transform(
    ({
      genres,
      medium,
      releaseSequence,
      sequence,
      slug,
      sortTitle,
      title,
      venue,
      viewingDate,
      viewingYear,
      year,
    }) => {
      // fix zod making anything with undefined optional
      return {
        genres,
        medium,
        releaseSequence,
        sequence,
        slug,
        sortTitle,
        title,
        venue,
        viewingDate,
        viewingYear,
        year,
      };
    },
  );

export type ViewingJson = z.infer<typeof ViewingJsonSchema>;

export async function allViewingsJson(): Promise<ViewingJson[]> {
  const json = await fs.readFile(viewingsJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ViewingJsonSchema.parse(item);
  });
}
