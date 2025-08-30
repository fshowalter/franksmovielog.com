import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews, MoreReviewsHeading } from "~/components/MoreReviews";

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

export function MoreInCollections({ values }: Props) {
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
