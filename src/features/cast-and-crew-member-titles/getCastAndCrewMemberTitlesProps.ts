import { castAndCrewMember } from "~/api/cast-and-crew";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { CastAndCrewMemberTitlesProps } from "./CastAndCrewMemberTitles";

export async function getCastAndCrewMemberTitlesProps(
  slug: string,
): Promise<CastAndCrewMemberTitlesProps> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, member } =
    await castAndCrewMember(slug);

  return {
    distinctCreditKinds: member.creditedAs,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-asc",
    values: await Promise.all(
      member.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            PosterListItemImageConfig,
          ),
          reviewDisplayDate: displayDate(title.reviewDate),
          reviewSequence: title.reviewSequence,
          reviewYear: title.reviewDate
            ? new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })
            : "",
        };
      }),
    ),
  };
}
