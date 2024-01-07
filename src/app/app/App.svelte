<script lang="ts">
  import { filesystem } from "@neutralinojs/lib";
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
  import Mart from "../mart/Mart.svelte";
  import { download } from "../lib/network";
  import { cache, isDirectory, separator } from "./neutralino";
  import ChooserApp from "./ChooserApp.svelte";
  import SetupApp from "./SetupApp.svelte";

  let snackbar: (data: SnackbarIn) => void;

  let state:
    | { page: "chooser" }
    | { page: "setup"; path: string }
    | {
        page: "mart";
        path: string;
        skyclient: string;
        mods: string;
        packs: string;
      } = {
    page: "chooser",
  };
  let mods: any[], packs: any[];
  window.mods.then((m: any[]) => (mods = m));
  window.packs.then((p: any[]) => (packs = p));

  let modsInstalled: Set<string> = new Set(),
    packsInstalled: Set<string> = new Set();

  const path = async (e: CustomEvent<string>) => {
    console.group("validating folder (app)...");
    try {
      const folderName = e.detail.split(/[/\\]/).pop();
      if (folderName != ".minecraft" && folderName != "minecraft") {
        snackbar({
          message: "Not a .minecraft folder",
        });
        console.groupEnd();
        return;
      }
      const type = await isDirectory(e.detail);
      if (type == undefined) {
        snackbar({
          message: "Doesn't exist",
        });
        console.groupEnd();
        return;
      } else if (type == false) {
        snackbar({
          message: "Not a folder",
        });
        console.groupEnd();
        return;
      }
      state = {
        page: "setup",
        path: e.detail,
      };
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  const next = async (e: CustomEvent<string>) => {
    console.group("opening mart (app)...");
    await Promise.allSettled([
      filesystem.createDirectory(`${e.detail}${separator}mods`),
      filesystem.createDirectory(`${e.detail}${separator}resourcepacks`),
    ]);
    state = {
      page: "mart",
      path: (state as { path: string }).path,
      skyclient: e.detail,
      mods: `${e.detail}${separator}mods`,
      packs: `${e.detail}${separator}resourcepacks`,
    };
    updateMods();
    updatePacks();
    console.groupEnd();
  };

  const listDir = async (path: string) => {
    const entries = await filesystem.readDirectory(path);

    const contents: Set<string> = new Set();
    for (const { entry } of entries) {
      if (entry == "." || entry == "..") continue;
      contents.add(entry);
    }
    return contents;
  };
  const downloadFile = async (url: string, path: string) => {
    const resp = await download(url);
    const bytes = await resp.arrayBuffer();
    await filesystem.writeBinaryFile(path, bytes);
    await filesystem.copyFile(path, await cache);
  };
  const updateMods = async () => {
    console.group("updating mods (app)...");
    // @ts-expect-error
    modsInstalled = await listDir(state.mods);
    console.groupEnd();
  };
  const updatePacks = async () => {
    console.group("updating packs (app)...");
    // @ts-expect-error
    packsInstalled = await listDir(state.packs);
    console.groupEnd();
  };
  const installMod = async (file: string, url: string) => {
    console.group("installing mod (app)...");
    // @ts-expect-error
    const location = `${state.mods}${separator}${file}`;
    try {
      filesystem.copyFile(`${await cache}${separator}${file}`, location);
    } catch {
      await downloadFile(url, location);
    }
    await updateMods();
    console.groupEnd();
  };
  const installPack = async (file: string, url: string) => {
    console.group("installing pack (app)...");
    // @ts-expect-error
    const location = `${state.packs}${separator}${file}`;
    try {
      filesystem.copyFile(`${await cache}${separator}${file}`, location);
    } catch {
      await downloadFile(url, location);
    }
    await updatePacks();
    console.groupEnd();
  };
</script>

{#if state.page == "chooser"}
  <div class="article">
    <h1 class="m3-font-headline-small">Choose your .minecraft folder</h1>
    <ChooserApp on:path={path} />
  </div>
{:else if state.page == "setup"}
  <div class="article">
    <h1 class="m3-font-headline-small">Set up SkyClient</h1>
    <SetupApp {state} on:next={next} />
  </div>
{:else if mods && packs}
  <h1
    class="m3-font-headline-small"
    style="height: 0; margin: 0; overflow: hidden;"
  >
    Mart
  </h1>
  <Mart
    {mods}
    {packs}
    {modsInstalled}
    {packsInstalled}
    {installMod}
    {installPack}
    on:updateMods={updateMods}
    on:updatePacks={updatePacks}
  />
{:else}
  <div class="article">
    <h1 class="m3-font-headline-small">Check your internet</h1>
    <p>Failed to load mods/packs</p>
  </div>
{/if}

<SnackbarAnim bind:show={snackbar} />

<style>
  .article {
    width: min(40rem, calc(100vw - 8rem));
    align-self: center;
  }
  h1 {
    margin: 0 0 2rem 0;
  }
  p {
    margin: 0;
  }
</style>
