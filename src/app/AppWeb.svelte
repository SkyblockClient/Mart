<script lang="ts">
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
  import ChooserWeb from "./ChooserWeb.svelte";
  import WebUnsupported from "./WebUnsupported.svelte";
  import SetupWeb from "./SetupWeb.svelte";

  let snackbar: (data: SnackbarIn) => void;

  const showDirectoryPicker = window.showDirectoryPicker as
    | typeof window.showDirectoryPicker
    | undefined;
  let state:
    | { page: "chooser" }
    | { page: "setup"; handle: FileSystemDirectoryHandle } = {
    page: "chooser",
  };

  const handle = (e: CustomEvent<FileSystemHandle>) => {
    console.group("validating folder (web)...");
    const h = e.detail;
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
</script>

{#if state.page == "chooser"}
  <div class="article">
    <h2 class="m3-font-headline-small">Choose your .minecraft folder</h2>
    {#if showDirectoryPicker}
      <ChooserWeb {showDirectoryPicker} on:handle={handle} />
    {:else}
      <WebUnsupported />
    {/if}
  </div>
{:else if state.page == "setup"}
  <div class="article">
    <h2 class="m3-font-headline-small">Set up SkyClient</h2>
    <SetupWeb {state} />
  </div>
{/if}

<SnackbarAnim bind:show={snackbar} />

<style>
  .article {
    width: min(40rem, calc(100vw - 6rem));
    align-self: center;
    margin: 0 2rem;
  }
  h2 {
    margin: 0 0 2rem 0;
  }
</style>
