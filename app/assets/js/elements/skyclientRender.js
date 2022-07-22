///<reference path="../api/base.js" />
export const renderChooser = (clickAction, defaultSelected) => {
  const chooser = html`
    <div class="rounded-md border-2 border-emerald-600 inline-flex flex-grow flex-row mr-2"></div>
  `;
  for (let category of ["Skyblock", "PvP", "Other"]) {
    const optionTag = html`
      <div
        class="hover:bg-emerald-800 bg-opacity-50 cursor-pointer transition-all
        border-2 border-emerald-600 justify-center p-2 flex flex-1"
        data-category="${category}"
      >
        ${category}
      </div>
    `;
    optionTag.addEventListener("click", clickAction.bind(null, category, chooser));
    chooser.append(optionTag);
  }
  clickAction(defaultSelected, chooser);
  return chooser;
};
export const optionArea = html`
  <div
    class="absolute left-0 right-0 justify-center flex flex-row flex-wrap gap-4 mt-4"
    id="optionArea"
  ></div>
`;
export const renderMod = async (mod, installed) => {
  const modTag = html`
    <div
      class="bg-neutral-800 inline-block relative w-[calc(50vw_-_2rem)] lg:w-[calc(25vw_-_1.5rem)] rounded-md cursor-pointer p-2"
      id="mod-${mod.id}"
    >
      <p class="text-3xl font-bold"><span class="mti"></span>${mod.name}</h3>
      <p>${mod.description}</p>
      <br />
      <p class="text-sm absolute bottom-2">By <img src="${mod.authorIcon}" class="inline-block w-4 h-4"/> ${mod.author}</p>
    </div>
  `;
  const isSelected = installed ?? (await mod.isModInstalled(window.chosenGameRoot));
  if (window.dlLocks.includes(mod.fileName)) {
    modTag.querySelector("span").innerText = "downloading";
  }
  if (isSelected) {
    modTag.classList.replace("bg-neutral-800", "bg-emerald-800");
    modTag.querySelector("span").innerText = "check";
  }
  modTag.addEventListener("click", async () => {
    if (isSelected) {
      console.log(`${new Date().toISOString()}: uninstalling mod ${mod.name}`);
      await mod.removeMod(window.chosenGameRoot);
      console.log(`${new Date().toISOString()}: uninstalled mod ${mod.name}`);
      modTag.replaceWith(await renderMod(mod, false));
    } else {
      console.log(`${new Date().toISOString()}: installing mod ${mod.name}`);
      modTag.querySelector("span").innerText = "downloading";
      await mod.installMod(window.chosenGameRoot);
      console.log(`${new Date().toISOString()}: installed mod ${mod.name}`);
      modTag.replaceWith(await renderMod(mod, true));
    }
  });
  return modTag;
};
export const renderBundle = async (bundle) => {
  const mods = await bundle.installedMods(window.chosenGameRoot);
  const bundleTag = html`
    <div
      class="bg-neutral-800 flex flex-col w-[calc(50vw_-_2rem)] lg:w-[calc(25vw_-_1.5rem)] rounded-md cursor-pointer p-2"
      id="bundle-${bundle.id}"
    >
      <p class="text-3xl font-bold"><span class="mti"></span>${bundle.name}</h3>
      <p><img src="${bundle.icon}" class="inline-block w-4 h-4"/> ${bundle.description}</p>
      <div class="border-teal-500 border-4 p-2 rounded-md mt-auto cursor-default">
        <p class="text-sm font-bold">
          ${bundle.packages.length} mods
        </p>
        <ul class="text-sm">
        ${mods
          .map(
            (mod) => `
              <li title="${mod.desc}" data-tippy-placement="right" class="table">
                <input type="checkbox" id="bundle-${mod.id}" ${
              mod.installed ? "checked" : ""
            } class="cursor-pointer" />
                ${mod.name}
              </li>
              `
          )
          .join("")}
        </ul>
      </div>
    </div>
  `;
  if (mods.every((mod) => mod.installed)) {
    bundleTag.classList.replace("bg-neutral-800", "bg-emerald-800");
    bundleTag.querySelector("span").innerText = "check";
  }
  bundleTag.addEventListener("click", async () => {
    if (mods.every((mod) => mod.installed)) {
      console.log(`${new Date().toISOString()}: uninstalling bundle ${bundle.name}`);
      await Promise.all(
        mods.map(async (mod) => {
          await bundle.removeMod(window.chosenGameRoot, mod);
        })
      );
      console.log(`${new Date().toISOString()}: uninstalled bundle ${bundle.name}`);
      bundleTag.replaceWith(await renderBundle(bundle));
    } else {
      console.log(`${new Date().toISOString()}: installing bundle ${bundle.name}`);
      bundleTag.querySelector("span").innerText = "downloading";
      await Promise.all(
        mods.map(async (mod) => {
          await bundle.installMod(window.chosenGameRoot, mod);
          bundleTag.querySelector(`#bundle-${mod.id}`).checked = true;
        })
      );
      console.log(`${new Date().toISOString()}: installed bundle ${bundle.name}`);
      bundleTag.replaceWith(await renderBundle(bundle));
    }
  });
  bundleTag.querySelector("div").addEventListener("click", (e) => e.stopPropagation());
  for (let mod of mods) {
    bundleTag.querySelector(`#bundle-${mod.id}`).addEventListener("click", async (e) => {
      e.preventDefault();
      if (mod.installed) {
        console.log(`${new Date().toISOString()}: uninstalling mod ${mod.name}`);
        await bundle.removeMod(window.chosenGameRoot, mod);
        console.log(`${new Date().toISOString()}: uninstalled mod ${mod.name}`);
        bundleTag.replaceWith(await renderBundle(bundle));
      } else {
        console.log(`${new Date().toISOString()}: installing mod ${mod.name}`);
        bundleTag.querySelector(`#bundle-${mod.id}`).replaceWith(
          html`
            <span class="mti">downloading</span>
          `
        );
        await bundle.installMod(window.chosenGameRoot, mod);
        console.log(`${new Date().toISOString()}: installed mod ${mod.name}`);
        bundleTag.replaceWith(await renderBundle(bundle));
      }
    });
  }
  return bundleTag;
};
export const renderPack = async (pack, installed) => {
  const packTag = html`
    <div
      class="bg-neutral-800 bg-cover inline-block relative w-[calc(50vw_-_2rem)] lg:w-[calc(25vw_-_1.5rem)] rounded-md cursor-pointer p-2"
    >
      <p class="text-3xl font-bold"><span class="mti"></span>${pack.name}</h3>
      <p>${pack.description}</p>
      <br />
      <p class="text-sm absolute bottom-2">By <img src="${pack.authorIcon}" class="inline-block w-4 h-4"/> ${pack.author}</p>
    </div>
  `;
  if (pack.screenshot) {
    packTag.style.backgroundImage = `url(${encodeURI(pack.screenshot)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")})`;
  }
  const isSelected = installed ?? (await pack.isPackInstalled(window.chosenGameRoot));
  if (window.dlLocks.includes(pack.fileName)) {
    packTag.querySelector("span").innerText = "downloading";
  }
  if (isSelected) {
    if (pack.screenshot) {
      packTag.style.backgroundBlendMode = "overlay";
      packTag.style.backgroundColor = "rgba(6, 95, 70, 0.9)";
    } else {
      packTag.classList.replace("bg-neutral-800", "bg-emerald-800");
    }
    packTag.querySelector("span").innerText = "check";
  } else if (pack.screenshot) {
    packTag.style.backgroundBlendMode = "darken";
    packTag.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }
  packTag.addEventListener("click", async () => {
    if (isSelected) {
      console.log(`${new Date().toISOString()}: uninstalling pack ${pack.name}`);
      await pack.removePack(window.chosenGameRoot);
      console.log(`${new Date().toISOString()}: uninstalled pack ${pack.name}`);
      packTag.replaceWith(await renderPack(pack, false));
    } else {
      console.log(`${new Date().toISOString()}: installing pack ${pack.name}`);
      packTag.querySelector("span").innerText = "downloading";
      await pack.installPack(window.chosenGameRoot);
      console.log(`${new Date().toISOString()}: installed pack ${pack.name}`);
      packTag.replaceWith(await renderPack(pack, true));
    }
  });
  return packTag;
};
