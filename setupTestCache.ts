import type { IFS } from "unionfs";

import { fs as memFs, vol } from "memfs";
import realFs from "node:fs";
import { tmpdir } from "node:os";
import { Union } from "unionfs";
import { beforeEach, vi } from "vitest";

// Create a union filesystem that overlays memfs on top of the real filesystem
// This allows cache operations to go to memory while other operations go to disk
const ufs = new Union();

// Add real filesystem first (lower priority)
ufs.use(realFs);

// Add memfs second (higher priority - will override real fs for matching paths)

ufs.use(memFs as unknown as IFS);

// Create promise versions of the unionfs methods
type AsyncFn<T extends unknown[], R> = (...args: T) => Promise<R>;
type CallbackFn<T extends unknown[], R> = (
  ...args: [...T, (err: Error | null, result?: R) => void]
) => void;

const promisify = <T extends unknown[], R>(
  fn: CallbackFn<T, R>,
): AsyncFn<T, R> => {
  return (...args: T) =>
    new Promise((resolve, reject) => {
      fn(...args, (err: Error | null, result?: R) => {
        if (err) reject(err);
        else resolve(result as R);
      });
    });
};

// Mock node:fs/promises to use our union filesystem
vi.mock("node:fs/promises", () => {
  return {
    access: promisify(ufs.access.bind(ufs)),
    default: {
      access: promisify(ufs.access.bind(ufs)),
      mkdir: promisify(ufs.mkdir.bind(ufs)),
      readdir: promisify(ufs.readdir.bind(ufs)),
      readFile: promisify(ufs.readFile.bind(ufs)),
      rmdir: promisify(ufs.rmdir.bind(ufs)),
      stat: promisify(ufs.stat.bind(ufs)),
      unlink: promisify(ufs.unlink.bind(ufs)),
      writeFile: promisify(ufs.writeFile.bind(ufs)),
    },
    mkdir: promisify(ufs.mkdir.bind(ufs)),
    readdir: promisify(ufs.readdir.bind(ufs)),
    readFile: promisify(ufs.readFile.bind(ufs)),
    rmdir: promisify(ufs.rmdir.bind(ufs)),
    stat: promisify(ufs.stat.bind(ufs)),
    unlink: promisify(ufs.unlink.bind(ufs)),
    writeFile: promisify(ufs.writeFile.bind(ufs)),
  };
});

// Reset memfs volume before each test to clean cache
beforeEach(() => {
  vol.reset();
  // Pre-create the temp directory structure for cache
  const tempDir = tmpdir();
  vol.mkdirSync(tempDir, { recursive: true });
});
