let imdbIdToSlugCache: Record<string, string | undefined>;

const re = new RegExp(/(<span data-imdb-id="(tt\d+)">)(.*?)(<\/span>)/, "g");

export function linkReviewedTitles(
  text: string | undefined,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  if (!text) {
    return text;
  }

  let result = text;

  const matches = [...text.matchAll(re)];

  const cache = getImdbIdToSlugCache(reviewedTitles);

  for (const match of matches) {
    const matchingSlug = cache[match[2]];

    if (matchingSlug) {
      result = result.replace(
        `<span data-imdb-id="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${matchingSlug}/">${match[3]}</a>`,
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

function getImdbIdToSlugCache(
  reviewedTitles: { imdbId: string; slug: string }[],
): Record<string, string | undefined> {
  if (imdbIdToSlugCache) {
    return imdbIdToSlugCache;
  }

  imdbIdToSlugCache = {};

  for (const title of reviewedTitles) {
    imdbIdToSlugCache[title.imdbId] = title.slug;
  }

  return imdbIdToSlugCache;
}
