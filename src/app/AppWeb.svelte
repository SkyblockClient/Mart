<script lang="ts">
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
  import { download } from "./lib/network";
  import WebUnsupported from "./WebUnsupported.svelte";
  import ChooserWeb from "./ChooserWeb.svelte";
  import SetupWeb from "./SetupWeb.svelte";
  import Mart from "./mart/Mart.svelte";

  let snackbar: (data: SnackbarIn) => void;

  const showDirectoryPicker = window.showDirectoryPicker as
    | typeof window.showDirectoryPicker
    | undefined;
  let state:
    | { page: "chooser" }
    | { page: "setup"; handle: FileSystemDirectoryHandle }
    | {
        page: "mart";
        handle: FileSystemDirectoryHandle;
        skyclient: FileSystemDirectoryHandle;
        mods: FileSystemDirectoryHandle;
        packs: FileSystemDirectoryHandle;
      } = {
    page: "chooser",
  };
  let mods: any[], packs: any[];
  window.mods.then((m: any[]) => (mods = m));
  window.packs.then((p: any[]) => (packs = p));

  let modsInstalled: Set<string> = new Set(),
    packsInstalled: Set<string> = new Set();

  const handle = (e: CustomEvent<FileSystemHandle>) => {
    console.group("validating folder (web)...");
    const h = e.detail;
    console.log(h);
    if (h.name != ".minecraft" && h.name != "minecraft") {
      snackbar({
        message: "Not a .minecraft folder",
      });
      console.groupEnd();
      return;
    }
    if (h.kind != "directory") {
      snackbar({
        message: "Not a folder",
      });
      console.groupEnd();
      return;
    }
    state = {
      page: "setup",
      handle: h as FileSystemDirectoryHandle,
    };
    console.groupEnd();
  };
  const next = async (e: CustomEvent<FileSystemDirectoryHandle>) => {
    console.group("opening mart (web)...");

    const [mods, packs] = await Promise.all([
      e.detail.getDirectoryHandle("mods", { create: true }),
      e.detail.getDirectoryHandle("resourcepacks", { create: true }),
    ]);
    state = {
      page: "mart",
      handle: (state as { handle: FileSystemDirectoryHandle }).handle,
      skyclient: e.detail,
      mods,
      packs,
    };
    updateMods();
    updatePacks();
    console.groupEnd();
  };

  const listDir = async (dir: string) => {
    // @ts-expect-error
    const handle = await state.skyclient.getDirectoryHandle(dir);

    const contents: Set<string> = new Set();
    for await (const file of handle.keys()) {
      contents.add(file);
    }
    return contents;
  };
  const downloadFile = async (url: string, handle: FileSystemFileHandle) => {
    const resp = await download(url);
    if (!resp.ok) {
      snackbar({
        message: `${resp.status} while downloading ${url.split("/").pop()}`,
      });
      throw new Error(resp.statusText);
    }
    await resp!.body!.pipeTo(await handle.createWritable());
  };
  const updateMods = async () => {
    console.group("updating mods (web)...");
    modsInstalled = await listDir("mods");
    console.groupEnd();
  };
  const updatePacks = async () => {
    console.group("updating packs (web)...");
    packsInstalled = await listDir("resourcepacks");
    console.groupEnd();
  };
  const installMod = async (file: string, url: string) => {
    console.log("installing mod", { file, url });
    const mods = await (
      state as {
        handle: FileSystemDirectoryHandle;
        skyclient: FileSystemDirectoryHandle;
      }
    ).skyclient.getDirectoryHandle("mods");
    const handle = await mods.getFileHandle(file, { create: true });

    await downloadFile(url, handle);
    await updateMods();
  };
  const deleteMod = async (file: string) => {
    console.log("deleting mod", file);
    const mods = await (
      state as {
        handle: FileSystemDirectoryHandle;
        skyclient: FileSystemDirectoryHandle;
      }
    ).skyclient.getDirectoryHandle("mods");

    await mods.removeEntry(file);
    await updateMods();
  };
  const installPack = async (file: string, url: string) => {
    console.log("installing pack", { file, url });
    const packs = await (
      state as {
        handle: FileSystemDirectoryHandle;
        skyclient: FileSystemDirectoryHandle;
      }
    ).skyclient.getDirectoryHandle("resourcepacks");
    const handle = await packs.getFileHandle(file, { create: true });

    await downloadFile(url, handle);
    await updatePacks();
  };
  const deletePack = async (file: string) => {
    console.log("deleting pack", file);
    const packs = await (
      state as {
        handle: FileSystemDirectoryHandle;
        skyclient: FileSystemDirectoryHandle;
      }
    ).skyclient.getDirectoryHandle("resourcepacks");

    await packs.removeEntry(file);
    await updatePacks();
  };
</script>

{#if state.page == "chooser"}
  <div class="article">
    <h1 class="m3-font-headline-small">Choose your .minecraft folder</h1>
    {#if showDirectoryPicker}
      <ChooserWeb {showDirectoryPicker} on:handle={handle} />
    {:else}
      <WebUnsupported />
    {/if}
  </div>
{:else if state.page == "setup"}
  <div class="article">
    <h1 class="m3-font-headline-small">Set up SkyClient</h1>
    <SetupWeb {state} on:next={next} />
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
    {deleteMod}
    {installPack}
    {deletePack}
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
