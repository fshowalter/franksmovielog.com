import { PageTitle } from "src/components/PageTitle";

export function Header({ titleCount }: { titleCount: number }): JSX.Element {
  return (
    <>
      <PageTitle className="text-center">Watchlist</PageTitle>
      <div className="spacer-y-2" />
      <q className="block text-center text-subtle">
        A man&apos;s got to know his limitations.
      </q>
      <div className="spacer-y-8" />
      <p className="max-w-prose px-gutter text-subtle">
        My movie review bucketlist. {titleCount.toLocaleString()} titles. No
        silents or documentaries.
      </p>
      <div className="spacer-y-4" />
      <p className="text-subtle">
        Track my{" "}
        <a className="font-sans text-accent" href="/watchlist/progress/">
          progress
        </a>
        .
      </p>
    </>
  );
}
