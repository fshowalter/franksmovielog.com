import { PageTitle } from "src/components/PageTitle";

export function Header(): JSX.Element {
  return (
    <>
      <div className="text-center font-sans text-accent">
        <a href="/reviews/">Reviews</a>
      </div>
      <PageTitle className="text-center">Underseen Gems</PageTitle>
      <div className="spacer-y-2" />
      <div className="text-subtle">
        <q className="block text-center text-subtle">
          My God, it&apos;s full of stars!
        </q>
        <div className="spacer-y-8" />
      </div>
      <p className="max-w-80 text-subtle">
        Four and five star movies with a below average number of IMDb votes.
      </p>
    </>
  );
}
