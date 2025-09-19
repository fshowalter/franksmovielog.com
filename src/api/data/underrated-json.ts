import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const underratedJsonFile = getContentPath("data", "underrated.json");

const UnderratedJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: z.string(),
    gradeValue: z.number(),
    imdbId: z.string(),
    releaseSequence: z.number(),
    releaseYear: z.string(),
    reviewDate: z.date({ coerce: true }),
    reviewSequence: z.number(),
    slug: z.string(),
    sortTitle: z.string(),
    title: z.string(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

/**
 * Type definition for underrated movie data from JSON.
 */
export type UnderratedJson = z.infer<typeof UnderratedJsonSchema>;

/**
 * Retrieves all underrated movies from JSON data.
 * @returns Array of underrated movie entries
 */
export async function allUnderratedJson(): Promise<UnderratedJson[]> {
  return await perfLogger.measure("allUnderratedJson", async () => {
    const json = await fs.readFile(underratedJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return UnderratedJsonSchema.parse(item);
    });
  });
}
