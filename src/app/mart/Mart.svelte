<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "m3-svelte";
  import { map } from "./structure";
  import Overview from "./Overview.svelte";

  export let mods: any[];
  export let packs: any[];
  export let modsInstalled: Set<string>;
  export let packsInstalled: Set<string>;
  export let installMod: (file: string, url: string) => Promise<void>;
  export let deleteMod: (file: string) => Promise<void>;
  export let installPack: (file: string, url: string) => Promise<void>;
  export let deletePack: (file: string) => Promise<void>;
  const dispatch = createEventDispatcher();

  $: data = map(mods, packs, modsInstalled, packsInstalled);

  let activeInstalls = 0;

  const installItem = async (id: string) => {
    try {
      activeInstalls += 1;
      const mod = data.mods.find((m) => m.id == id);
      if (mod) {
        await installMod(mod.file, mod.url);
        return;
      }

      const pack = data.packs.find((p) => p.id == id);
      if (pack) {
        await installPack(pack.file, pack.url);
        return;
      }

      const bundle = data.bundles.find((b) => b.id == id);
      if (bundle) {
        await Promise.all(
          bundle.deps.map((dep) => installMod(dep.file, dep.url))
        );
        return;
      }
    } finally {
      activeInstalls -= 1;
    }

    console.error("unknown item", id);
  };
  const deleteItem = async (id: string) => {
    const mod = data.mods.find((m) => m.id === id);
    if (mod && mod.installed) {
      await deleteMod(mod.file);
      return;
    }

    const pack = data.packs.find((p) => p.id === id);
    if (pack && pack.installed) {
      await deletePack(pack.file);
      return;
    }

    const bundle = data.bundles.find((b) => b.id === id);
    if (bundle) {
      await Promise.all(bundle.deps.map((dep) => deleteMod(dep.file)));
      return;
    }
  };
  const clearAll = () => {
    for (const mod of modsInstalled) {
      deleteMod(mod);
    }
    for (const pack of packsInstalled) {
      deletePack(pack);
    }
  };
</script>

<div class="content">
  <Overview
    isVanilla={modsInstalled.size == 0}
    {data}
    {installItem}
    {deleteItem}
  />
  <div style="margin-top: 4rem; display: flex; gap: 1rem">
    <Button
      type="tonal"
      on:click={() => {
        dispatch("updateMods");
        dispatch("updatePacks");
      }}
    >
      Reload files
    </Button>
    <Button type="text" on:click={clearAll}>Delete all</Button>
  </div>
</div>
{#if activeInstalls}
  <div class="counter">
    {activeInstalls}
    {activeInstalls == 1 ? "install" : "installs"} in progress
  </div>
{/if}

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    width: min(40rem, calc(100vw - 8rem));
    align-self: center;
  }
  .counter {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;

    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }
</style>
