import type { BackdropImageProps } from "src/api/backdrops";

import { Backdrop } from "src/components/Backdrop";
import { Layout } from "src/components/Layout";
import { SubHeading } from "src/components/SubHeading";

import type { ListItemValue } from "./HomeListItem";

import { HomeListItem } from "./HomeListItem";

export interface Props {
  backdropImageProps: BackdropImageProps;
  deck: string;
  values: ListItemValue[];
}

export function Home({ backdropImageProps, deck, values }: Props): JSX.Element {
  return (
    <Layout className="bg-subtle pb-8" hideLogo={true}>
      <Backdrop
        deck={deck}
        imageProps={backdropImageProps}
        title="Frank's Movie Log"
        titleStyle="[text-shadow:1px_1px_2px_black] text-4xl desktop:text-7xl"
      />
      <nav className="mx-auto max-w-screen-max">
        <SubHeading as="h2" className="px-container">
          Latest Reviews
        </SubHeading>
        <ul className="flex w-full flex-col flex-wrap justify-center gap-x-[3%] pb-8 tablet:flex-row tablet:justify-between tablet:gap-y-[6vw] tablet:px-container desktop:gap-y-[3vw] max:gap-y-14">
          {values.map((value) => {
            return <HomeListItem key={value.sequence} value={value} />;
          })}
        </ul>
        <div className="flex px-container py-10">
          <a
            className="mx-auto w-full max-w-button bg-default py-5 text-center font-sans text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent hover:text-inverse"
            href="/reviews/"
          >
            All Reviews
          </a>
        </div>
      </nav>
    </Layout>
  );
}
