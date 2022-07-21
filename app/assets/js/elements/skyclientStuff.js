///<reference path="../api/base.js" />

import { Bundle, Mod } from "../api/optionStructures.js";
import { optionArea, renderBundle, renderChooser, renderMod } from "./skyclientRender.js";

const packsNetwork = fetch(
  "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs.json"
);
const modsNetwork = fetch(
  "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json"
);
packsNetwork.then((response) => response.json()).then((data) => (window.packs = data));
modsNetwork.then((response) => response.json()).then((data) => (window.mods = data));
class SkyclientStuff extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    this.appendChild(optionArea);
    this.prepend(
      renderChooser(async (category, chooser) => {
        if (this.category) {
          const previousCategory = chooser.querySelector(`[data-category="${this.category}"]`);
          previousCategory.classList.replace("bg-emerald-800", "bg-opacity-50");
        }
        this.category = category;
        const newCategory = chooser.querySelector(`[data-category="${this.category}"]`);
        newCategory.classList.replace("bg-opacity-50", "bg-emerald-800");
        this.querySelector("#optionArea").innerHTML = "";
        await this.renderOptions();
      }, "Other")
    );
  }
  async renderOptions() {
    const optionArea = this.querySelector("#optionArea");
    await window.chosenGameRoot.getFolder("mods", true);
    const optionTags = await Promise.all(
      window.mods.map(async (modData) => {
        if (modData.hidden) return;
        if (modData.packages) {
          const bundle = new Bundle(modData, window.mods);
          if (bundle.category != this.category) return;
          return await renderBundle(bundle);
        } else {
          const mod = new Mod(modData);
          if (mod.category != this.category) return;
          return await renderMod(mod);
        }
      })
    );
    optionTags.forEach((tag) => {
      if (tag) optionArea.appendChild(tag);
    });
  }
}
customElements.define("skyclient-stuff", SkyclientStuff);
