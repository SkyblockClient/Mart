<script lang="ts">
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
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

  let modsInstalled: string[] = [],
    packsInstalled: string[] = [];

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

    const contents = [];
    for await (const file of handle.keys()) {
      contents.push(file);
    }
    return contents;
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
    // console.group("installing mod (web)...");
    // const respPromise = fetch(url);
    // const handlePromise = ((async () => {
    // const mods = await (state as {
    //   handle: FileSystemDirectoryHandle;
    //   skyclient: FileSystemDirectoryHandle;
    // }).skyclient.getDirectoryHandle("mods");
    // const handle = await mods.getFileHandle(file, { create: true });
    // return await handle.createWritable();
    // })())
    // const [resp, handle] = await Promise.all([respPromise, handlePromise]);
    // resp.body!.pipeTo(handle);
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
