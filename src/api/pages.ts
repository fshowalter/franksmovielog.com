import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { perfLogger } from "~/utils/performanceLogger";

import { allPagesMarkdown } from "./data/pages-markdown";
import { allReviewedTitlesJson } from "./data/reviewed-titles-json";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

type MarkdownPage = {
  content: string | undefined;
  rawContent: string;
  title: string;
};

/**
 * Converts markdown content to plain text.
 * @param rawContent - Raw markdown content
 * @returns Plain text with footnotes and markdown syntax removed
 */
export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

/**
 * Retrieves a page by slug with rendered HTML content.
 * @param slug - Page identifier
 * @returns Page with title, content, and raw markdown
 */
export async function getPage(slug: string): Promise<MarkdownPage> {
  return await perfLogger.measure("getPage", async () => {
    const pages = await allPagesMarkdown();

    const matchingPage = pages.find((page) => {
      return page.slug === slug;
    })!;

    const reviewedTitlesJson = await allReviewedTitlesJson();

    return {
      content: getHtml(matchingPage?.rawContent, reviewedTitlesJson),
      rawContent: matchingPage?.rawContent || "",
      title: matchingPage.title,
    };
  });
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
