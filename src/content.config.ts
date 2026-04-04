import { castAndCrew } from "./collections/castAndCrew";
import { collections as collectionsLoader } from "./collections/collections";
import { overrated } from "./collections/overrated";
import { pages } from "./collections/pages";
import { reviewedTitles } from "./collections/reviewedTitles";
import { reviews } from "./collections/reviews";
import { alltimeStats, yearStats } from "./collections/stats";
import { underrated } from "./collections/underrated";
import { underseen } from "./collections/underseen";
import { viewingLog } from "./collections/viewingLog";
import { viewings } from "./collections/viewings";
import { watchlistProgress } from "./collections/watchlistProgress";
import { watchlistTitles } from "./collections/watchlistTitles";

// bust-cache

export const collections = {
  alltimeStats,
  castAndCrew,
  collections: collectionsLoader,
  overrated,
  pages,
  reviewedTitles,
  reviews,
  underrated,
  underseen,
  viewingLog,
  viewings,
  watchlistProgress,
  watchlistTitles,
  yearStats,
};
