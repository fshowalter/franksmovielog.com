import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import pLimit from "p-limit";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

const viewingsMarkdownDirectory = getContentPath("viewings");

const DataSchema = z
  .object({
    date: z.date(),
    imdbId: z.string(),
    medium: nullableString(),
    mediumNotes: nullableString(),
    sequence: z.number(),
    venue: nullableString(),
    venueNotes: nullableString(),
  })
  .transform(
    ({ date, imdbId, medium, mediumNotes, sequence, venue, venueNotes }) => {
      // fix zod making anything with undefined optional
      return { date, imdbId, medium, mediumNotes, sequence, venue, venueNotes };
    },
  );

export type MarkdownViewing = {
  date: Date;
  imdbId: string;
  medium: string | undefined;
  mediumNotesRaw: string | undefined;
  sequence: number;
  venue: string | undefined;
  venueNotesRaw: string | undefined;
  viewingNotesRaw: string | undefined;
};

// Create cache instance with schema hash
let cacheInstance: ContentCache<MarkdownViewing> | undefined;

async function getCache(): Promise<ContentCache<MarkdownViewing>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(DataSchema._def.schema.shape));
    cacheInstance = new ContentCache<MarkdownViewing>("viewings-markdown", schemaHash);
  }
  return cacheInstance;
}

const limit = pLimit(10);

export async function allViewingsMarkdown(): Promise<MarkdownViewing[]> {
  return await parseAllViewingsMarkdown();
}

async function parseAllViewingsMarkdown() {
  const dirents = await fs.readdir(viewingsMarkdownDirectory, {
    withFileTypes: true,
  });

  const cache = await getCache();

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map(async (item) => {
        return limit(async () => {
          const filePath = path.join(viewingsMarkdownDirectory, item.name);
          const fileContents = await fs.readFile(filePath, "utf8");

          return cache.get(filePath, fileContents, (content) => {
            const { content: viewingNotesRaw, data } = matter(content);
            const greyMatter = DataSchema.parse(data);

            return {
              date: greyMatter.date,
              imdbId: greyMatter.imdbId,
              medium: greyMatter.medium,
              mediumNotesRaw: greyMatter.mediumNotes,
              sequence: greyMatter.sequence,
              venue: greyMatter.venue,
              venueNotesRaw: greyMatter.venueNotes,
              viewingNotesRaw,
            };
          });
        });
      }),
  );
}
