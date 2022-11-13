///<reference path="../api/base.js" />
import { doesFileExistNL, SEPARATOR } from "../api/fileApi.js";
export const renderFolderChooserApp = async (elem) => {
  const options = html`
    <ul></ul>
  `;
  const vanillaLauncherFolder =
    NL_OS === "Linux"
      ? (await Neutralino.os.getEnv("HOME")) + SEPARATOR + ".minecraft"
      : NL_OS === "Windows"
      ? (await Neutralino.os.getPath("data")) + SEPARATOR + ".minecraft"
      : (await Neutralino.os.getPath("data")) + SEPARATOR + "minecraft";
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
  const detectedInstances = await findPolyInstances();
  if (detectedInstances?.length > 0) {
    detectedInstances.forEach((instance) => {
      const option = html`
        <li>
          <label>
            <input type="radio" name="folder" value="${instance}" />
            ${instance}
          </label>
        </li>
      `;
      options.append(option);
    });
  }
  const detected = options.firstChild;

  const customOption = html`
    <li>
      <input type="radio" name="folder" value="" />
      <span class="text-gray-200"></span>
      <button class="bg-nord10 hover:bg-nord10/70 transition-all text-white p-2 rounded-md">
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
  elem.innerHTML = `
    <div class="bg-nord1 rounded-md my-4 p-4 flex gap-1">
      <span class="mti">info</span>
      <div class="inline-block">
        Your .minecraft folder is where your Minecraft installation is stored, and where SkyClient will be installed. (${
          detected ? "Mart found it for you." : "Choose it below."
        })
        <br />
        Also, if you're using MultiMC/PolyMC, make a new 1.8.9 Forge instance first.
      </div>
    </div>
  `;
  elem.append(options);
};

const checkPolyInstance = async (dir) => {
  if (dir.entry.startsWith(".") || dir.entry.startsWith("_") || dir.type != "DIRECTORY") return;
  const instancePath = polyPath + SEPARATOR + dir.entry;
  try {
    const config = await Neutralino.filesystem.readFile(
      instancePath + SEPARATOR + "mmc-pack.json"
    );
    const configJson = JSON.parse(config);
    if (
      configJson.components.some(
        (c) => c.cachedName == "Forge" && c.cachedRequires.some((r) => r.equals == "1.8.9")
      )
    )
      return instancePath + SEPARATOR + ".minecraft";
  } catch (e) {
    console.error(e);
  }
}

const findPolyInstances = async () => {
  let base_dir = NL_OS === "Linux" ? await Neutralino.os.getEnv("HOME") : 
    NL_OS === "Windows" ? await Neutralino.os.getPath("data") : null;
  if (!base_dir) return;
  let polyPaths =
    NL_OS === "Linux"
      ? [base_dir + "/.local/share/PolyMC/instances", base_dir + "/.local/share/PrismLauncher/instances"]
      : NL_OS === "Windows"
      ? [base_dir + "\\PolyMC\\instances", base_dir + "\\PrismLauncher\\instances"]
      : null;
  polyPaths = polyPaths.filter(async (path) => await doesFileExistNL(path));
  if (polyPaths.length == 0) return;
  let polyInstances = [];
  for (let polyPathIndex in polyPaths) {
    let polyPath = polyPaths[polyPathIndex];
    const instances = await Neutralino.filesystem.readDirectory(polyPath);
    const instanceWork = instances.map(checkPolyInstance);
    polyInstances.push(...await Promise.all(instanceWork))
  }
  return polyInstances.filter((d) => d);
};
