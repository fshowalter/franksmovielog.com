import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";

type CastAndCrewMember = Omit<Review["moreCastAndCrew"][number], "titles"> & {
  titles: CastAndCrewMemberTitle[];
};

type CastAndCrewMemberTitle =
  Review["moreCastAndCrew"][number]["titles"][number] & {
    excerpt: string;
    stillImageProps: StillImageProps;
  };

type Props = {
  values: CastAndCrewMember[];
};

/**
 * Component displaying more reviews from cast and crew members.
 * @param props - Component props
 * @param props.values - Cast and crew members with their reviewed titles
 * @returns Array of MoreReviews components for each cast/crew member
 */
export function MoreFromCastAndCrew({ values }: Props): React.JSX.Element[] {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <MoreReviewsHeading
        accentText={value.name}
        href={`/cast-and-crew/${value.slug}/`}
        text={`${leadTextForCreditKind(value.creditKind)} `}
      />
    </MoreReviews>
  ));
}

function leadTextForCreditKind(
  creditKind: "director" | "performer" | "writer",
): string {
  switch (creditKind) {
    case "director": {
      return "More directed by";
    }
    case "performer": {
      return "More with";
    }
    case "writer": {
      return "More written by";
    }
    // no-default
  }
}
