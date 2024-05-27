///<reference path="neutralino.js" />
export let SEPARATOR;
export let doesFileExistNL;
let CACHE_DIR;
let recursiveDeleteNL;
if (IS_NEUTRALINO) {
  console.debug("initialization (Neutralino global)");
  Neutralino.init();
  const globalCacheDir = await Neutralino.os.getPath("cache");
  SEPARATOR = globalCacheDir.includes("\\") ? "\\" : "/";
  CACHE_DIR = globalCacheDir + SEPARATOR + "MartJul21";
  try {
    await Neutralino.filesystem.createDirectory(CACHE_DIR);
  } catch (e) {}
  doesFileExistNL = async (path) => {
    console.debug(`doesFileExist (Neutralino global): checking if ${path} exists`);
    try {
      return await Neutralino.filesystem.getStats(path);
    } catch (e) {}
    return false;
  };
  recursiveDeleteNL = async (path) => {
    console.debug(`recursiveDelete (Neutralino global): deleting ${path}`);
    const contents = (await Neutralino.filesystem.readDirectory(path)).filter(
      (entry) => ![".", ".."].includes(entry.entry)
    );
    await Promise.all(
      contents.map(async (entry) => {
        const entryPath = path + SEPARATOR + entry.entry;
        if (entry.type == "FILE") {
          await Neutralino.filesystem.removeFile(entryPath);
        } else {
          await recursiveDeleteNL(entryPath);
        }
      })
    );
    await Neutralino.filesystem.removeDirectory(path);
  };
}
const downloadFile = async (url, path) => {
  console.log(`${new Date().toISOString()}: downloading file`);
  console.debug(`downloadFile (global): downloading ${url} to ${path}`);
  if (window.dlLocks.includes(path)) {
    console.debug(`downloadFile (global): already downloading ${path}`);
    return;
  }
  window.dlLocks.push(path);
  let response;
  try {
    response = await fetch(url, {
      cache: "force-cache",
      headers: { "User-Agent": "github.com/SkyblockClient (mart)" },
    });
  } catch (e) {
    console.debug("downloadFile (global): using proxy");
    response = await fetch("https://mart-proxy.polyfrost.workers.dev/?url=" + encodeURIComponent(url));
  }
  window.dlLocks.splice(window.dlLocks.indexOf(path), 1);
  console.log(`${new Date().toISOString()}: done downloading file`);
  return response;
};
export class AnchorWeb {
  constructor(handle) {
    console.debug("initialization (AnchorWeb):", handle);
    /** @type {FileSystemDirectoryHandle} */
    this.handle = handle;
  }
  async validate() {
    console.debug("validate (AnchorWeb)");
    const folderName = this.handle.name.toLowerCase();
    if (this.handle.kind != "directory") {
      return "You didn't choose a folder. Please choose a folder, not a file.";
    } else if (![".minecraft", "minecraft"].includes(folderName)) {
      return (
        "You didn't choose the Minecraft folder. You chose " +
        folderName +
        " instead. Please choose a folder named .minecraft (or minecraft on Mac)."
      );
    }
  }
  async doesFileExist(path) {
    console.debug(`doesFileExist (AnchorWeb): checking if ${path} exists`);
    try {
      await this.handle.getFileHandle(path);
      return true;
    } catch (e) {}
    return false;
  }
  async doesFolderExist(path) {
    console.debug(`doesFolderExist (AnchorWeb): checking if ${path} exists`);
    try {
      await this.handle.getDirectoryHandle(path);
      return true;
    } catch (e) {}
    return false;
  }
  async readFile(path) {
    console.debug(`readFile (AnchorWeb): reading ${path}`);
    const handle = await this.handle.getFileHandle(path);
    const file = await handle.getFile();
    return file.text();
  }
  async getFolder(path, create = false) {
    console.group(`getFolder (AnchorWeb): getting ${path} (create: ${create})`);
    let handle = this.handle;
    for (const part of path.split("/")) {
      console.log(`part: ${part}`);
      handle = await handle.getDirectoryHandle(part, { create });
    }
    console.groupEnd();
    return new AnchorWeb(handle);
  }
  async deleteFile(path) {
    console.debug(`deleteFile (AnchorWeb): deleting ${path}`);
    await this.handle.removeEntry(path);
  }
  async deleteFolder(path) {
    console.debug(`deleteFolder (AnchorWeb): deleting ${path}`);
    await this.handle.removeEntry(path, { recursive: true });
  }
  async downloadToFile(path, url) {
    const modCache = await window.caches.open("modcache-jun11-2022");
    console.log(`${new Date().toISOString()}: checking cache`);
    let resp = await modCache.match(url);
    if (!resp) {
      console.log(`${new Date().toISOString()}: did not find in cache`);
      resp = await downloadFile(url, path);
      if (!resp) return;
      console.log(`${new Date().toISOString()}: got data`);
      await modCache.put(url, resp.clone());
      console.log(`${new Date().toISOString()}: cached`);
    } else {
      console.log(`${new Date().toISOString()}: found in cache`);
    }
    const handle = await this.handle.getFileHandle(path, { create: true });
    const writable = await handle.createWritable();
    await resp.body.pipeTo(writable);
    console.log(`${new Date().toISOString()}: written`);
  }
  async writeFile(path, text) {
    console.debug(`writeFile (AnchorWeb): writing ${path}`);
    const handle = await this.handle.getFileHandle(path, { create: true });
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
  }
}
export class AnchorApp {
  constructor(path) {
    console.debug(`initialization (AnchorApp): ${path}`);
    /** @type {string} */
    this.path = path;
  }
  async validate() {
    console.debug("validate (AnchorApp)");
    const doesPathExist = await doesFileExistNL(this.path);
    const folderName = this.path.split("/").pop().split("\\").pop();
    if (!doesPathExist) {
      return "The path you chose doesn't exist. Please choose a valid path.";
    } else if (!doesPathExist.isDirectory) {
      return "The path you chose doesn't point to a directory. Please choose a valid path.";
    } else if (![".minecraft", "minecraft"].includes(folderName)) {
      return (
        "You didn't choose the Minecraft folder. You chose " +
        folderName +
        " instead. Please choose a folder named .minecraft (or minecraft on Mac)."
      );
    }
  }
  async doesFileExist(path) {
    console.debug(`doesFileExist (AnchorApp): checking if ${path} exists`);
    try {
      await Neutralino.filesystem.getStats(this.path + SEPARATOR + path);
      return true;
    } catch (e) {}
    return false;
  }
  async doesFolderExist(path) {
    console.group(`doesFolderExist (AnchorApp): checking if ${path} exists`);
    const result = await this.doesFileExist(path);
    console.groupEnd();
    return result;
  }
  async readFile(path) {
    console.debug(`readFile (AnchorApp): reading ${path}`);
    return await Neutralino.filesystem.readFile(this.path + SEPARATOR + path);
  }
  async getFolder(path, create = false) {
    // idea: skip checking if it already exists by lazy-creating it
    console.group(`getFolder (AnchorApp): getting ${path} (create: ${create})`);
    if (await this.doesFileExist(path)) {
      console.debug("getFolder (AnchorApp): the folder already exists");
      console.groupEnd();
      return new AnchorApp(this.path + SEPARATOR + path);
    }
    if (create) {
      console.debug(`getFolder (AnchorApp): the folder doesn't exist, recursively creating it`);
      let handle = this.path;
      for (const part of path.split(SEPARATOR)) {
        const newPath = handle + SEPARATOR + part;
        const doesAlreadyExist = await doesFileExistNL(newPath);
        console.log(
          `getFolder (AnchorApp): creating ${newPath} (already exists: ${doesAlreadyExist})`
        );
        if (!doesAlreadyExist) {
          await Neutralino.filesystem.createDirectory(newPath);
        }
        handle = newPath;
      }
      const newAnchor = new AnchorApp(handle);
      console.groupEnd();
      return newAnchor;
    }
    console.debug(`getFolder (AnchorApp): ${path} folder doesn't exist`);
    console.groupEnd();
    throw new Error("Folder doesn't exist");
  }
  async deleteFile(path) {
    console.debug(`deleteFile (AnchorApp): deleting ${path}`);
    await Neutralino.filesystem.removeFile(this.path + SEPARATOR + path);
  }
  async deleteFolder(path) {
    console.group(`deleteFolder (AnchorApp): deleting ${path}`);
    await recursiveDeleteNL(this.path + SEPARATOR + path);
    console.groupEnd();
  }
  async downloadToFile(path, url) {
    const cacheLoc = CACHE_DIR + SEPARATOR + encodeURIComponent(url);
    try {
      await Neutralino.filesystem.copyFile(cacheLoc, this.path + SEPARATOR + path);
      console.log(`${new Date().toISOString()}: found in cache, written`);
      return;
    } catch (e) {}
    const resp = await downloadFile(url, path);
    if (!resp) return;
    const bytes = await resp.arrayBuffer();
    console.log(`${new Date().toISOString()}: got buffer`);
    await Neutralino.filesystem.writeBinaryFile(this.path + SEPARATOR + path, bytes);
    console.log(`${new Date().toISOString()}: written`);
    await Neutralino.filesystem.copyFile(this.path + SEPARATOR + path, cacheLoc);
    console.log(`${new Date().toISOString()}: cached`);
  }
  async writeFile(path, text) {
    console.debug(`writeFile (AnchorApp): writing ${path}`);
    await Neutralino.filesystem.writeFile(this.path + SEPARATOR + path, text);
  }
}
