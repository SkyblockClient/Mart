<script lang="ts">
  import iconDoneAll from "@ktibow/iconset-ic/done-all";
  import iconDownloads from "@ktibow/iconset-ic/round-download-for-offline";
  import { Button, LinearProgress } from "m3-svelte";
  import Icon from "../lib/Icon.svelte";

  export let items: { id: string; title: string; installed: boolean }[];
  export let installItem: (id: string) => Promise<void>;

  $: addableItems = items.filter((i) => !i.installed);

  let installStatus: { total: number; done: number } | undefined;
  const install = async () => {
    installStatus = { total: addableItems.length, done: 0 };
    await Promise.all(
      addableItems.map(async (item) => {
        await installItem(item.id);
        installStatus!.done++;
      })
    );
    installStatus = undefined;
  };
</script>

{#if installStatus}
  <div class="tip" style="margin-bottom: 0.5rem">
    <Icon icon={iconDownloads} />
    Downloading defaults...
  </div>
  <LinearProgress
    display="flex"
    percent={(installStatus.done / installStatus.total) * 100}
  />
{:else if addableItems.length > 0}
  <div class="row">
    {#each addableItems.slice(0, 3) as item}
      <div class="item">
        {item.title}
      </div>
    {/each}
    {#if addableItems.length > 3}
      <div class="more">...</div>
    {/if}
  </div>
  {#if !installStatus}
    <Button type="tonal" on:click={install}>Start installing</Button>
  {/if}
{:else}
  <div class="tip">
    <Icon icon={iconDoneAll} />
    You have the default mods
  </div>
{/if}

<style>
  .row {
    display: flex;
    gap: 1rem;
    height: 10rem;

    margin-bottom: 1rem;
  }
  .item {
    padding: 1rem;
    border-radius: 1.5rem;
  }
  .item:nth-of-type(1) {
    background-color: rgb(var(--m3-scheme-primary-container));
    min-width: 10rem;
    flex-grow: 1;
  }
  .item:nth-of-type(2) {
    background-color: rgb(var(--m3-scheme-secondary-container));
    min-width: 8rem;
    flex-grow: 1;
  }
  .item:nth-of-type(3) {
    background-color: rgb(var(--m3-scheme-surface-container-high));
    min-width: 6rem;
  }
  .more {
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
    border-radius: 1.5rem;
  }

  .tip {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3rem;

    background-color: rgb(var(--m3-scheme-primary-container));
    color: rgb(var(--m3-scheme-on-primary-container));
    padding: 0 1.5rem;
    border-radius: 1.5rem;
  }
</style>
