<script lang="ts">
  import doneAll from "@ktibow/iconset-ic/done-all";
  import { Button } from "m3-svelte";
  import { flip } from "svelte/animate";
  import Icon from "../lib/Icon.svelte";

  export let items: { id: string; title: string; installed: boolean }[];
  $: itemsAddable = items.filter((i) => !i.installed);

  const install = () => {
    if (!itemsAddable.length) {
      itemsAddable = [{ title: "sussy" }];
      return;
    }
    itemsAddable = itemsAddable.slice(1);
  };
</script>

{#if itemsAddable.length > 0}
  <div class="row">
    {#each itemsAddable.slice(0, 3) as item, i (item.id)}
      <div class="item" data-i={i} animate:flip={{ duration: 400 }}>
        {item.title}
      </div>
    {/each}
    {#if itemsAddable.length > 3}
      <div class="more">...</div>
    {/if}
  </div>
  <Button type="tonal" on:click={install}>Start installing</Button>
{:else}
  <div class="tip">
    <Icon icon={doneAll} />
    You have all default mods
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
  .item[data-i="0"] {
    background-color: rgb(var(--m3-scheme-primary-container));
    white-space: nowrap;
    min-width: 10rem;
    flex-grow: 1;
    transition:
      background-color 500ms,
      min-width 500ms;
  }
  .item[data-i="1"] {
    background-color: rgb(var(--m3-scheme-secondary-container));
    min-width: 8rem;
    flex-grow: 1;
    transition:
      background-color 500ms,
      min-width 500ms;
  }
  .item[data-i="2"] {
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
