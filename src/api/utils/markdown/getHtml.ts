import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { linkReviewedTitles } from "~/api/utils/linkReviewedTitles";

/**
 * Converts markdown content to HTML with automatic linking to reviewed titles.
 * @param content - Markdown content to process
 * @param reviewedTitles - Array of reviewed titles for automatic linking
 * @returns HTML string with linked titles or undefined if no content
 */
export function getHtml(
  content: string | undefined,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  if (!content) {
    return;
  }

  const html = getHtmlProcessor().processSync(content).toString();

  return linkReviewedTitles(html, reviewedTitles);
}

function getHtmlProcessor() {
  return remark()
    .use(remarkGfm)
    .use(smartypants)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteBackContent: "↩\u{FE0E}",
      footnoteLabel: "Notes",
    })
    .use(rehypeRaw)
    .use(rehypeStringify);
}
