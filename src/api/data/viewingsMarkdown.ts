import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const viewingsMarkdownDirectory = getContentPath("viewings");

const DataSchema = z.object({
  date: z.date(),
  imdbId: z.string(),
  medium: z.nullable(z.string()),
  mediumNotes: z.nullable(z.string()),
  sequence: z.number(),
  venue: z.nullable(z.string()),
  venueNotes: z.nullable(z.string()),
});

export type MarkdownViewing = {
  date: Date;
  imdbId: string;
  medium: null | string;
  mediumNotesRaw: null | string;
  sequence: number;
  venue: null | string;
  venueNotesRaw: null | string;
  viewingNotesRaw: null | string;
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
