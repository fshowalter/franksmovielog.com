import { getBackdropImageProps } from "src/api/backdrops";
import { allOverratedDisappointments } from "src/api/overratedDisappointments";
import { getFixedWidthPosterImageProps } from "src/api/posters";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./Overrated";
import type { Props } from "./Overrated";

export async function getProps(): Promise<Props> {
  const { overratedDisappointments, distinctGenres, distinctReleaseYears } =
    await allOverratedDisappointments();

  overratedDisappointments.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    overratedDisappointments.map(async (review) => {
      const listItemData: ListItemValue = {
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

      return listItemData;
    }),
  );

  return {
    deck: "One and two star movies with an above-average IMDb rating and vote count.",
    values,
    initialSort: "release-date-desc",
    distinctGenres,
    distinctReleaseYears,
    backdropImageProps: await getBackdropImageProps(
      "overrated",
      BackdropImageConfig,
    ),
  };
}
