import { castAndCrewMember } from "~/api/cast-and-crew";
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
        return {
          ...title,
          reviewDisplayDate: newDisplayDate(title.reviewDate),
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

function newDisplayDate(date: Date | string | undefined) {
  if (!date) {
    return "";
  }

  const viewingDate = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    weekday: "short",
    year: "numeric",
  });

  const parts = formatter.formatToParts(viewingDate);
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  return `${year}-${month}-${day}`;
}
