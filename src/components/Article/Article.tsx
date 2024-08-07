import type { BackdropImageProps } from "src/api/backdrops";

import { LongFormText } from "../LongFormText";
import { PageTitle } from "../PageTitle";
import { StillList } from "../StillList";
import { StillListHeading } from "../StillListHeading";
import type { StillListItemValue } from "../StillListItem";
import { StillListNav } from "../StillListNav";

export const BackdropImageConfig = {
  width: 960,
  height: 540,
  sizes: "(min-width: 960px) 960px, 100vw",
};

export interface Props {
  alt: string;
  content: string | null;
  title: string;
  backdropImageProps: BackdropImageProps;
  recentReviews: StillListItemValue[];
}

export function Article({
  alt,
  title,
  content,
  recentReviews,
  backdropImageProps,
}: Props): JSX.Element {
  return (
    <main>
      <article className="flex flex-col items-center">
        <PageTitle className="px-pageMargin py-6 text-center desktop:py-8">
          {title}
        </PageTitle>
        <img
          {...backdropImageProps}
          width={BackdropImageConfig.width}
          height={BackdropImageConfig.height}
          sizes={BackdropImageConfig.sizes}
          loading="lazy"
          decoding="async"
          alt={alt}
          className="mb-[5.33px]"
        />
        <div className="spacer-y-16" />
        <div className="px-pageMargin">
          <LongFormText text={content} className="max-w-prose" />
        </div>
        <div className="spacer-y-32" />
      </article>
      <div
        data-pagefind-ignore
        className="flex w-full max-w-popout items-center justify-center bg-default tablet:max-w-full tablet:bg-subtle tablet:pb-32 tablet:pt-8"
      >
        <StillListNav>
          <StillListHeading
            leadText="Latest"
            linkText="Reviews"
            linkTarget={`/reviews/`}
          />
          <StillList
            values={recentReviews}
            seeAllLinkTarget="/reviews/"
            seeAllLinkText="Reviews"
          />
        </StillListNav>
      </div>
    </main>
  );
}
