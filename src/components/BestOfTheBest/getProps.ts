import { getBackdropImageProps } from "~/api/backdrops";
import { allBestOfTheBest } from "~/api/bestOfTheBest";
import { getFixedWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./BestOfTheBest";
import type { Props } from "./BestOfTheBest";

export async function getProps(): Promise<Props> {
  const { bestOfTheBest, distinctGenres, distinctReleaseYears } =
    await allBestOfTheBest();

  bestOfTheBest.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    bestOfTheBest.map(async (review) => {
      const value: ListItemValue = {
        genres: review.genres,
        grade: review.grade,
        gradeValue: review.gradeValue,
        imdbId: review.imdbId,
        posterImageProps: await getFixedWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
        releaseSequence: review.releaseSequence,
        slug: review.slug,
        sortTitle: review.sortTitle,
        title: review.title,
        year: review.year,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "best-of-the-best",
      BackdropImageConfig,
    ),
    deck: "Five star movies with at least three viewings.",
    distinctGenres,
    distinctReleaseYears,
    initialSort: "release-date-desc",
    values,
  };
}
