import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allUnderseenGems } from "~/api/underseenGems";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue } from "./Underseen";
import type { Props } from "./Underseen";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underseenGems,
  } = await allUnderseenGems();

  underseenGems.sort((a, b) =>
    b.releaseSequence.localeCompare(a.releaseSequence),
  );

  const values = await Promise.all(
    underseenGems.map(async (title) => {
      const value: ListItemValue = {
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
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "Looking for something new? Behold my four and five star reviews of movies with a below average number of IMDb votes.",
    values,
  };
}
