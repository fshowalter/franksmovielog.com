import { PageTitle } from "../PageTitle";

export function Header(): JSX.Element {
  return (
    <>
      <div className="text-center font-sans text-accent">
        <a href="/reviews/">Reviews</a>
      </div>
      <PageTitle className="text-center desktop:max-w-[26rem]">
        Overrated Disappointments
      </PageTitle>
      <div className="spacer-y-2" />
      <div className="text-subtle">
        <q className="block text-center text-subtle">
          Did you watch me? I gave all of me!
        </q>
        <div className="spacer-y-8" />
      </div>
      <p className="max-w-80 text-subtle">
        One and two star movies with an above-average IMDb rating and vote
        count.
      </p>
    </>
  );
}
