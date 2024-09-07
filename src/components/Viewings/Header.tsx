import { PageTitle } from "src/components/PageTitle";

export function Header({
  viewingCount,
}: {
  viewingCount: number;
}): JSX.Element {
  return (
    <>
      <PageTitle className="text-center">Viewing Log</PageTitle>
      <div className="spacer-y-2" />
      <q className="block text-center text-subtle">
        We have such sights to show you.
      </q>
      <div className="spacer-y-8" />
      <div className="text-center text-subtle">
        <p>
          Since 2012, I&apos;ve watched{" "}
          <span className="text-emphasis">{viewingCount.toLocaleString()}</span>{" "}
          movies.
        </p>
      </div>
      <div className="h-4 min-h-4" />
      <p className="text-subtle">
        See more{" "}
        <a className="font-sans text-accent" href="/viewings/stats/">
          stats
        </a>
        .
      </p>
    </>
  );
}
