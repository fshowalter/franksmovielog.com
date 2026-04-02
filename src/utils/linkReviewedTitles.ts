import { getCollection } from "astro:content";

let imdbIdToSlugCache: Record<string, string | undefined>;

const re = new RegExp(/(<span data-imdb-id="(tt\d+)">)(.*?)(<\/span>)/, "g");

export async function linkReviewedTitles(text: string | undefined) {
  if (!text) {
    return text;
  }

  let result = text;

  const matches = [...text.matchAll(re)];

  const cache = await getImdbIdToSlugCache();

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

async function getImdbIdToSlugCache(): Promise<
  Record<string, string | undefined>
> {
  if (imdbIdToSlugCache) {
    return imdbIdToSlugCache;
  }

  const cache: Record<string, string | undefined> = {};

  const reviewedTitles = await getCollection("reviewedTitles");

  for (const { data: title } of reviewedTitles) {
    cache[title.imdbId] = title.review.id;
  }

  imdbIdToSlugCache = cache;

  return imdbIdToSlugCache;
}
