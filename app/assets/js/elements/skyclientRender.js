///<reference path="../api/base.js" />
export const renderChooser = (clickAction, defaultSelected) => {
  const chooser = html`
    <div class="rounded-md border-2 border-emerald-600 flex flex-row"></div>
  `;
  for (let category of ["Skyblock", "PvP", "Other"]) {
    const optionTag = html`
      <div
        class="hover:bg-emerald-900 bg-opacity-50 cursor-pointer
        border-2 border-emerald-600 justify-center p-2 flex flex-1"
        data-category="${category}"
      >
        ${category}
      </div>
    `;
    optionTag.addEventListener("click", clickAction.bind(null, category, chooser));
    chooser.appendChild(optionTag);
  }
  clickAction(defaultSelected, chooser);
  return chooser;
};
export const optionArea = html`
  <div
    class="absolute left-0 right-0 justify-center flex flex-row flex-wrap gap-4"
    id="optionArea"
  ></div>
`;
export const renderMod = async (mod, handle, installed) => {
  console.log(`${new Date().toISOString()}: rendering mod ${mod.name}`);
  const modTag = html`
    <div class="bg-neutral-800 inline-block relative w-[calc(50vw_-_2rem)] lg:w-[calc(25vw_-_1.5rem)] rounded-md cursor-pointer p-2">
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
      modTag.replaceWith(await renderMod(mod, handle, false));
    } else {
      console.log(`${new Date().toISOString()}: installing mod ${mod.name}`);
      modTag.querySelector("span").innerText = "downloading";
      await mod.installMod(window.chosenGameRoot);
      console.log(`${new Date().toISOString()}: installed mod ${mod.name}`);
      modTag.replaceWith(await renderMod(mod, handle, true));
    }
  });
  console.log(`${new Date().toISOString()}: rendered mod ${mod.name}`);
  return modTag;
};
export const renderBundle = (bundle, selected) => {
  const bundleTag = html`
    <div class="bg-neutral-800 inline-block w-[calc(50vw_-_2rem)] lg:w-[calc(25vw_-_1.5rem)] rounded-md cursor-pointer p-2">
      <p class="text-3xl font-bold"><span class="mti"></span>${bundle.name}</h3>
      <p><img src="${bundle.icon}" class="inline-block w-4 h-4"/> ${bundle.description}</p>
    </div>
  `;
  if (selected) {
    bundleTag.classList.add("bg-emerald-600");
    bundleTag.querySelector("span").innerText = "check";
  }
  return bundleTag;
};
