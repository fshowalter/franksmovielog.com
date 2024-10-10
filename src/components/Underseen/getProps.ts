import { getBackdropImageProps } from "src/api/backdrops";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allUnderseenGems } from "src/api/underseenGems";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./Underseen";
import type { Props } from "./Underseen";

export async function getProps(): Promise<Props> {
  const { distinctGenres, distinctReleaseYears, underseenGems } =
    await allUnderseenGems();

  underseenGems.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    underseenGems.map(async (review) => {
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
      "underseen",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below average number of IMDb votes.",
    distinctGenres,
    distinctReleaseYears,
    initialSort: "release-date-desc",
    values,
  };
}
