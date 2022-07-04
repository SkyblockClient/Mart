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
    Promise.all(
      window.mods.map(async (modData) => {
        if (modData.hidden) return;
        if (modData.packages) {
          const bundle = new Bundle(modData, window.mods);
          if (bundle.category != this.category) return;
          const bundleTag = renderBundle(bundle);
          optionArea.appendChild(bundleTag);
        } else {
          const mod = new Mod(modData);
          if (mod.category != this.category) return;
          const modTag = await renderMod(mod, window.chosenGameRoot);
          optionArea.appendChild(modTag);
        }
      })
    );
  }
  /*
    this.classList.add(
      "max-h-[32rem]",
      "overflow-auto",
      "p-4",
      "m-4",
      "bg-neutral-800",
      "rounded-md",
      "border-emerald-600",
      "border-2"
    );
    const packArea = html`
      <div class="grid gap-8 mt-8"></div>
    `;
    for (const pack of allPacksJSON) {
      const packTag = await renderPack(pack, this);
      if (!packTag) continue;
      packArea.appendChild(packTag);
    }
    this.appendChild(packArea);
  }
}
const renderPack = async (pack, elem) => {
  const packData = new Pack(pack);
  if (packData.hidden) return;
  if (packData.category != elem.getAttribute("category")) return;
  const packTag = html`
    <div class="bg-neutral-800 rounded-md shadow-neumorphism p-2 relative">
      <p class="text-lg font-bold">
        <span id="iconSpace" class="mti text-green-400"></span>
        ${packData.name}
      </p>
      <p class="text-sm">${packData.description}</p>
    </div>
  `;
  if (packData.screenshot) {
    packTag.appendChild(html`
      <img
        class="rounded-md w-full max-h-32 object-cover object-bottom"
        src="${packData.screenshot}"
      />
    `);
  }
  const packsFolder = await window.chosenGameRoot.getFolder("resourcepacks", true);
  if (await packsFolder.doesFileExist(packData.fileName)) {
    packTag.classList.add("shadow-neumorphism-pressed");
    packTag.querySelector("#iconSpace").innerHTML = "check";
  }
  packTag.addEventListener("click", async () => {
    try {
      if (packTag.classList.contains("shadow-neumorphism-pressed")) {
        packTag.querySelector("#iconSpace").innerHTML = "sync";
        await packsFolder.deleteFile(packData.fileName);
        packTag.classList.remove("shadow-neumorphism-pressed");
        packTag.querySelector("#iconSpace").innerHTML = "";
      } else {
        packTag.querySelector("#iconSpace").innerHTML = "sync";
        await packsFolder.downloadToFile(packData.fileName, packData.fileURL, () => {
          packTag.querySelector("#iconSpace").innerHTML = "downloading";
        });
        packTag.classList.add("shadow-neumorphism-pressed");
        packTag.querySelector("#iconSpace").innerHTML = "check";
      }
    } catch (e) {
      console.error(e);
      packTag.querySelector("#iconSpace").innerHTML = "error";
    }
  });
  return packTag;*/
}
customElements.define("skyclient-stuff", SkyclientStuff);
