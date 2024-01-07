<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Defaults from "./Defaults.svelte";
  import { map } from "./structure";
  import { Button } from "m3-svelte";

  export let mods: any[];
  export let packs: any[];
  export let modsInstalled: Set<string>;
  export let packsInstalled: Set<string>;
  export let installMod: (file: string, url: string) => Promise<void>;
  export let installPack: (file: string, url: string) => Promise<void>;
  const dispatch = createEventDispatcher();

  $: data = map(mods, packs, modsInstalled, packsInstalled);
  $: defaultItems = [...data.bundles, ...data.mods, ...data.packs].filter(
    (i) => i.enabled
  );

  const installItem = async (id: string) => {
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

    console.error("unknown item", id);
  };
</script>

<div class="content">
  <h2 class="m3-font-headline-small">Get started</h2>
  <Defaults items={defaultItems} {installItem} />
  <div class="bottom">
    <Button
      type="tonal"
      on:click={() => {
        dispatch("updateMods");
        dispatch("updatePacks");
      }}
    >
      Recheck files
    </Button>
  </div>
</div>

<style>
  .content {
    width: min(40rem, calc(100vw - 8rem));
    align-self: center;
  }
  h2 {
    margin: 0 0 2rem 0;
  }
  .bottom {
    display: flex;
    margin-top: 4rem;
  }
</style>
