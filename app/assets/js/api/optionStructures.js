export class Pack {
  constructor(data) {
    this.id = data.id;
    this.name = data.display;
    this.description = data.description;
    this.hidden = data.hidden;
    this.enabledByDefault = data.enabled;
    this.authorIcon = `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${data.icon}`;
    this.author = data.creator;
    this.screenshot = data.screenshot;
    this.fileName = data.file;
    this.fileURL =
      data.url ||
      `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs/${data.file}`;
    this.category = data.categories?.includes("1;All Skyblock")
      ? "Skyblock"
      : data.categories?.includes("3;All PvP")
      ? "PvP"
      : "Other";
  }
}
export class Mod {
  constructor(data) {
    this.id = data.id;
    this.name = data.display;
    this.description = data.description;
    this.hidden = data.hidden;
    this.enabledByDefault = data.enabled;
    this.authorIcon = `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${data.icon}`;
    this.author = data.creator;
    this.fileName = data.file;
    this.fileURL =
      data.url ||
      `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods/${data.file}`;
    this.category = data.categories?.includes("2;All Skyblock")
      ? "Skyblock"
      : data.categories?.includes("5;All PvP")
      ? "PvP"
      : "Other";
  }
  async isModInstalled(handle) {
    const modFolder = await handle.getFolder("mods", true);
    return await modFolder.doesFileExist(this.fileName);
  }
  async installMod(handle) {
    console.log(`${new Date().toISOString()}: getting folder mods`);
    const modFolder = await handle.getFolder("mods", true);
    console.log(`${new Date().toISOString()}: downloading file ${this.fileName}`);
    await modFolder.downloadToFile(this.fileName, this.fileURL);
  }
  async removeMod(handle) {
    console.log(`${new Date().toISOString()}: getting folder mods`);
    const modFolder = await handle.getFolder("mods", true);
    console.log(`${new Date().toISOString()}: deleting file ${this.fileName}`);
    await modFolder.deleteFile(this.fileName);
  }
}
export class Bundle {
  constructor(data, allMods) {
    this.id = data.id;
    this.name = data.display;
    this.description = data.description;
    this.hidden = data.hidden;
    this.enabledByDefault = data.enabled;
    this.icon = `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${data.icon}`;
    this.packages = data.packages.concat(this.id).map((id) => {
      const mod = allMods.find((mod) => mod.id == id);
      return {
        name: mod.file,
        url:
          mod.url ||
          `https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods/${mod.file}`,
      };
    });
    this.category = data.categories?.includes("2;All Skyblock")
      ? "Skyblock"
      : data.categories?.includes("5;All PvP")
      ? "PvP"
      : "Other";
  }
}
