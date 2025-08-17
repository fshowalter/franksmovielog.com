import { vi } from "vitest";
import { fs as memFs, vol } from "memfs";
import { Union } from "unionfs";
import realFs from "node:fs";

// Create a union filesystem that overlays memfs on top of the real filesystem
// This allows cache operations to go to memory while other operations go to disk
const ufs = new Union();

// Add real filesystem first (lower priority)
ufs.use(realFs);

// Add memfs second (higher priority - will override real fs for matching paths)
ufs.use(memFs as any);

// Mock node:fs/promises to use our union filesystem
vi.mock("node:fs/promises", () => {
  // Create promise versions of the unionfs methods
  const promisify = (fn: Function) => {
    return (...args: any[]) =>
      new Promise((resolve, reject) => {
        fn(...args, (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
  };

  return {
    default: {
      mkdir: promisify(ufs.mkdir.bind(ufs)),
      readFile: promisify(ufs.readFile.bind(ufs)),
      writeFile: promisify(ufs.writeFile.bind(ufs)),
      access: promisify(ufs.access.bind(ufs)),
      stat: promisify(ufs.stat.bind(ufs)),
      readdir: promisify(ufs.readdir.bind(ufs)),
      unlink: promisify(ufs.unlink.bind(ufs)),
      rmdir: promisify(ufs.rmdir.bind(ufs)),
    },
    mkdir: promisify(ufs.mkdir.bind(ufs)),
    readFile: promisify(ufs.readFile.bind(ufs)),
    writeFile: promisify(ufs.writeFile.bind(ufs)),
    access: promisify(ufs.access.bind(ufs)),
    stat: promisify(ufs.stat.bind(ufs)),
    readdir: promisify(ufs.readdir.bind(ufs)),
    unlink: promisify(ufs.unlink.bind(ufs)),
    rmdir: promisify(ufs.rmdir.bind(ufs)),
  };
});

// Reset memfs volume before each test to clean cache
beforeEach(() => {
  vol.reset();
  // Pre-create the temp directory structure for cache
  const tmpdir = require("node:os").tmpdir();
  vol.mkdirSync(tmpdir, { recursive: true });
});