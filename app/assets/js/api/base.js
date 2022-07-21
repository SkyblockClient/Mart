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
window.dlLocks = [];
