import { getBackdropImageProps } from "src/api/backdrops";
import { allOverratedDisappointments } from "src/api/overratedDisappointments";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./Overrated";
import type { Props } from "./Overrated";

export async function getProps(): Promise<Props> {
  const { distinctGenres, distinctReleaseYears, overratedDisappointments } =
    await allOverratedDisappointments();

  overratedDisappointments.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    overratedDisappointments.map(async (review) => {
      const listItemData: ListItemValue = {
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

      return listItemData;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "overrated",
      BackdropImageConfig,
    ),
    deck: "One and two star movies with an above-average IMDb rating and vote count.",
    distinctGenres,
    distinctReleaseYears,
    initialSort: "release-date-desc",
    values,
  };
}
