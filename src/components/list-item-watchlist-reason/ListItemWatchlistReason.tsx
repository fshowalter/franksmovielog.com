import { toSentence } from "~/utils/toSentence";

/**
 * Displays the reason a title is on the watchlist based on cast, crew, or collections.
 * @param props - Component props
 * @param props.collectionNames - Names of collections the title belongs to
 * @param props.directorNames - Names of directors to watch
 * @param props.performerNames - Names of performers to watch
 * @param props.writerNames - Names of writers to watch
 * @returns Formatted sentence explaining watchlist inclusion
 */
export function ListItemWatchlistReason({
  collectionNames,
  directorNames,
  performerNames,
  writerNames,
}: {
  collectionNames: readonly string[];
  directorNames: readonly string[];
  performerNames: readonly string[];
  writerNames: readonly string[];
}): React.JSX.Element {
  const credits = [
    ...formatPeopleNames(directorNames, "directed"),
    ...formatPeopleNames(performerNames, "performed"),
    ...formatPeopleNames(writerNames, [
      "has a writing credit",
      "have writing credits",
    ]),
    ...formatCollectionNames(collectionNames),
  ];

  return (
    <div
      className={`
        font-sans text-sm leading-4 font-normal tracking-prose text-subtle
      `}
    >
      Because {toSentence(credits)}.
    </div>
  );
}

function formatCollectionNames(names: readonly string[]): string[] {
  if (names.length === 0) {
    return [];
  }

  const suffix = names.length > 1 ? "collections" : "collection";

  return [`it's in the ${toSentence(names)} ${suffix}`];
}

function formatPeopleNames(
  names: readonly string[],
  suffix: string | string[],
): string[] {
  if (names.length === 0) {
    return [];
  }

  let append;

  if (Array.isArray(suffix)) {
    append = names.length > 1 ? suffix[1] : suffix[0];
  } else {
    append = suffix;
  }

  return [`${toSentence(names)} ${append}`];
}
