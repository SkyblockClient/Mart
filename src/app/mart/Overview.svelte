<script lang="ts">
  import {
    Button,
    CircularProgressIndeterminate,
    Dialog,
    Icon,
  } from "m3-svelte";
  import iconSearch from "@ktibow/iconset-ic/search";
  import iconMagic from "@ktibow/iconset-ic/outline-auto-fix-high";
  import iconGame from "@ktibow/iconset-ic/outline-sports-esports";
  import iconPlus from "@ktibow/iconset-ic/outline-add";
  import iconMinus from "@ktibow/iconset-ic/outline-minus";

  export let isVanilla: boolean;
  export let data: {
    bundles: {
      id: any;
      title: any;
      categories: string[];
      installed: boolean;
      deps: {
        file: any;
        url: any;
      }[];
    }[];
    mods: {
      id: any;
      title: any;
      categories: string[];
      installed: boolean;
      file: any;
      url: any;
    }[];
    packs: {
      id: any;
      title: any;
      categories: string[];
      installed: boolean;
      file: any;
      url: any;
    }[];
  };
  export let installItem: (id: string) => Promise<void>;
  export let deleteItem: (id: string) => Promise<void>;

  let working: Set<string> = new Set();
  const installCategory = async (category: string) => {
    try {
      working.add(category);
      working = working;
      const tasks = [];
      for (const bundle of data.bundles) {
        if (bundle.installed) continue;
        if (bundle.categories.includes(category))
          tasks.push(installItem(bundle.id));
      }
      for (const mod of data.mods) {
        if (mod.installed) continue;
        if (mod.categories.includes(category)) tasks.push(installItem(mod.id));
      }
      for (const pack of data.packs) {
        if (pack.installed) continue;
        if (pack.categories.includes(category))
          tasks.push(installItem(pack.id));
      }
      await Promise.all(tasks);
    } finally {
      working.delete(category);
      working = working;
    }
  };
  const removeCategory = async (category: string) => {
    try {
      working.add(category);
      working = working;
      const tasks = [];
      for (const bundle of data.bundles) {
        if (!bundle.installed) continue;
        if (bundle.categories.includes(category))
          tasks.push(deleteItem(bundle.id));
      }
      for (const mod of data.mods) {
        if (!mod.installed) continue;
        if (mod.categories.includes(category)) tasks.push(deleteItem(mod.id));
      }
      for (const pack of data.packs) {
        if (!pack.installed) continue;
        if (pack.categories.includes(category)) tasks.push(deleteItem(pack.id));
      }
      await Promise.all(tasks);
    } finally {
      working.delete(category);
      working = working;
    }
  };

  let search = "";

  let dialogRecommended = false;
</script>

<div class="row">
  <Icon icon={iconSearch} />
  <input bind:value={search} />
  <button on:click={() => (dialogRecommended = true)}>
    <Icon icon={iconMagic} />
    Add recommended
  </button>
</div>
{#if isVanilla}
  <div class="tip">
    <Icon icon={iconGame} />
    <h2 class="m3-font-headline-small">Prep your game</h2>
    <p class="m3-font-body-medium">
      Get started with SkyClient by adding the default mods.<br />You can always
      change them later.
    </p>
    <Button type="filled" on:click={() => (dialogRecommended = true)}>
      Add defaults
    </Button>
  </div>
{/if}
<Dialog headline="Add mods" closeOnEsc={false} bind:open={dialogRecommended}>
  <div class="table">
    {#each Object.entries( { Defaults: "Defaults", Skyblock: "Recommended Skyblock", PvP: "Recommended PvP" } ) as [title, category]}
      {@const installed = [...data.bundles, ...data.mods, ...data.packs]
        .filter((i) => i.categories.includes(category))
        .every((i) => i.installed)}
      <div class="table-row">
        {title}
        {#if working.has(category)}
          <CircularProgressIndeterminate />
        {:else if installed}
          <Button
            type="tonal"
            iconType="full"
            on:click={() => removeCategory(category)}
          >
            <Icon icon={iconMinus} />
          </Button>
        {:else}
          <Button
            type="filled"
            iconType="full"
            on:click={() => installCategory(category)}
          >
            <Icon icon={iconPlus} />
          </Button>
        {/if}
      </div>
    {/each}
  </div>
  <div slot="buttons">
    <Button type="text" on:click={() => (dialogRecommended = false)}>
      Close
    </Button>
  </div>
</Dialog>

<style>
  h2,
  p {
    margin: 0;
  }

  .row {
    display: flex;
    height: 3.5rem;
    gap: 1rem;

    position: relative;
  }

  .row > :global(svg) {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    top: 1rem;
    left: 1rem;

    pointer-events: none;
  }
  .row > input {
    padding: 0 1rem 0 3.5rem;
    flex-grow: 1;
    border-radius: 3.5rem;

    border: none;
    font: inherit;
    color: inherit;
    min-width: 6.5rem; /* 3.5rem left + 2rem space + 1rem right = 6.5rem */
    background-color: rgb(var(--m3-scheme-surface-container));
  }
  .row > button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1.1875rem;
    border-radius: 3.5rem;

    border: none;
    background-color: rgb(var(--m3-scheme-surface-container));
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: all 200ms;
  }
  .row > button:hover {
    background-color: rgb(var(--m3-scheme-surface-container-high));
  }
  .row > button > :global(svg) {
    width: 1.125rem;
    height: 1.125rem;
  }

  .tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;

    background-color: rgb(var(--m3-scheme-surface-container-high));
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
  .tip > :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(var(--m3-scheme-secondary));
    flex-shrink: 0;
  }
  .tip > p {
    color: rgb(var(--m3-scheme-on-surface-variant));
  }
  .tip > :global(button) {
    margin-top: 0.5rem;
  }

  .table {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .table-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .table-row > :global(svg) {
    width: 2.5rem;
    height: 2.5rem;
  }
</style>
