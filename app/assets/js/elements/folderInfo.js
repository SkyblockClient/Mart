///<reference path="../api/base.js" />

import { SEPARATOR } from "../api/fileApi.js";

class FolderInfo extends HTMLElement {
  constructor() {
    super();
  }
  async setupProfile(existingProfiles) {
    console.group("setting up profile");
    this.genCard(
      "sync",
      "Setting up your SkyClient profile...",
      "Mart is downloading Forge and making a SkyClient installation profile for you.",
      "setting-up"
    );
    try {
      // Setup Forge
      await Promise.all([
        (async () => {
          const versionsFolder = await window.chosen.getFolder(
            "versions/1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
            true
          );
          await versionsFolder.downloadToFile(
            "1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json",
            "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/forge/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json"
          );
        })(),
        (async () => {
          const libsFolder = await window.chosen.getFolder(
            "libraries/net/minecraftforge/forge/1.8.9-11.15.1.2318-1.8.9",
            true
          );
          await libsFolder.downloadToFile(
            "forge-1.8.9-11.15.1.2318-1.8.9.jar",
            "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/forge/forge-1.8.9-11.15.1.2318-1.8.9.jar"
          );
        })(),
      ]);
      // Find SkyClient folder path
      let skyclientFolderPath = window.chosen.path;
      if (!skyclientFolderPath) {
        const scProfileName = Object.keys(existingProfiles.profiles).find((profile) =>
          [
            "SkyClient",
            "skyclientskyclientskyclientskycl",
            "skyclient",
            "skyclientskyclientbutuuidformart",
          ].includes(profile)
        );
        const scProfile = existingProfiles.profiles[scProfileName];
        if (scProfile?.gameDir) {
          console.debug("using skyclient dir from other skyclient profile");
          skyclientFolderPath = scProfile.gameDir;
        }
      }
      if (!skyclientFolderPath) {
        try {
          const launcherSettings = JSON.parse(
            await window.chosen.readFile("launcher_settings.json")
          );
          const productLibDir = launcherSettings.productLibraryDir;
          if (productLibDir.endsWith("/products")) {
            console.debug("using skyclient dir from product library (chopped off products)");
            skyclientFolderPath = productLibDir.replace("/products", "");
          }
          if (productLibDir.includes("\\")) {
            console.debug("using skyclient dir from product library (chopped off after user)");
            skyclientFolderPath =
              productLibDir.split("\\").slice(0, 3).join("\\") + "\\AppData\\Roaming\\.minecraft";
          }
        } catch (e) {}
      }
      if (!skyclientFolderPath) {
        console.warn("using relative path");
        skyclientFolderPath = "./skyclient";
      }
      // Normalize it
      console.debug("obtained the skyclient folder path", skyclientFolderPath);
      const SEPARATOR_GUESS = SEPARATOR || (skyclientFolderPath.includes("\\") ? "\\" : "/");
      if (skyclientFolderPath.endsWith(SEPARATOR_GUESS)) {
        skyclientFolderPath = skyclientFolderPath.slice(0, -1);
      }
      if (!skyclientFolderPath.endsWith(SEPARATOR_GUESS + "skyclient")) {
        skyclientFolderPath += SEPARATOR_GUESS + "skyclient";
      }
      console.debug("normalized:", skyclientFolderPath);
      // Add the profile
      existingProfiles.profiles["skyclient"] = {
        created: new Date().toISOString(),
        gameDir: skyclientFolderPath,
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAACGFjVEwAAAAEAAAAAHzNZtAAAAAzUExURf//ACOQY5HbaR68c////11dXXR0dIWFhc3fbNDq6T09PWG/5j+Y2KjQ2Sdyxtrq+k2b5npKrGcAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAgAAAAIAAAAAAAAAAAAAIAGQAAK+px9AAAAKZSURBVHja7ZvpbgIxDISBQrcFerz/0zYjZarp4F0OocYgz5898PEhWXESwmp1Rpuu1SgVQAqAl6Z7QNwUowCGAjA5tO6as/1o2nbN2cD/KogCSAHw1kSAyBkJ37u2IrdjISNeATwGAI0pFqFCeFJ9xr0mp28BPAaAFgyTR4ORJ8RgxIL0ePBjvALID8CEdGBTigqRTQjXpYZGv4uaUQEMBWASB4Cu+hZN9Hf4Rf8CGArAAUgHjY2In9Pm0ma2NhVAXgBNxORaOFpMDqBBdSLDGK4CyAegAw+LzZuIBtOEXMDqQiYqQC3yE4gCGA5AZx94IgB/1k0MHbAiAIUogDwAPvlgIUUTCW9IGlQ3tebswkIsgKEAvhDVhYgaewKfYCxBRfEKIDdAFMATfDYduw5NHlhjaAG6TQGMB9Aiigowak6HrqMIQOcAfGJaADkA9Mckbxo6yXBnbEyxALExOTW9NvkEdG5h8pu8AFIAvHbtm2iw69JnJCEUN6gBgPupC3G0APmecXgPuwLIB4AkgNBgfO8AKED+YIFBaBLBZjIhDu8RqwByAfAFr2qsACww3HMQggBAnyiGxqHNn5VxAQwHIAQKUAtPA3hgAqAIcaWv20UxCyA3AAPwfglAC3HfpXb6pXaicKe8AIYDQAxARzpPgTQ5RH9PHsUsgLwACqEAPpnAFQ2IC1QCeGNjMj/oUgC5AQhBZwb0SaoCQJE/Dzb5gTc/6FQAuQD8gJo2kQiAEEsHnVVnD0AXwFCAr6bogOrOhALTRhQBePF5zALIB6AfRgOIN6nvprmByAuRg4/GPWlKBTAcwJPqM5uHTjKRlBtUOiG5WQUwHEAhzk0cdZOqAJ4L4BqxOAGw9Ae3AnhOgGiy8a8QBXBPgB9G8drRaA0Z2QAAABpmY1RMAAAAAQAAABQAAAA8AAAANAAAADwACABkAAETQ/wcAAAAWmZkQVQAAAACeNq1kzEOACAIAx1cjMT/P9eSSCLqJOU2joVAKQOUk6BUOmBLRUAFLLkX2mTIbNg3u7ZEkExssS4UQZmZ1WcQPmXGf9rAbvCgNCELlrRwNRCUEzPhDNF8OvhOAAAAGmZjVEwAAAADAAAAFAAAAEgAAAA4AAAAOAAIAGQCAb6WRGwAAABrZmRBVAAAAAR42s2TQQ6AIAwEOXgxEv//XEvCmmK97Zg4F8L0AC1L60F78kN5BtuEkkewCEB+0f8elKIpx+W1klKFMXBCitdBm5JEQ1ADhMxBKwVTkpTHAmQOGCVzYJdDAamA3Z/NlGXjyQth3xPxgCBbFQAAABpmY1RMAAAABQAAABQAAABEAAAANAAAADwACABkAAHaykukAAAAc2ZkQVQAAAAGeNq1lDEKwDAMAz10KS39/3MrDxIu2SrllphzII5xUjcocAKtpmRwgN5wgYR8QMuaBCQPUPGmZOEdq3hTdsBmMJmQJCl5CTXZlDtYGhyWSphykpI9tEvWlDsKnoP7OfSn5FDNB+bKiT4AT76lBBmhtuxsJwAAABh0RVh0U29mdHdhcmUAZ2lmMmFwbmcuc2YubmV0lv8TyAAAAABJRU5ErkJggg==",
        lastUsed: "1970-01-01T00:00:00.000Z",
        lastVersionId: "1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
        name: "SkyClient",
        type: "custom",
        javaArgs:
          "-Xmx4G -XX:+UseConcMarkSweepGC -XX:+CMSIncrementalMode -XX:-UseAdaptiveSizePolicy -Xmn2G",
      };
      // Save it
      await window.chosen.writeFile("launcher_profiles.json", JSON.stringify(existingProfiles));
      await window.chosen.getFolder("skyclient", true);
      this.genCard(
        "check",
        "Your SkyClient profile was successfully set up!",
        "Everything *should* be in place for you to launch SkyClient (other than the mods)!"
      );
    } catch (e) {
      console.error(e);
      this.genCard(
        "warning",
        "Something went wrong setting up your SkyClient profile",
        "An error happened while setting up your SkyClient profile. DM @ktibow about this. " +
          "Anyway, you'll need to make a new installation manually."
      );
    }
    this.querySelector("#setting-up").remove();
    console.groupEnd();
  }
  genCard(icon, title, content, id) {
    this.append(html`
      <div class="bg-nord1 rounded-md my-4 p-4" id="${id}">
        <span class="mti text-6xl float-left mr-4">${icon}</span>
        <h3 class="text-2xl">${title}</h3>
        ${content}
      </div>
    `);
  }
  async connectedCallback() {
    el("#next").innerHTML = "Invalid";
    const checkResult = await window.chosen.validate();
    if (checkResult) {
      this.genCard("report", "Folder issue", checkResult);
      return;
    }
    const hasVanillaProfiles = await window.chosen.doesFileExist("launcher_profiles.json");
    const existingProfiles =
      hasVanillaProfiles && JSON.parse(await window.chosen.readFile("launcher_profiles.json"));
    const hasSkyclientFolder = await window.chosen.doesFolderExist("skyclient");
    if (
      hasVanillaProfiles &&
      ![
        "SkyClient",
        "skyclient",
        "skyclientskyclientskyclientskycl",
        "skyclientskyclientbutuuidformart",
      ].some((p) => existingProfiles?.profiles[p])
    ) {
      this.genCard(
        "warning",
        "You don't have a SkyClient installation",
        "You'll need one to play SkyClient. If you already have one we didn't see, you can still use it. " +
          `<button class="bg-nord10 hover:bg-nord10/70 transition-all text-white p-2 rounded-md">Click here to make one</button>`,
        "no-skyclient"
      );
      this.querySelector("#no-skyclient button").addEventListener("click", async () => {
        await this.setupProfile(existingProfiles);
      });
    } else if (hasVanillaProfiles && hasSkyclientFolder) {
      this.genCard(
        "check",
        "Your SkyClient installation was already set up",
        `We found an existing SkyClient installation, so we won't create a new one. ` +
          "If you want to start from scratch, " +
          `<button class="bg-nord10 hover:bg-nord10/70 transition-all text-white p-2 rounded-md">click here to re-setup SkyClient</button>.`,
        "already-set-up"
      );
      this.querySelector("#already-set-up button").addEventListener("click", async () => {
        try {
          await window.chosen.deleteFolder("skyclient");
        } catch (e) {}
        await this.setupProfile(existingProfiles);
      });
    } else if (hasVanillaProfiles || hasSkyclientFolder) {
      this.genCard(
        "warning",
        "Your SkyClient installation isn't full",
        "You need both a SkyClient installation to launch it and a " +
          "SkyClient folder to store all of the stuff for it. You only have one of those. " +
          `<button class="bg-nord10 hover:bg-nord10/70 transition-all text-white p-2 rounded-md">Click here to re-setup SkyClient.</button>`,
        "partial-installation"
      );
      this.querySelector("#partial-installation button").addEventListener("click", async () => {
        try {
          await window.chosen.deleteFolder("skyclient");
        } catch (e) {}
        await this.setupProfile(existingProfiles);
      });
    } else {
      this.genCard(
        "info",
        "Not the vanilla launcher",
        "Mart couldn't find the launcher_profiles.json file. " +
          "This probably means you're using a third-party launcher. " +
          "If that's the case, you're ready to continue."
      );
    }
    el("#next").innerHTML = `
    <span class="font-bold">
      <span class="mti">arrow_forward</span>
      Next
    </span>
    `;
    window.nextStep = prepareForSkyclientPane;
  }
}
const prepareForSkyclientPane = async () => {
  window.chosenGameRoot = (await window.chosen.doesFolderExist("skyclient"))
    ? await window.chosen.getFolder("skyclient")
    : window.chosen;
  const usedSCBefore = await window.chosenGameRoot.doesFolderExist("mods");
  if (!usedSCBefore) await window.chosenGameRoot.getFolder("mods", true);
  el("main").innerHTML = `
    <h1 class="text-3xl">3. Choose what mods and packs you want in SkyClient</h1>
    <p class="mt-2">Click on a mod/pack to add/remove it. It'll add/remove it as soon as you click on it, there's no install button.</p>
    <skyclient-stuff class="mt-2" used-before="${usedSCBefore}"></skyclient-stuff>
  `;
  el("#next").remove();
};
customElements.define("folder-info", FolderInfo);
