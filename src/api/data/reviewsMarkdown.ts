import matter from "gray-matter";
import { promises as fs } from "node:fs";
import pLimit from "p-limit";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const reviewsMarkdownDirectory = getContentPath("reviews");

export type MarkdownReview = {
  date: Date;
  grade: string;
  imdbId: string;
  rawContent: string;
  slug: string;
  synopsis: string | undefined;
};

const DataSchema = z.object({
  date: z.date(),
  grade: z.string(),
  imdb_id: z.string(),
  slug: z.string(),
  synopsis: z.optional(z.string()),
});

export async function allReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await parseAllReviewsMarkdown();
}

const limit = pLimit(10);

async function parseAllReviewsMarkdown(): Promise<MarkdownReview[]> {
  const dirents = await fs.readdir(reviewsMarkdownDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map((item) => {
        return limit(async () => {
          const fileContents = await fs.readFile(
            `${reviewsMarkdownDirectory}/${item.name}`,
            "utf8",
          );

          const { content, data } = matter(fileContents);
          const greyMatter = DataSchema.parse(data);

          return {
            date: greyMatter.date,
            grade: greyMatter.grade,
            imdbId: greyMatter.imdb_id,
            rawContent: content,
            slug: greyMatter.slug,
            synopsis: greyMatter.synopsis,
          };
        });
      }),
  );
}
