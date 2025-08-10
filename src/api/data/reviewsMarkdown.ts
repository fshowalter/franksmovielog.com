import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import pLimit from "p-limit";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
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

// Create cache instance with schema hash
let cacheInstance: ContentCache<MarkdownReview> | undefined;

export async function allReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await parseAllReviewsMarkdown();
}

async function getCache(): Promise<ContentCache<MarkdownReview>> {
  if (!cacheInstance) {
    // Generate schema hash from the Zod schema
    const schemaHash = await generateSchemaHash(JSON.stringify(DataSchema.shape));
    cacheInstance = new ContentCache<MarkdownReview>("reviews-markdown", schemaHash);
  }
  return cacheInstance;
}

const limit = pLimit(10);

async function parseAllReviewsMarkdown(): Promise<MarkdownReview[]> {
  const dirents = await fs.readdir(reviewsMarkdownDirectory, {
    withFileTypes: true,
  });

  const cache = await getCache();

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map((item) => {
        return limit(async () => {
          const filePath = path.join(reviewsMarkdownDirectory, item.name);
          const fileContents = await fs.readFile(filePath, "utf8");

          return cache.get(filePath, fileContents, (content) => {
            const { content: rawContent, data } = matter(content);
            const greyMatter = DataSchema.parse(data);

            return {
              date: greyMatter.date,
              grade: greyMatter.grade,
              imdbId: greyMatter.imdb_id,
              rawContent,
              slug: greyMatter.slug,
              synopsis: greyMatter.synopsis,
            };
          });
        });
      }),
  );
}
