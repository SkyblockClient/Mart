<script lang="ts">
  import { Button } from "m3-svelte";
  import Defaults from "./Defaults.svelte";
  import { map } from "./structure";

  export let mods: any[];
  export let packs: any[];
  export let modsInstalled: string[];
  export let packsInstalled: string[];
  export let installMod: (file: string, url: string) => void;
  export let installPack: (file: string, url: string) => void;

  $: data = map(mods, packs, modsInstalled, packsInstalled);
  $: defaultItems = [...data.bundles, ...data.mods, ...data.packs].filter(
    (i) => i.enabled
  );
</script>

<div class="content">
  <h2 class="m3-font-headline-small">Get started</h2>
  <Defaults items={defaultItems} />
  <!-- <div style="height: 10rem; display: flex; gap: 1rem">
    <div
      style="background-color: rgb(var(--m3-scheme-primary-container)); padding: 1rem 1.25rem; border-radius: 1.75rem; width: 12rem; flex-grow: 1"
    >
      Utility Bundle
    </div>
    <div
      style="background-color: rgb(var(--m3-scheme-secondary-container)); padding: 1rem 1.25rem; border-radius: 1.75rem; width: 10rem; flex-grow: 1"
    >
      OptiFine
    </div>
    <div
      style="background-color: rgb(var(--m3-scheme-surface-container-high)); padding: 1rem; border-radius: 1.75rem; width: 6.5rem; flex-grow: 1"
    >
      1.14 Default
    </div>
    <div
      style="background-color: rgb(var(--m3-scheme-surface-container)); padding: 1rem; border-radius: 1.75rem"
    >
      ...
    </div>
  </div>
  <Button type="filled">Install defaults</Button>
  {#each lBundle.filter((b) => b.enabled) as b}
    <p>{b.display}</p>
  {/each}
  {#each lMod.filter((m) => m.enabled) as m}
    <p>{m.display}</p>
  {/each}
  {#each lPack.filter((p) => p.enabled) as p}
    <p>{p.display}</p>
  {/each} -->
</div>

<style>
  .content {
    width: min(40rem, calc(100vw - 8rem));
    align-self: center;
  }
  h2 {
    margin: 0 0 2rem 0;
  }
  /* h2 {
    margin: 0 0 2rem 0;
  }
  p {
    margin: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
    width: min(100ch, calc(100vw - 8rem));
    align-self: center;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
  }
  .bundle {
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
    border-radius: 1.25rem;
  }
  .chips {
    display: flex;
    gap: 0.25rem;
    margin-top: auto;
  }
  .chips > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgb(var(--m3-scheme-surface-container-high));
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
  }
  .chips > div > :global(svg) {
    width: 1.125rem;
    height: 1.125rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    width: 100%;

    height: 2rem;
    transition: all 200ms;
  }
  label > img {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  label > b {
    white-space: nowrap;
  }
  label > span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 200ms;
    transform-origin: left;
  } */
</style>
