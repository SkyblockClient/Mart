///<reference path="../api/base.js" />

import { Bundle, Mod, Pack } from "../api/optionStructures.js";
import {
  optionArea,
  renderBundle,
  renderChooser,
  renderMod,
  renderPack,
} from "./skyclientRender.js";

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
    this.append(optionArea);
    const chooser = html`
      <div class="flex mt-4"></div>
    `;
    chooser.append(
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
    chooser.append(
      html`
        <button
          class="bg-emerald-600 hover:bg-emerald-800 transition-all w-12 h-12 text-lg rounded-md mx-2"
          title="Add default mods"
          id="addDefault"
        >
          <span class="mti">library_add</span>
        </button>
      `
    );
    chooser.append(
      html`
        <button
          class="bg-amber-600 hover:bg-amber-800 transition-all w-12 h-12 text-lg rounded-md ml-2"
          title="Remove all mods"
          id="removeAll"
        >
          <span class="mti">delete</span>
        </button>
      `
    );
    chooser.querySelector("#addDefault").addEventListener("click", async () => {
      const dialog = html`
        <dialog
          class="fixed left-0 right-0 top-0 bottom-0 w-full h-full rounded-lg z-10 bg-neutral-800/70 backdrop-blur-md text-white text-center"
        >
          <span class="font-bold">Installing default mods...</span>
          <h2 class="text-3xl">
            <span id="progress">0</span>
            mods installed
          </h2>
        </dialog>
      `;
      document.body.append(dialog);
      dialog.showModal();
      await Promise.all(
        window.mods.map(async (modData) => {
          if (modData.hidden) return;
          if (modData.packages) {
            const bundle = new Bundle(modData, window.mods);
            if (!bundle.enabledByDefault) return;
            await Promise.all(
              bundle.packages.map(async (mod) => {
                await bundle.installMod(window.chosenGameRoot, mod);
                dialog.querySelector("#progress").innerText =
                  parseInt(dialog.querySelector("#progress").innerText) + 1;
                this.querySelector(`#bundle-${bundle.id}`).replaceWith(await renderBundle(bundle));
              })
            );
          } else {
            const mod = new Mod(modData);
            if (!mod.enabledByDefault) return;
            await mod.installMod(window.chosenGameRoot);
            dialog.querySelector("#progress").innerText =
              parseInt(dialog.querySelector("#progress").innerText) + 1;
            this.querySelector(`#mod-${mod.id}`).replaceWith(await renderMod(mod));
          }
        })
      );
      dialog.innerHTML = `
        <h2 class="text-3xl">Installed all default mods</h2>
        <button
          id="shut"
          class="bg-emerald-600 hover:bg-emerald-800 transition-all p-2 m-4 rounded-md"
          onclick="this.parentElement.close()"
        >
          Shut
        </button>
      `;
    });
    chooser.querySelector("#removeAll").addEventListener("click", async () => {
      if (
        !confirm(
          "Are you sure you want to delete all your mods? We won't delete their config, but we won't remember which ones you had."
        )
      )
        return;
      const dialog = html`
        <dialog
          class="fixed left-0 right-0 top-0 bottom-0 w-full h-full rounded-lg z-10 bg-neutral-800/70 backdrop-blur-md text-white text-center"
        >
          <span class="font-bold">Removing all mods...</span>
        </dialog>
      `;
      document.body.append(dialog);
      dialog.showModal();
      await window.chosenGameRoot.deleteFolder("mods");
      await window.chosenGameRoot.getFolder("mods", true);
      this.querySelector("#optionArea").innerHTML = "";
      await this.renderOptions();
      dialog.innerHTML = `
        <h2 class="text-3xl">Removed all mods</h2>
        <button
          id="shut"
          class="bg-emerald-600 hover:bg-emerald-800 transition-all p-2 m-4 rounded-md"
          onclick="this.parentElement.close()"
        >
          Shut
        </button>
      `;
    });
    this.prepend(chooser);
  }
  async renderOptions() {
    const optionArea = this.querySelector("#optionArea");
    await window.chosenGameRoot.getFolder("mods", true);
    await window.chosenGameRoot.getFolder("resourcepacks", true);
    const optionTags = await Promise.all(
      window.mods
        .map(async (modData) => {
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
        .concat(
          window.packs.map(async (packData) => {
            const pack = new Pack(packData);
            if (pack.category != this.category) return;
            return await renderPack(pack);
          })
        )
    );
    optionTags.forEach((tag) => {
      if (tag) optionArea.append(tag);
    });
  }
}
customElements.define("skyclient-stuff", SkyclientStuff);
