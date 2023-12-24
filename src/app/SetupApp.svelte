<script lang="ts">
  import { filesystem } from "@neutralinojs/lib";
  import { createEventDispatcher } from "svelte";
  import {
    isDirectory,
    recursivelyCreate,
    recursivelyDelete,
    separator,
  } from "./neutralino";
  import Setup from "./Setup.svelte";

  export let state: {
    page: "setup";
    path: string;
  };
  let mode: "unknown" | "minecraft" | undefined;
  let profileStatus: "yes" | "no" | "loading" | undefined;
  let folderStatus: "yes" | "no" | "loading" | undefined;
  let profiles: any;
  const dispatch = createEventDispatcher();
  const skyclient = `${state.path}${separator}skyclient`;

  const load = async () => {
    console.group("checking folder (app)...");
    try {
      try {
        profiles = JSON.parse(
          await filesystem.readFile(
            `${state.path}${separator}launcher_profiles.json`
          )
        );
      } catch {
        mode = "unknown";
        console.groupEnd();
        return;
      }

      mode = "minecraft";
      profileStatus = [
        "SkyClient",
        "skyclient",
        "skyclientskyclientskyclientskycl",
        "skyclientskyclientbutuuidformart",
      ].some((p) => profiles.profiles[p])
        ? "yes"
        : "no";
      folderStatus = (await isDirectory(skyclient)) ? "yes" : "no";
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  load();

  const createProfile = async () => {
    const downloadForgeJson = async () => {
      const p = recursivelyCreate(state.path, [
        "versions",
        "1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
      ]);
      const resp = await fetch(
        "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/forge/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json",
        {
          cache: "force-cache",
        }
      );
      const respBytes = await resp.arrayBuffer();
      await p;
      await filesystem.writeBinaryFile(
        `${state.path}${separator}versions${separator}1.8.9-forge1.8.9-11.15.1.2318-1.8.9${separator}1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json`,
        respBytes
      );
    };
    const downloadForgeJar = async () => {
      const p = recursivelyCreate(state.path, [
        "libraries",
        "net",
        "minecraftforge",
        "forge",
        "1.8.9-11.15.1.2318-1.8.9",
      ]);
      const resp = await fetch(
        "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/forge/forge-1.8.9-11.15.1.2318-1.8.9.jar",
        {
          cache: "force-cache",
        }
      );
      const respBytes = await resp.arrayBuffer();
      await p;
      await filesystem.writeBinaryFile(
        `${state.path}${separator}libraries${separator}net${separator}minecraftforge${separator}forge${separator}1.8.9-11.15.1.2318-1.8.9${separator}forge-1.8.9-11.15.1.2318-1.8.9.jar`,
        respBytes
      );
    };
    const create = async () => {
      profiles.profiles["skyclient"] = {
        created: new Date().toISOString(),
        gameDir: skyclient,
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAACGFjVEwAAAAEAAAAAHzNZtAAAAAzUExURf//ACOQY5HbaR68c////11dXXR0dIWFhc3fbNDq6T09PWG/5j+Y2KjQ2Sdyxtrq+k2b5npKrGcAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAgAAAAIAAAAAAAAAAAAAIAGQAAK+px9AAAAKZSURBVHja7ZvpbgIxDISBQrcFerz/0zYjZarp4F0OocYgz5898PEhWXESwmp1Rpuu1SgVQAqAl6Z7QNwUowCGAjA5tO6as/1o2nbN2cD/KogCSAHw1kSAyBkJ37u2IrdjISNeATwGAI0pFqFCeFJ9xr0mp28BPAaAFgyTR4ORJ8RgxIL0ePBjvALID8CEdGBTigqRTQjXpYZGv4uaUQEMBWASB4Cu+hZN9Hf4Rf8CGArAAUgHjY2In9Pm0ma2NhVAXgBNxORaOFpMDqBBdSLDGK4CyAegAw+LzZuIBtOEXMDqQiYqQC3yE4gCGA5AZx94IgB/1k0MHbAiAIUogDwAPvlgIUUTCW9IGlQ3tebswkIsgKEAvhDVhYgaewKfYCxBRfEKIDdAFMATfDYduw5NHlhjaAG6TQGMB9Aiigowak6HrqMIQOcAfGJaADkA9Mckbxo6yXBnbEyxALExOTW9NvkEdG5h8pu8AFIAvHbtm2iw69JnJCEUN6gBgPupC3G0APmecXgPuwLIB4AkgNBgfO8AKED+YIFBaBLBZjIhDu8RqwByAfAFr2qsACww3HMQggBAnyiGxqHNn5VxAQwHIAQKUAtPA3hgAqAIcaWv20UxCyA3AAPwfglAC3HfpXb6pXaicKe8AIYDQAxARzpPgTQ5RH9PHsUsgLwACqEAPpnAFQ2IC1QCeGNjMj/oUgC5AQhBZwb0SaoCQJE/Dzb5gTc/6FQAuQD8gJo2kQiAEEsHnVVnD0AXwFCAr6bogOrOhALTRhQBePF5zALIB6AfRgOIN6nvprmByAuRg4/GPWlKBTAcwJPqM5uHTjKRlBtUOiG5WQUwHEAhzk0cdZOqAJ4L4BqxOAGw9Ae3AnhOgGiy8a8QBXBPgB9G8drRaA0Z2QAAABpmY1RMAAAAAQAAABQAAAA8AAAANAAAADwACABkAAETQ/wcAAAAWmZkQVQAAAACeNq1kzEOACAIAx1cjMT/P9eSSCLqJOU2joVAKQOUk6BUOmBLRUAFLLkX2mTIbNg3u7ZEkExssS4UQZmZ1WcQPmXGf9rAbvCgNCELlrRwNRCUEzPhDNF8OvhOAAAAGmZjVEwAAAADAAAAFAAAAEgAAAA4AAAAOAAIAGQCAb6WRGwAAABrZmRBVAAAAAR42s2TQQ6AIAwEOXgxEv//XEvCmmK97Zg4F8L0AC1L60F78kN5BtuEkkewCEB+0f8elKIpx+W1klKFMXBCitdBm5JEQ1ADhMxBKwVTkpTHAmQOGCVzYJdDAamA3Z/NlGXjyQth3xPxgCBbFQAAABpmY1RMAAAABQAAABQAAABEAAAANAAAADwACABkAAHaykukAAAAc2ZkQVQAAAAGeNq1lDEKwDAMAz10KS39/3MrDxIu2SrllphzII5xUjcocAKtpmRwgN5wgYR8QMuaBCQPUPGmZOEdq3hTdsBmMJmQJCl5CTXZlDtYGhyWSphykpI9tEvWlDsKnoP7OfSn5FDNB+bKiT4AT76lBBmhtuxsJwAAABh0RVh0U29mdHdhcmUAZ2lmMmFwbmcuc2YubmV0lv8TyAAAAABJRU5ErkJggg==",
        lastUsed: "1970-01-01T00:00:00.000Z",
        lastVersionId: "1.8.9-forge1.8.9-11.15.1.2318-1.8.9",
        name: "SkyClient",
        type: "custom",
        javaArgs:
          "-Xmx4G -XX:+UseConcMarkSweepGC -XX:+CMSIncrementalMode -XX:-UseAdaptiveSizePolicy -Xmn2G",
      };
      await filesystem.writeFile(
        `${state.path}${separator}launcher_profiles.json`,
        JSON.stringify(profiles)
      );
    };
    console.group("creating profile (app)...");
    try {
      profileStatus = "loading";
      await Promise.all([create(), downloadForgeJson(), downloadForgeJar()]);
      profileStatus = "yes";
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  const deleteFolder = async () => {
    console.group("deleting skyclient folder (app)...");
    try {
      folderStatus = "loading";
      await recursivelyDelete(`${state.path}${separator}skyclient`);
      folderStatus = "no";
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  const createFolder = async () => {
    console.group("creating skyclient folder (app)...");
    try {
      folderStatus = "loading";
      await filesystem.createDirectory(`${state.path}${separator}skyclient`);
      folderStatus = "yes";
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  const next = async () => {
    let path = state.path;
    if (mode == "minecraft" && (await isDirectory(skyclient))) {
      path = skyclient;
    }
    dispatch("next", path);
  };
</script>

<Setup
  {mode}
  {profileStatus}
  {folderStatus}
  on:createProfile={createProfile}
  on:deleteFolder={deleteFolder}
  on:createFolder={createFolder}
  on:next={next}
/>
