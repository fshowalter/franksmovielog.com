import type { BackdropImageProps } from "src/api/backdrops";
import { Backdrop } from "src/components/Backdrop";
import { Layout } from "src/components/Layout";
import { SubHeading } from "src/components/SubHeading";

import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";

export interface Props {
  values: ListItemValue[];
  backdropImageProps: BackdropImageProps;
}

export function Home({ values, backdropImageProps }: Props): JSX.Element {
  return (
    <Layout hideLogo={true} className="bg-subtle pb-8">
      <Backdrop
        imageProps={backdropImageProps}
        title="Frank's Movie Log"
        deck="Quality reviews of films of questionable quality."
        titleStyle="[text-shadow:1px_1px_2px_black] text-4xl desktop:text-7xl"
      />
      <nav className="mx-auto max-w-screen-max px-container">
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ul className="flex w-full flex-col flex-wrap justify-center gap-x-[3%] gap-y-[6vw] pb-8 tablet:flex-row tablet:justify-between desktop:gap-y-[3vw] max:gap-y-14">
          {values.map((value) => {
            return <HomeListItem key={value.sequence} value={value} />;
          })}
        </ul>
        <div className="flex py-10">
          <a
            href="/reviews/"
            className="mx-auto w-full max-w-[430px] bg-default px-pageMargin py-5 text-center font-sans-narrow text-sm font-semibold uppercase tracking-[.6px] text-accent hover:bg-accent hover:text-inverse"
          >
            All Reviews
          </a>
        </div>
      </nav>
    </Layout>
  );
}
