///<reference path="../api/base.js" />
import { doesFileExistNL, SEPARATOR } from "../api/fileApi.js";
export const renderFolderChooserApp = async (elem) => {
  const options = html` <ul></ul> `;
  const detectedOptions = await recommendPaths();
  detectedOptions.forEach((instance) => {
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
  const detected = options.firstChild;

  const customOption = html`
    <li>
      <input type="radio" name="folder" value="" />
      <span class="text-gray-200"></span>
      <button
        class="bg-nord10 hover:bg-nord10/70 transition-all text-white p-2 rounded-md"
      >
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
    const folder = await Neutralino.os.showFolderDialog(
      "Choose your .minecraft folder"
    );
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
        Also, if you're using a MultiMC-based launcher, make a new 1.8.9 Forge instance first.
      </div>
    </div>
  `;
  elem.append(options);
};

const checkInstance = async (path) => {
  const instances = await Neutralino.filesystem.readDirectory(path);
  const instanceWork = instances.map(async (dir) => {
    if (
      dir.entry.startsWith(".") ||
      dir.entry.startsWith("_") ||
      dir.type != "DIRECTORY"
    )
      return;
    const instancePath = path + SEPARATOR + dir.entry;
    try {
      const config = await Neutralino.filesystem.readFile(
        instancePath + SEPARATOR + "mmc-pack.json"
      );
      const configJson = JSON.parse(config);
      if (
        configJson.components.some(
          (c) =>
            c.cachedName == "Forge" &&
            c.cachedRequires.some((r) => r.equals == "1.8.9")
        )
      )
        return instancePath + SEPARATOR + ".minecraft";
    } catch (e) {
      console.error(e);
    }
  });
  const instancesProc = await Promise.all(instanceWork);
  return instancesProc.filter((i) => i);
};
const recommendPaths = async () => {
  let pathsFound;
  if (NL_OS == "Linux") {
    const home = await Neutralino.os.getEnv("HOME");
    pathsFound = [
      [true, home + "/.local/share/PolyMC/instances"],
      [true, home + "/.local/share/PrismLauncher/instances"],
      [
        true,
        home +
          "/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher/instances",
      ],
      [false, home + "/.minecraft"],
      [false, home + "/.var/app/com.mojang.Minecraft/data/minecraft"],
    ];
  } else if (NL_OS == "Windows") {
    const data = await Neutralino.os.getPath("data");
    pathsFound = [
      [true, data + "\\PrismLauncher\\instances"],
      [true, data + "\\PolyMC\\instances"],
      [false, data + "\\.minecraft"],
    ];
  } else {
    const data = await Neutralino.os.getPath("data");
    pathsFound = [[false, data + "/minecraft"]];
  }
  pathsFound = await Promise.all(
    pathsFound.map(async (path) => [...path, await doesFileExistNL(path[1])])
  );
  pathsFound = pathsFound.filter((path) => path[2]);

  let availablePaths = [];
  await Promise.all(
    pathsFound.map(async (path) => {
      if (path[0]) {
        availablePaths.push(...(await checkInstance(path[1])));
        return;
      }
      availablePaths.push(path[1]);
    })
  );
  return availablePaths;
};
