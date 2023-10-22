<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let showDirectoryPicker: typeof window.showDirectoryPicker;

  const dispatch = createEventDispatcher();
  let dragging = false;
  let showTip = false;

  let hue = Math.random() * 365;
  let saturation = 64 + Math.random() * 128;
  let colors = [`hsla(${hue}, ${saturation}%, 50%, 0.2)`];
  onMount(() => {
    const id = setInterval(() => {
      hue = hue - 2 + Math.random() * 4;
      const r = Math.random();
      const s = 192 - r * r * 128;
      saturation = (saturation * 7 + s) / 8;
      colors.unshift(`hsla(${hue}, ${saturation}%, 50%, 0.2)`);
      colors = colors.slice(0, 100);
    }, 33);
    return () => clearInterval(id);
  });

  const drop = async (e: DragEvent) => {
    const dropped =
      e.dataTransfer &&
      Array.from(e.dataTransfer.items).find((item) => item.kind == "file");
    if (!dropped) return;
    dispatch("handle", await dropped.getAsFileSystemHandle());
  };
</script>

<button
  class="area"
  style="background-color: transparent; background-image: linear-gradient(to left, {colors.join(
    ','
  )});"
  on:dragover|preventDefault={() => (dragging = true)}
  on:dragleave={() => (dragging = false)}
  on:drop|preventDefault={(e) => {
    dragging = false;
    drop(e);
  }}
  on:click={async () => {
    showTip = true;
    const chosen = await showDirectoryPicker();
    dispatch("handle", chosen);
  }}
>
  <span>
    <span class="drop" class:bold={dragging}>Drop</span> your .minecraft folder here
  </span>
  <span>or <span class="click">click</span> here to choose it</span>
</button>
<div class="qa">
  <p>Using MultiMC/PolyMC/Prism?</p>
  <p>Make a new Forge 1.8.9 instance and use its .minecraft folder</p>
</div>
{#if showTip}
  <div class="qa">
    <p>Error like "can't open this folder because it contains system files"?</p>
    <p>1. Try dragging it here instead of clicking</p>
    <p>
      2. Try moving it to somewhere like Documents, using Mart, and moving it
      back
    </p>
    <p>3. Use Mart as an app</p>
  </div>
{/if}

<style>
  p {
    margin: 0;
  }

  .area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 10rem;

    border-radius: 1.25rem;
    font: inherit;
    cursor: pointer;
    border: none;
  }
  .drop,
  .click {
    font-weight: 400;
    transition: all 200ms ease;
  }
  .drop.bold,
  button:hover .click {
    font-weight: 800;
  }
  .qa {
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
    border-radius: 1.25rem;
    margin-top: 1rem;
  }
  .qa > :first-child {
    margin-bottom: 0.2rem;
  }
</style>
