import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const viewingsJsonFile = getContentPath("data", "viewings.json");

const ViewingJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString().optional(),
    gradeValue: nullableNumber().optional(),
    imdbId: z.string().optional(),
    medium: nullableString(),
    releaseSequence: z.string(),
    releaseYear: z.string().optional(),
    reviewDate: nullableString().optional(),
    reviewSequence: nullableString().optional(),
    sequence: z.number().optional(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    viewingDate: z.string(),
    viewingSequence: z.number().optional(),
    viewingYear: z.string().optional(),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";
    const viewingSequence = data.viewingSequence || data.sequence || 0;
    const imdbId = data.imdbId || "";
    const grade = data.grade || undefined;
    const gradeValue = data.gradeValue || undefined;
    const reviewDate = data.reviewDate || undefined;
    const reviewSequence = data.reviewSequence || undefined;

    // Extract viewingYear from viewingDate if not provided
    const viewingYear = data.viewingYear || data.viewingDate.split("-")[0];

    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade,
      gradeValue,
      imdbId,
      medium: data.medium,
      releaseSequence: data.releaseSequence,
      releaseYear,
      reviewDate,
      reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      venue: data.venue,
      viewingDate: data.viewingDate,
      viewingSequence,
      viewingYear,
    };
  });

export type ViewingJson = z.infer<typeof ViewingJsonSchema>;

export async function allViewingsJson(): Promise<ViewingJson[]> {
  const json = await fs.readFile(viewingsJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ViewingJsonSchema.parse(item);
  });
}
