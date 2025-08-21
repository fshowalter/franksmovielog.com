import type { JSX } from "react";

import type { BackdropImageProps } from "~/api/backdrops";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout";
import { SubHeading } from "~/components/SubHeading";

import type { ListItemValue } from "./HomeListItem";

import { HomeListItem } from "./HomeListItem";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  values: ListItemValue[];
};

export function Home({ backdropImageProps, deck, values }: Props): JSX.Element {
  return (
    <Layout className="bg-subtle pb-8" hideLogo={true}>
      <Backdrop
        deck={deck}
        imageProps={backdropImageProps}
        title="Frank's Movie Log"
        titleStyle="[text-shadow:1px_1px_2px_black] text-[2rem] leading-10 tablet:text-4xl laptop:text-7xl"
      />
      <nav className="mx-auto max-w-(--breakpoint-desktop)">
        <SubHeading as="h2" className="px-container">
          Latest Reviews
        </SubHeading>
        <ul
          className={`
            flex w-full flex-col flex-wrap justify-center gap-x-[3%] pb-8
            tablet:flex-row tablet:justify-between tablet:gap-y-[6vw]
            tablet:px-container
            laptop:gap-y-[3vw]
            desktop:gap-y-14
          `}
        >
          {values.map((value) => {
            return <HomeListItem key={value.reviewSequence} value={value} />;
          })}
        </ul>
        <div className="flex px-container py-10">
          <a
            className={`
              group/all-reviews mx-auto w-full max-w-button transform-gpu
              rounded-md bg-default py-5 text-center font-sans text-xs
              font-semibold tracking-wide text-accent uppercase transition-all
              hover:scale-105 hover:bg-accent hover:text-inverse
            `}
            href="/reviews/"
          >
            <span
              className={`
                relative inline-block
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-center after:scale-x-0
                after:bg-(--fg-inverse) after:transition-transform
                group-hover/all-reviews:after:scale-x-100
              `}
            >
              All Reviews
            </span>
          </a>
        </div>
      </nav>
    </Layout>
  );
}
