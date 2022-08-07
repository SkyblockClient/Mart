///<reference path="../api/base.js" />
import { doesFileExistNL } from "../api/fileApi.js";
export const renderFolderChooserApp = async (elem) => {
  const options = html`
    <ul></ul>
  `;
  const vanillaLauncherFolder =
    NL_OS === "Linux"
      ? (await Neutralino.os.getEnv("HOME")) + "/.minecraft"
      : NL_OS === "Windows"
      ? (await Neutralino.os.getPath("data")) + "\\.minecraft"
      : (await Neutralino.os.getPath("data")) + "/minecraft";
  const detectedFolder = await doesFileExistNL(vanillaLauncherFolder);
  if (detectedFolder) {
    const option = html`
      <li>
        <label>
          <input type="radio" name="folder" value="${vanillaLauncherFolder}" />
          ${vanillaLauncherFolder}
        </label>
      </li>
    `;
    options.append(option);
  }
  const customOption = html`
    <li>
      <input type="radio" name="folder" value="" />
      <span class="text-gray-200"></span>
      <button class="bg-emerald-600 hover:bg-emerald-800 transition-all text-white p-2 rounded-md">
        Choose another folder
      </button>
    </li>
  `;
  const previousPath = await susStorage.chosenPath;
  if (previousPath) {
    customOption.querySelector("input").value = previousPath;
    customOption.querySelector("span").textContent = previousPath;
  }
  customOption.querySelector("button").addEventListener("click", async () => {
    const folder = await Neutralino.os.showFolderDialog("Choose your .minecraft folder");
    if (folder) {
      customOption.querySelector("input").checked = true;
      customOption.querySelector("input").value = folder;
      customOption.querySelector("span").textContent = folder;
    }
  });
  options.append(customOption);
  options.firstChild.querySelector("input").checked = true;
  elem.innerHTML =
    "Your .minecraft folder is where everything is stored. " +
    (detectedFolder ? "Mart found it for you.<br>" : "") +
    "Choose the .minecraft folder that you want to install SkyClient to.<br>" +
    "(If you're using MultiMC/PolyMC, make a new 1.8.9 Forge instance.)";
  elem.append(options);
};
