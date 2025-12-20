import { castAndCrewMember } from "~/api/cast-and-crew";
import { loadExcerptHtml } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";
import { displayDate } from "~/utils/displayDate";

import type { CastAndCrewMemberTitlesProps } from "./CastAndCrewMemberTitles";

/**
 * Fetches data for a cast/crew member's titles page including their filmography with poster images.
 * @param slug - The slug identifier for the cast/crew member
 * @returns Props for the CastAndCrewMemberTitles component
 */
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
        let excerpt;

        if (title.slug) {
          const reviewWithExcerpt = await loadExcerptHtml({ slug: title.slug });
          excerpt = reviewWithExcerpt.excerpt;
        }

        return {
          ...title,
          excerpt,
          reviewDisplayDate: displayDate(title.reviewDate, {
            dayFormat: "numeric",
          }),
          reviewSequence: title.reviewSequence,
          reviewYear: title.reviewDate
            ? new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })
            : "",
          stillImageProps: await getStillImageProps(
            title.slug || "default",
            ReviewCardListImageConfig,
          ),
        };
      }),
    ),
  };
}
