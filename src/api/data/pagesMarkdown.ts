import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";
import { z } from "zod";

import { removeFootnotes } from "~/api/utils/markdown/removeFootnotes";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const pagesMarkdownDirectory = getContentPath("pages");

type MarkdownPage = {
  contentPlainText: string;
  rawContent: string;
  slug: string;
  title: string;
};

const DataSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

// Create cache instance with schema hash
let cacheInstance: ContentCache<MarkdownPage> | undefined;

export async function allPagesMarkdown(): Promise<MarkdownPage[]> {
  return await parseAllPagesMarkdown();
}

async function getCache(): Promise<ContentCache<MarkdownPage>> {
  if (!cacheInstance) {
    // v2: Added contentPlainText field to cached data
    const schemaHash = await generateSchemaHash(
      JSON.stringify(DataSchema.shape) + "-v2-plain-text",
    );
    cacheInstance = new ContentCache<MarkdownPage>(
      "pages-markdown",
      schemaHash,
    );
  }
  return cacheInstance;
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

async function parseAllPagesMarkdown() {
  const dirents = await fs.readdir(pagesMarkdownDirectory, {
    withFileTypes: true,
  });

  const cache = await getCache();

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map(async (item) => {
        const filePath = path.join(pagesMarkdownDirectory, item.name);
        const fileContents = await fs.readFile(filePath, "utf8");

        return cache.get(filePath, fileContents, (content) => {
          const { content: rawContent, data } = matter(content);
          const greyMatter = DataSchema.parse(data);

          // Generate plain text content
          const contentPlainText = getMastProcessor()
            .use(removeFootnotes)
            .use(strip)
            .processSync(rawContent)
            .toString();

          return {
            contentPlainText,
            rawContent,
            slug: greyMatter.slug,
            title: greyMatter.title,
          };
        });
      }),
  );
}
