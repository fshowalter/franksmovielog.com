import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allUnderratedSurprises } from "~/api/underratedSurprises";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./Underrated";
import type { Props } from "./Underrated";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underratedSurprises,
  } = await allUnderratedSurprises();

  underratedSurprises.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    underratedSurprises.map(async (title) => {
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
      "underrated",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "The masses are wrong. These are movies have a four or five star review despite a below-average IMDb rating.",
    values,
  };
}
