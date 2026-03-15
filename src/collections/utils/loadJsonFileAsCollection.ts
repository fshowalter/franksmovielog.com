import type { LoaderContext } from "astro/loaders";

import { promises as fs } from "node:fs";

import { watchFile } from "./watchFile";

/** Load single file containing an array of JSON objects. */
export function loadJsonFileAsCollection({
  filePath,
  getId = (raw) => raw.id as string,
  loaderContext,
}: {
  filePath: string;
  getId?: (raw: Record<string, unknown>) => string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const entries = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
      string,
      unknown
    >[];

    const newIds = new Set<string>();

    for (const entry of entries) {
      const id = getId(entry);
      newIds.add(id);

      const digest = loaderContext.generateDigest(entry);

      if (
        loaderContext.store.has(id) &&
        loaderContext.store.get(id)?.digest === digest
      ) {
        return;
      }

      const data = await loaderContext.parseData({ data: entry, id });
      loaderContext.store.set({ data, digest, id });
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) loaderContext.store.delete(id);
    }
  };

  return watchFile(loaderContext, filePath, sync);
}
