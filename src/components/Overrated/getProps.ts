import { getBackdropImageProps } from "~/api/backdrops";
import { allOverratedDisappointments } from "~/api/overratedDisappointments";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./Overrated";
import type { Props } from "./Overrated";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    overratedDisappointments,
  } = await allOverratedDisappointments();

  overratedDisappointments.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    overratedDisappointments.map(async (title) => {
      const listItemData: ListItemValue = {
        genres: title.genres,
        grade: title.grade,
        gradeValue: title.gradeValue,
        imdbId: title.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          title.slug,
          ListItemPosterImageConfig,
        ),
        releaseSequence: title.releaseSequence,
        reviewDisplayDate: `${title.reviewDate.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        })}-${title.reviewDate.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        })}-${title.reviewDate.toLocaleDateString("en-US", {
          day: "2-digit",
          timeZone: "UTC",
        })}`,
        reviewSequence: title.reviewSequence,
        reviewYear: title.reviewDate.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        slug: title.slug,
        sortTitle: title.sortTitle,
        title: title.title,
        year: title.year,
      };

      return listItemData;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "overrated",
      BackdropImageConfig,
    ),
    deck: "One and two star movies with an above-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "Feeling contrarian? Behold my one and two star reviews of movies that somehow received and above-average IMDb rating.",
    values,
  };
}
