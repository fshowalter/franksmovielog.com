import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { castAndCrewMember } from "~/api/castAndCrew";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./CastAndCrewMember";

export async function getProps(
  slug: string,
): Promise<Props & { metaDescription: string }> {
  const { distinctReleaseYears, distinctReviewYears, member } =
    await castAndCrewMember(slug);

  member.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    avatarImageProps: await getAvatarImageProps(
      member.slug,
      ListItemAvatarImageConfig,
    ),
    backdropImageProps: await getBackdropImageProps(
      member.slug,
      BackdropImageConfig,
    ),
    deck: deck(member),
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-asc",
    metaDescription: metaDescription(member),
    titles: await Promise.all(
      member.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            ListItemPosterImageConfig,
          ),
          reviewDisplayDate: title.reviewDate
            ? `${new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })}-${new Date(title.reviewDate).toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
              })}-${new Date(title.reviewDate).toLocaleDateString("en-US", {
                day: "2-digit",
                timeZone: "UTC",
              })}`
            : "",
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
    value: member,
  };
}

function deck(value: Props["value"]) {
  const creditString = new Intl.ListFormat().format(value.creditedAs);

  const creditList =
    creditString.charAt(0).toUpperCase() + creditString.slice(1);

  const watchlistTitleCount =
    value.reviewCount === value.totalCount
      ? ""
      : ` and ${value.totalCount - value.reviewCount} watchlist`;

  const titles =
    value.reviewCount === 1 && value.totalCount - value.reviewCount < 2
      ? "title"
      : `titles`;

  return `${creditList} with ${value.reviewCount} reviewed${watchlistTitleCount} ${titles}.`;
}

function metaDescription(value: Props["value"]) {
  const creditMap: Record<string, string> = {
    director: "directed by",
    performer: "with",
    writer: "written by",
  };

  const creditString = new Intl.ListFormat("en", {
    type: "disjunction",
  }).format(value.creditedAs.map((credit) => creditMap[credit]));

  return `Reviews of movies ${creditString} ${value.name}. Sort reviews by best or worst, newest or oldest. Filter by credit kind, year, or title.`;
}
