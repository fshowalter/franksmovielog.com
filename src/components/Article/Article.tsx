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
      <article>
        <header
          className="flex min-h-[520px] content-start items-end bg-cover px-20 pb-16 pt-40 text-[#fff] [background-position-x:center]"
          style={{ backgroundImage: `url(${backdropImageProps.src})` }}
        >
          <div className="mx-auto w-full max-w-[1696px] px-20">
            <h1 className="font-sans-bold text-7xl uppercase">{title}</h1>
            <div className="spacer-y-4" />
          </div>
        </header>
        <section className="flex flex-col items-center">
          <div className="spacer-y-16" />
          <div className="px-pageMargin">
            <LongFormText text={content} className="max-w-prose" />
          </div>
          <div className="spacer-y-32" />
        </section>
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
