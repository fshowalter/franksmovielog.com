import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { perfLogger } from "~/utils/performanceLogger";

import { allPagesMarkdown } from "./data/pagesMarkdown";
import { allReviewedTitlesJson } from "./data/reviewedTitlesJson";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

type MarkdownPage = {
  content: string | undefined;
  rawContent: string;
  title: string;
};

export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

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
