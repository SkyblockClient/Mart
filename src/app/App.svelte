<script lang="ts">
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
  import WebChooser from "./WebChooser.svelte";
  import WebUnsupported from "./WebUnsupported.svelte";

  let snackbar: (data: SnackbarIn) => void;
  export let neutralino: boolean;

  const showDirectoryPicker = window.showDirectoryPicker as
    | typeof window.showDirectoryPicker
    | undefined;
  let page = "chooser";

  const handle = (e: CustomEvent<FileSystemHandle>) => {
    const h = e.detail;
    if (h.kind != "directory") {
      snackbar({
        message: "Not a folder",
      });
      return;
    }
    if (h.name != ".minecraft" && h.name != "minecraft") {
      snackbar({
        message: "Not a .minecraft folder",
      });
      return;
    }
    console.log(h);
  };
</script>

{#if page == "chooser"}
  <div class="chooser">
    <h2 class="m3-font-headline-small">Choose your .minecraft folder</h2>
    {#if neutralino}
      TODO
    {:else if showDirectoryPicker}
      <WebChooser {showDirectoryPicker} on:handle={handle} />
    {:else}
      <WebUnsupported />
    {/if}
  </div>
{/if}

<SnackbarAnim bind:show={snackbar} />

<style>
  .chooser {
    width: min(40rem, calc(100vw - 6rem));
    align-self: center;
    margin: 0 2rem;
  }
  h2 {
    margin: 0 0 1rem 0;
  }
</style>
