import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allUnderseenGems } from "~/api/underseenGems";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./Underseen";
import type { Props } from "./Underseen";

export async function getProps(): Promise<Props & { metaDescription: string }> {
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
        posterImageProps: await getFluidWidthPosterImageProps(
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
    metaDescription:
      "Looking for something new? Behold my four and five star reviews of movies with a below average number of IMDb votes.",
    values,
  };
}
