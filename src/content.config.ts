import { castAndCrew } from "./collections/castAndCrew";
import { collections as collectionsLoader } from "./collections/collections";
import { overrated } from "./collections/overrated";
import { reviewedTitles } from "./collections/reviewedTitles";
import { reviews } from "./collections/reviews";
import { alltimeStats, yearStats } from "./collections/stats";
import { underrated } from "./collections/underrated";
import { underseen } from "./collections/underseen";
import { viewings } from "./collections/viewings";
import { watchlistProgress } from "./collections/watchlistProgress";
import { watchlistTitles } from "./collections/watchlistTitles";

export const collections = {
  alltimeStats,
  castAndCrew,
  collections: collectionsLoader,
  overrated,
  reviewedTitles,
  reviews,
  underrated,
  underseen,
  viewings,
  watchlistProgress,
  watchlistTitles,
  yearStats,
};
