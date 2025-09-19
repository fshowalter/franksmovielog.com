import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";

type Collection = Omit<Review["moreCollections"][number], "titles"> & {
  titles: CollectionTitle[];
};

type CollectionTitle = Review["moreCollections"][number]["titles"][number] & {
  excerpt: string;
  stillImageProps: StillImageProps;
};

type Props = {
  values: Collection[];
};

/**
 * Component displaying more reviews from the same collections.
 * @param props - Component props
 * @param props.values - Collection data with titles
 * @returns Array of MoreReviews components for each collection
 */
export function MoreInCollections({ values }: Props): React.JSX.Element[] {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <MoreReviewsHeading
        accentText={value.name}
        href={`/collections/${value.slug}/`}
        text="More "
      />
    </MoreReviews>
  ));
}
