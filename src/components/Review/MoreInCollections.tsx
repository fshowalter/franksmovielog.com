import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

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
      <SubHeading as="h2">
        More{" "}
        <a
          className={`
            inline-block origin-left transform-gpu text-accent
            transition-transform
            hover:scale-105
          `}
          href={`/collections/${value.slug}/`}
        >
          {value.name}
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
