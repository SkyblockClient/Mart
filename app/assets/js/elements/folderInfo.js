///<reference path="../api/base.js" />

class FolderInfo extends HTMLElement {
  constructor() {
    super();
  }
  async setupProfile(existingProfiles) {
    console.group("setting up profile");
    this.genCard(
      "sync",
      "Setting up your Skyclient profile...",
      "Mart is downloading Forge and making a Skyclient installation profile for you.",
      "setting-up"
    );
    try {
      const versionsFolder = await window.chosen.getFolder(
        "versions/1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
        true
      );
      const libsFolder = await window.chosen.getFolder(
        "libraries/net/minecraftforge/forge/1.8.9-11.15.1.2318-1.8.9",
        true
      );
      await versionsFolder.downloadToFile(
        "1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json",
        "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/forge/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json"
      );
      await libsFolder.downloadToFile(
        "forge-1.8.9-11.15.1.2318-1.8.9.jar",
        "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/forge/forge-1.8.9-11.15.1.2318-1.8.9.jar"
      );
      existingProfiles.profiles["skyclient"] = {
        created: new Date().toISOString(),
        gameDir: "./skyclient",
        icon: "Furnace_On",
        lastUsed: "1970-01-01T00:00:00.000Z",
        lastVersionId: "1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
        name: "SkyClient",
        type: "custom",
        javaArgs:
          "-Xmx4G -XX:+UseConcMarkSweepGC -XX:+CMSIncrementalMode -XX:-UseAdaptiveSizePolicy -Xmn2G",
      };
      await window.chosen.writeFile("launcher_profiles.json", JSON.stringify(existingProfiles));
      await window.chosen.getFolder("skyclient", true);
      this.genCard(
        "check",
        "Your Skyclient profile was successfully set up!",
        "Everything *should* be in place for you to launch Skyclient (other than the mods)!"
      );
    } catch (e) {
      console.error(e);
      this.genCard(
        "warning",
        "Something went wrong setting up your Skyclient profile",
        "An error happened while setting up your Skyclient profile. DM KTibow#3960 about this. " +
          "Anyway, you'll need to make a new installation manually."
      );
    }
    this.querySelector("#setting-up").remove();
    console.groupEnd();
  }
  genCard(icon, title, content, id) {
    this.append(html`
      <div class="bg-neutral-800 rounded-md my-4 p-4" id="${id}">
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
      !["SkyClient", "skyclientskyclientskyclientskycl", "skyclientskyclientbutuuidformart"].some(
        (p) => existingProfiles?.profiles[p]
      )
    ) {
      this.genCard(
        "warning",
        "You don't have a Skyclient installation",
        "You don't have a Skyclient installation. You'll need one to play Skyclient." +
          `<button class="bg-emerald-600 text-white p-2 rounded-md">Click here to make one</button>`,
        "no-skyclient"
      );
      this.querySelector("#no-skyclient button").addEventListener("click", async () => {
        await this.setupProfile(existingProfiles);
      });
    } else if (hasSkyclientFolder) {
      this.genCard(
        "check",
        "Your Skyclient folder was already set up.",
        "We found an existing Skyclient folder, so we won't create a new one. " +
          "If you want to start from scratch, " +
          `<button class="bg-emerald-600 hover:bg-emerald-800 text-white p-2 rounded-md">click here to reset Skyclient</button>.`,
        "already-set-up"
      );
      this.querySelector("#already-set-up button").addEventListener("click", async () => {
        await window.chosen.deleteFolder("skyclient");
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
  el("main").innerHTML = `
    <h1 class="text-3xl">3. Choose what you want in Skyclient</h1>
    <p class="mt-2">Click on a mod/pack to add/remove it. It'll add/remove it as soon as you click on it, there's no install button.</p>
    <skyclient-stuff class="mt-2"></skyclient-stuff>
  `;
  el("#next").remove();
};
customElements.define("folder-info", FolderInfo);
