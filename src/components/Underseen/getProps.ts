import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allUnderseenGems } from "src/api/underseenGems";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./List";
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
    values,
    initialSort: "release-date-desc",
    distinctGenres,
    distinctReleaseYears,
  };
}
