import type { JSX } from "react";

import { toSentence } from "~/utils/toSentence";

export function WatchlistTitleSlug({
  collectionNames,
  directorNames,
  performerNames,
  writerNames,
}: {
  collectionNames: readonly string[];
  directorNames: readonly string[];
  performerNames: readonly string[];
  writerNames: readonly string[];
}): JSX.Element {
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
    <div className="font-sans text-xs leading-4 font-light text-subtle">
      Because {toSentence(credits)}.
    </div>
  );
}

function formatCollectionNames(names: readonly string[]): string | string[] {
  if (names.length === 0) {
    return "";
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
