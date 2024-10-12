import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

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

async function parseAllViewingsMarkdown() {
  const dirents = await fs.readdir(viewingsMarkdownDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${viewingsMarkdownDirectory}/${item.name}`,
          "utf8",
        );

        const { content, data } = matter(fileContents);
        const greyMatter = DataSchema.parse(data);

        const markdownViewing: MarkdownViewing = {
          date: greyMatter.date,
          imdbId: greyMatter.imdbId,
          medium: greyMatter.medium,
          mediumNotesRaw: greyMatter.mediumNotes,
          sequence: greyMatter.sequence,
          venue: greyMatter.venue,
          venueNotesRaw: greyMatter.venueNotes,
          viewingNotesRaw: content,
        };

        return markdownViewing;
      }),
  );
}

export async function allViewingsMarkdown(): Promise<MarkdownViewing[]> {
  return await parseAllViewingsMarkdown();
}
