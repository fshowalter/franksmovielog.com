import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const pagesMarkdownDirectory = getContentPath("pages");

type MarkdownPage = {
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
    const schemaHash = await generateSchemaHash(
      JSON.stringify(DataSchema.shape),
    );
    cacheInstance = new ContentCache<MarkdownPage>(
      "pages-markdown",
      schemaHash,
    );
  }
  return cacheInstance;
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

          return {
            rawContent,
            slug: greyMatter.slug,
            title: greyMatter.title,
          };
        });
      }),
  );
}
