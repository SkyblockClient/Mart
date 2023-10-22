<script lang="ts">
  import Icon from "@iconify/svelte";
  import iconPlus from "@iconify-icons/ic/add";
  import iconCheck from "@iconify-icons/ic/check";
  import { filesystem, os } from "@neutralinojs/lib";
  import { storage, separator, isDirectory } from "./neutralino";
  import { Button } from "m3-svelte";
  import { createEventDispatcher } from "svelte";

  let recommendations: string[] | undefined;
  let path: string;
  let customPath: string | undefined;
  const loadCustomPath = async () => {
    customPath = await storage.customPath;
  };
  const listPaths = async () => {
    if (NL_OS == "Linux") {
      const home = await os.getEnv("HOME");
      return {
        instances: [
          `${home}/.local/share/PolyMC/instances`,
          `${home}/.local/share/PrismLauncher/instances`,
          `${home}/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher/instances`,
        ],
        minecrafts: [
          `${home}/.minecraft`,
          `${home}/.var/app/com.mojang.Minecraft/data/minecraft`,
        ],
      };
    } else if (NL_OS == "Windows") {
      const data = await os.getPath("data");
      return {
        instances: [
          `${data}\\PrismLauncher\\instances`,
          `${data}\\PolyMC\\instances`,
        ],
        minecrafts: [`${data}\\.minecraft`],
      };
    } else {
      const data = await os.getPath("data");
      return { instances: [], minecrafts: [`${data}/minecraft`] };
    }
  };
  const loadPaths = async () => {
    const { instances, minecrafts } = await listPaths();

    const output: string[] = [];
    const loadInstances = async (p: string) => {
      let contents: filesystem.DirectoryEntry[];
      try {
        contents = await filesystem.readDirectory(p);
      } catch {
        return;
      }
      const tasks = contents
        .filter(
          (c) =>
            c.type == "DIRECTORY" &&
            !c.entry.startsWith(".") &&
            !c.entry.startsWith("_")
        )
        .map(async (c) => {
          const config = await filesystem.readFile(
            `${p}${separator}${c.entry}${separator}mmc-pack.json`
          );
          const configJson = JSON.parse(config);
          if (
            configJson.components.some(
              (c: any) =>
                c.cachedName == "Forge" &&
                c.cachedRequires.some((r: any) => r.equals == "1.8.9")
            )
          )
            output.push(`${p}${separator}${c.entry}${separator}.minecraft`);
        });
      await Promise.all(tasks);
      recommendations = output;
    };
    const loadMinecraft = async (p: string) => {
      if (!(await isDirectory(p))) return;
      output.push(p);
      recommendations = output;
    };

    console.group("getting recommendations (app)...");
    try {
      recommendations = [];
      await Promise.all([
        ...instances.map(loadInstances),
        ...minecrafts.map(loadMinecraft),
      ]);
      path = path || recommendations[0];
    } catch (e) {
      console.error(e);
    }
    console.groupEnd();
  };
  loadCustomPath();
  loadPaths();

  const dispatch = createEventDispatcher();
  const choosePath = async () => {
    const folder = await os.showFolderDialog("Choose your .minecraft folder");
    if (!folder) return;
    customPath = folder;
    path = folder;
    storage.customPath = folder;
  };
</script>

{#if recommendations}
  <div class="qa">
    <p>Using MultiMC/PolyMC/Prism?</p>
    <p>Make a new Forge 1.8.9 instance and use its .minecraft folder</p>
  </div>
  <form on:submit|preventDefault={() => dispatch("path", path)}>
    <div class="chooser">
      {#each recommendations as r}
        <label class:selected={path == r}>
          <input type="radio" name="paths" value={r} bind:group={path} />
          {r}
        </label>
      {/each}
      {#if customPath}
        <label class:selected={path == customPath}>
          <input
            type="radio"
            name="paths"
            value={customPath}
            bind:group={path}
          />
          {customPath}
        </label>
      {/if}
      <button type="button" on:click={choosePath}>
        <Icon icon={iconPlus} />
      </button>
    </div>
    <Button
      type="filled"
      iconType="left"
      disabled={!path}
      extraOptions={{
        class:
          "m3-container m3-font-label-large filled icon-left confirm-button",
      }}
    >
      <Icon icon={iconCheck} />
      Confirm
    </Button>
  </form>
{:else}
  <p>...</p>
{/if}

<style>
  .chooser {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  form {
    display: contents;
  }

  label,
  button {
    display: flex;
    align-items: center;
    background-color: rgb(var(--m3-scheme-surface-container));
    height: 2.5rem;
    border-radius: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  label {
    padding: 0 1rem;
    flex-grow: 1;
  }
  label.selected {
    background-color: rgb(var(--m3-scheme-primary-container));
    color: rgb(var(--m3-scheme-on-primary-container));
    border-radius: 0.75rem;
  }
  button {
    justify-content: center;
    border: none;
    width: 2.5rem;
  }
  button :global(svg) {
    width: 1rem;
    height: 1rem;
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  :global(.confirm-button) {
    margin-top: 2rem;
    width: 100%;
  }

  p {
    margin: 0;
  }
  .qa {
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
    border-radius: 1.25rem;
    margin-bottom: 2rem;
  }
  .qa > :first-child {
    margin-bottom: 0.2rem;
  }
</style>
