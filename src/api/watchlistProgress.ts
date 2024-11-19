import {
  type WatchlistProgressJson,
  watchlistProgressJson,
} from "./data/watchlistProgressJson";

export type WatchlistProgress = WatchlistProgressJson & {};

export async function watchlistProgress(): Promise<WatchlistProgress> {
  return await watchlistProgressJson();
}
