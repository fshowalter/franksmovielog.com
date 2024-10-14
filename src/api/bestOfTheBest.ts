import {
  allBestOfTheBestJson,
  type BestOfTheBestJson,
} from "./data/bestOfTheBestJson";

export type BestOfTheBestTitle = {} & BestOfTheBestJson;

type BestOfTheBest = {
  bestOfTheBest: BestOfTheBestTitle[];
  distinctGenres: string[];
  distinctReleaseYears: string[];
};

export async function allBestOfTheBest(): Promise<BestOfTheBest> {
  const bestOfTheBestJson = await allBestOfTheBestJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();

  const bestOfTheBest = bestOfTheBestJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.year);

    return {
      ...title,
    };
  });

  return {
    bestOfTheBest: bestOfTheBest,
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
  };
}
