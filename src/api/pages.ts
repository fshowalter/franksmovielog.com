import { allPagesMarkdown } from "./data/pagesMarkdown";
import { allReviewedTitlesJson } from "./data/reviewedTitlesJson";
import { getHtml } from "./utils/markdown/getHtml";

interface MarkdownPage {
  content: null | string;
  title: string;
}

export async function getPage(slug: string): Promise<MarkdownPage> {
  const pages = await allPagesMarkdown();

  const matchingPage = pages.find((page) => {
    return page.slug === slug;
  })!;

  const reviewedTitlesJson = await allReviewedTitlesJson();

  return {
    content: getHtml(matchingPage?.rawContent, reviewedTitlesJson),
    title: matchingPage.title,
  };
}
