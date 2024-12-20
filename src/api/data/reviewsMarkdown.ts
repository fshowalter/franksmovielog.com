import matter from "gray-matter";
import fs from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const reviewsMarkdownDirectory = getContentPath("reviews");

export type MarkdownReview = {
  date: Date;
  grade: string;
  imdbId: string;
  rawContent: string;
  slug: string;
};

const DataSchema = z.object({
  date: z.date(),
  grade: z.string(),
  imdb_id: z.string(),
  slug: z.string(),
});

export async function allReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await parseAllReviewsMarkdown();
}

async function parseAllReviewsMarkdown(): Promise<MarkdownReview[]> {
  const dirents = fs.readdirSync(reviewsMarkdownDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map((item) => {
        const fileContents = fs.readFileSync(
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
        };
      }),
  );
}
