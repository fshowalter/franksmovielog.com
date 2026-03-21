/**
 * Converts special work reference spans into links to reviewed works.
 * Processes HTML text to find spans with data-work-slug attributes and
 * replaces them with links to review pages if the work has been reviewed.
 *
 * @param text - HTML text containing work reference spans
 * @param reviewedTitles - Array of reviewed titles with imdb IDs and slugs
 * @returns HTML text with work references converted to links
 */
export function linkReviewedTitles(
  text: string | undefined,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  if (!text) {
    return text;
  }

  let result = text;

  const re = new RegExp(/(<span data-imdb-id="(tt\d+)">)(.*?)(<\/span>)/, "g");

  const matches = [...text.matchAll(re)];

  for (const match of matches) {
    const matchingTitle = reviewedTitles.find(
      (title) => title.imdbId === match[2],
    );

    if (matchingTitle) {
      result = result.replace(
        `<span data-imdb-id="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${matchingTitle.slug}/">${match[3]}</a>`,
      );
    } else {
      if (match[3]) {
        result = result.replace(
          `<span data-imdb-id="${match[2]}">${match[3]}</span>`,
          match[3],
        );
      }
    }
  }

  return result;
}
