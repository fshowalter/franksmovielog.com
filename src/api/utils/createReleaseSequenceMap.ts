import { collator } from "~/utils/collator";

export function createReleaseSequenceMap<
  TValue extends { imdbId: string; releaseDate: string },
>(values: TValue[]): Map<string, number> {
  const sortedValues = values.toSorted((a, b) => {
    return collator.compare(
      `${a.releaseDate}${a.imdbId}`,
      `${b.releaseDate}${b.imdbId}`,
    );
  });

  const releaseSequenceMap = new Map<string, number>();

  for (const [index, value] of sortedValues.entries()) {
    releaseSequenceMap.set(value.imdbId, index);
  }

  return releaseSequenceMap;
}
