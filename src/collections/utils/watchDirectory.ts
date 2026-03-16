import type { LoaderContext } from "astro/loaders";

import path from "node:path";

/** Run sync() immediately, then re-run it whenever any file in dirPath changes. */
export async function watchDirectory(
  loaderContext: LoaderContext,
  directoryPath: string,
  sync: () => Promise<void>,
): Promise<void> {
  await sync();
  loaderContext.watcher?.add(directoryPath);
  loaderContext.watcher?.on("change", (changedPath) => {
    if (changedPath.startsWith(directoryPath + path.sep)) void sync();
  });
}
