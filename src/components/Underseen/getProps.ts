import { getBackdropImageProps } from "src/api/backdrops";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allUnderseenGems } from "src/api/underseenGems";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./Underseen";
import type { Props } from "./Underseen";

export async function getProps(): Promise<Props> {
  const { underseenGems, distinctGenres, distinctReleaseYears } =
    await allUnderseenGems();

  underseenGems.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    underseenGems.map(async (review) => {
      const value: ListItemValue = {
        imdbId: review.imdbId,
        title: review.title,
        year: review.year,
        slug: review.slug,
        genres: review.genres,
        grade: review.grade,
        releaseSequence: review.releaseSequence,
        gradeValue: review.gradeValue,
        sortTitle: review.sortTitle,
        posterImageProps: await getFixedWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
      };

      return value;
    }),
  );

  return {
    deck: "Four and five star movies with a below average number of IMDb votes.",
    values,
    initialSort: "release-date-desc",
    distinctGenres,
    distinctReleaseYears,
    backdropImageProps: await getBackdropImageProps(
      "underseen",
      BackdropImageConfig,
    ),
  };
}
