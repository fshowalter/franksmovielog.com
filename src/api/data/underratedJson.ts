import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const underratedJsonFile = getContentPath("data", "underrated.json");

const UnderratedJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: z.string(),
    gradeValue: z.number(),
    imdbId: z.string(),
    releaseSequence: z.string(),
    releaseYear: z.string().optional(),
    reviewDate: z.date({ coerce: true }),
    reviewSequence: z.string(),
    slug: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";

    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

export type UnderratedJson = z.infer<typeof UnderratedJsonSchema>;

export async function allUnderratedJson(): Promise<UnderratedJson[]> {
  const json = await fs.readFile(underratedJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return UnderratedJsonSchema.parse(item);
  });
}
