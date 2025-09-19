import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const underseenJsonFile = getContentPath("data", "underseen.json");

const UnderseenJsonSchema = z
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
 * Type for underseen movie JSON data.
 */
export type UnderseenJson = z.infer<typeof UnderseenJsonSchema>;

/**
 * Reads and parses all underseen movies data from the JSON file.
 * @returns Array of parsed underseen movie records
 */
export async function allUnderseenJson(): Promise<UnderseenJson[]> {
  return await perfLogger.measure("allUnderseenJson", async () => {
    const json = await fs.readFile(underseenJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return UnderseenJsonSchema.parse(item);
    });
  });
}
