import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allUnderratedSurprises } from "~/api/underratedSurprises";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./Underrated";
import type { Props } from "./Underrated";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const { distinctGenres, distinctReleaseYears, overratedDisappointments } =
    await allUnderratedSurprises();

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

      return listItemData;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "underrated",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    initialSort: "release-date-desc",
    metaDescription:
      "The masses are wrong. These are movies have a four or five star review despite a below-average IMDb rating.",
    values,
  };
}
