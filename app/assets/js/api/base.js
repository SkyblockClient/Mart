const html = (literals, ...substitutions) => {
  let result = "";
  for (let i = 0; i < substitutions.length; i++) {
    result += literals[i];
    result += substitutions[i];
  }
  result += literals[literals.length - 1];
  const elem = document.createRange().createContextualFragment(result.trim()).firstChild;
  return elem;
};
/** @returns {Element} */
const el = (thing) => document.querySelector(thing);
const IS_NEUTRALINO = Boolean(window.NL_PORT);
const susStorage = new Proxy(
  {},
  {
    get: async (target, key) => {
      if (IS_NEUTRALINO) {
        try {
          return JSON.parse(await Neutralino.storage.getData(key));
        } catch (e) {}
      } else {
        return localStorage.getItem(key);
      }
    },
    set: async (target, key, value) => {
      if (IS_NEUTRALINO) {
        return await Neutralino.storage.setData(key, JSON.stringify(value));
      } else {
        return localStorage.setItem(key, value);
      }
    },
    deleteProperty: async (target, key) => {
      if (IS_NEUTRALINO) {
        return await Neutralino.storage.setData(key, null);
      } else {
        return localStorage.removeItem(key);
      }
    },
  }
);
const susCacheAPI = {
  open: async (key) => {
    if (IS_NEUTRALINO) {
      return await susCache(key);
    }
    return await window.caches.open(key);
  },
};
const susCache = async (key) => {
  const SEPARATOR = NL_OS === "Windows" ? "\\" : "/";
  const cacheDir = (await Neutralino.os.getPath("cache")) + SEPARATOR + "Mart" + key;
  try {
    await Neutralino.filesystem.getStats(cacheDir);
  } catch (e) {
    await Neutralino.filesystem.createDirectory(cacheDir);
  }
  return {
    match: async (url) => {
      try {
        const urlFile = cacheDir + SEPARATOR + encodeURIComponent(url);
        console.debug(`susCache: looking for ${url}`);
        const contents = await Neutralino.filesystem.readBinaryFile(urlFile);
        console.debug(`susCache: ${url} is cached`, contents);
        return new Response(contents);
      } catch (e) {}
    },
    /**
     *
     * @param {string} url
     * @param {Response} response
     */
    put: async (url, response) => {
      try {
        const urlFile = cacheDir + SEPARATOR + encodeURIComponent(url);
        const contents = await response.arrayBuffer();
        console.debug(`susCache: caching ${url}`, contents);
        await Neutralino.filesystem.writeBinaryFile(urlFile, contents);
      } catch (e) {}
    },
  };
};
window.dlLocks = [];
