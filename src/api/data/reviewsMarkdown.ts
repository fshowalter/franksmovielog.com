import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import pLimit from "p-limit";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";
import { z } from "zod";

import { removeFootnotes } from "~/api/utils/markdown/removeFootnotes";
import { trimToExcerpt } from "~/api/utils/markdown/trimToExcerpt";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const reviewsMarkdownDirectory = getContentPath("reviews");

export type MarkdownReview = {
  contentPlainText: string;
  date: Date;
  excerptHtml: string;
  excerptPlainText: string;
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
    // v4: Added excerptHtml, excerptPlainText and contentPlainText fields to cached data
    const schemaHash = await generateSchemaHash(
      JSON.stringify(DataSchema.shape) + "-v4-all-text-fields",
    );
    cacheInstance = new ContentCache<MarkdownReview>(
      "reviews-markdown",
      schemaHash,
    );
  }
  return cacheInstance;
}

const limit = pLimit(10);

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

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

            // Generate excerpt HTML
            const excerptContent = greyMatter.synopsis || rawContent;
            const excerptHtml = getMastProcessor()
              .use(removeFootnotes)
              .use(trimToExcerpt)
              .use(remarkRehype, { allowDangerousHtml: true })
              .use(rehypeRaw)
              .use(rehypeStringify)
              .processSync(excerptContent)
              .toString();

            // Generate excerpt plain text
            const excerptPlainText = getMastProcessor()
              .use(removeFootnotes)
              .use(trimToExcerpt)
              .use(strip)
              .processSync(rawContent)
              .toString();

            // Generate plain text content
            const contentPlainText = getMastProcessor()
              .use(removeFootnotes)
              .use(strip)
              .processSync(rawContent)
              .toString();

            return {
              contentPlainText,
              date: greyMatter.date,
              excerptHtml,
              excerptPlainText,
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
