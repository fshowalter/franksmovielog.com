import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const viewingsJsonFile = getContentPath("data", "viewings.json");

const ViewingJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    medium: nullableString(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableNumber(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    viewingDate: z.string(),
    viewingSequence: z.number(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      medium: data.medium,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      venue: data.venue,
      viewingDate: data.viewingDate,
      viewingSequence: data.viewingSequence,
    };
  });

/**
 * Type for viewing JSON data.
 */
export type ViewingJson = z.infer<typeof ViewingJsonSchema>;

/**
 * Reads and parses all viewing data from the JSON file.
 * @returns Array of parsed viewing records
 */
export async function allViewingsJson(): Promise<ViewingJson[]> {
  return await perfLogger.measure("allViewingsJson", async () => {
    const json = await fs.readFile(viewingsJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return ViewingJsonSchema.parse(item);
    });
  });
}
