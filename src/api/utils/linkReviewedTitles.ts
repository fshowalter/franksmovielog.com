export function linkReviewedTitles(
  text: string,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  let result = text;

  const re = new RegExp(/(<span data-imdb-id="(tt\d+)">)(.*?)(<\/span>)/, "g");

  const matches = [...text.matchAll(re)];

  for (const match of matches) {
    const reviewedMovie = reviewedTitles.find(
      (title) => title.imdbId === match[2],
    );

    if (reviewedMovie) {
      result = result.replace(
        `<span data-imdb-id="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${reviewedMovie.slug}/">${match[3]}</a>`,
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
