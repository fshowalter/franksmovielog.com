import { castAndCrew } from "./collections/castAndCrew";
import { collections as collectionsLoader } from "./collections/collections";
import { reviewedTitles } from "./collections/reviewedTitles";
import { reviews } from "./collections/reviews";
import { alltimeStats, yearStats } from "./collections/stats";
import { viewings } from "./collections/viewings";
import { watchlistProgress } from "./collections/watchlistProgress";
import { watchlistTitles } from "./collections/watchlistTitles";

export const collections = {
  alltimeStats,
  castAndCrew,
  collections: collectionsLoader,
  reviewedTitles,
  reviews,
  viewings,
  watchlistProgress,
  watchlistTitles,
  yearStats,
};
