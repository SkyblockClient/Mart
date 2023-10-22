<script lang="ts">
  import { SnackbarAnim, type SnackbarIn } from "m3-svelte";
  import ChooserApp from "./ChooserApp.svelte";
  import { filesystem } from "@neutralinojs/lib";
  import SetupApp from "./SetupApp.svelte";
  import { isDirectory } from "./neutralino";

  let snackbar: (data: SnackbarIn) => void;

  let state: { page: "chooser" } | { page: "setup"; path: string } = {
    page: "chooser",
  };

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
</script>

{#if state.page == "chooser"}
  <div class="article">
    <h2 class="m3-font-headline-small">Choose your .minecraft folder</h2>
    <ChooserApp on:path={path} />
  </div>
{:else if state.page == "setup"}
  <div class="article">
    <h2 class="m3-font-headline-small">Set up SkyClient</h2>
    <SetupApp {state} />
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
