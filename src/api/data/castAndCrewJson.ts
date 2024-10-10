import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const castAndCrewJsonDirectory = getContentPath("data", "cast-and-crew");

const TitleSchema = z.object({
  collectionNames: z.array(z.string()),
  creditedAs: z.array(z.string()),
  grade: z.nullable(z.string()),
  gradeValue: z.nullable(z.number()),
  imdbId: z.string(),
  releaseSequence: z.string(),
  reviewDate: z.nullable(z.string()),
  slug: z.nullable(z.string()),
  sortTitle: z.string(),
  title: z.string(),
  viewingSequence: z.nullable(z.string()),
  watchlistDirectorNames: z.array(z.string()),
  watchlistPerformerNames: z.array(z.string()),
  watchlistWriterNames: z.array(z.string()),
  year: z.string(),
});

const CastAndCrewJsonSchema = z.object({
  creditedAs: z.array(z.string()),
  name: z.string(),
  reviewCount: z.number(),
  slug: z.string(),
  titles: z.array(TitleSchema),
  totalCount: z.number(),
});

async function parseAllCastAndCrewJson() {
  const dirents = await fs.readdir(castAndCrewJsonDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".json"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${castAndCrewJsonDirectory}/${item.name}`,
          "utf8",
        );

        const json = JSON.parse(fileContents) as unknown;
        return CastAndCrewJsonSchema.parse(json);
      }),
  );
}

export type CastAndCrewMemberJson = z.infer<typeof CastAndCrewJsonSchema>;

export async function allCastAndCrewJson(): Promise<CastAndCrewMemberJson[]> {
  return await parseAllCastAndCrewJson();
}
