import { filesystem, storage as nlStorage } from "@neutralinojs/lib";
import { parse, stringify } from "devalue";

export const separator = NL_OS == "Windows" ? "\\" : "/";
export const storage: Record<string, any> = new Proxy(
  {},
  {
    get: async (target, key) => {
      if (typeof key != "string") return undefined;
      try {
        return parse(await nlStorage.getData(key));
      } catch {}
    },
    // @ts-expect-error it's fine, promises are truthy
    set: async (target, key, value) => {
      if (typeof key != "string") return undefined;
      await nlStorage.setData(key, stringify(value));
    },
    // @ts-expect-error it's fine, promises are truthy
    deleteProperty: async (target, key) => {
      if (typeof key != "string") return undefined;
      // @ts-expect-error it's fine, we meant undefined
      await nlStorage.setData(key, undefined);
    },
  }
);
export const isFile = async (path: string) => {
  try {
    const stats = await filesystem.getStats(path);
    return stats.isFile;
  } catch {
    return undefined;
  }
};
export const isDirectory = async (path: string) => {
  try {
    const stats = await filesystem.getStats(path);
    return stats.isDirectory;
  } catch {
    return undefined;
  }
};
export const recursivelyCreate = async (base: string, parts: string[]) => {
  try {
    const state = await filesystem.getStats([base, ...parts].join(separator));
    if (state.isDirectory) return;
    else throw new Error("Not a directory");
  } catch {}
  const stack = [base];
  for (const part of parts) {
    stack.push(part);
    try {
      await filesystem.createDirectory(stack.join(separator));
    } catch {}
  }
};
export const recursivelyDelete = async (path: string) => {
  const contents = (await filesystem.readDirectory(path)).filter(
    (entry) => entry.entry != "." && entry.entry != ".."
  );
  await Promise.all(
    contents.map(async (entry) => {
      const entryPath = `${path}${separator}${entry.entry}`;
      if (entry.type == "FILE") {
        await filesystem.removeFile(entryPath);
      } else {
        await recursivelyDelete(entryPath);
      }
    })
  );
  await filesystem.removeDirectory(path);
};
