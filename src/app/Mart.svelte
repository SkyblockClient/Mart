<script lang="ts">
  import Icon from "./lib/Icon.svelte";
  import iconList from "@ktibow/iconset-ic/outline-list";

  type Mod = {
    id: string;
    display: string;
    description: string;
    creator: string;
    icon: string;
    enabled?: boolean;
    hidden?: boolean;
    categories?: string[];
    packages?: string[];
  };

  export let mods: Mod[];
  export let packs: any[];
  const lBundle = mods.filter(
    (m: Mod): m is Mod & { hidden?: false; packages: string[] } =>
      Boolean(!m.hidden && m.packages)
  );
  const lMod = mods.filter((m) => !m.hidden && !m.packages);
</script>

<div class="content">
  <h2 class="m3-font-headline-small">Mods</h2>
  <div class="bundles">
    {#each lBundle as bundle}
      {@const mods = 1 + bundle.packages.length}
      <div>
        <p><b>{bundle.display}</b></p>
        <p>{bundle.description}</p>
        <div class="chips">
          <div>
            <Icon icon={iconList} />
            {mods}
            {mods == 1 ? "mod" : "mods"}
          </div>
        </div>
      </div>
    {/each}
  </div>
  {#each lMod as mod}
    <label>
      <input type="checkbox" />
      <img
        src="https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/icons/{mod.icon}"
        alt="Mod by {mod.creator}"
      />
      <b>{mod.display}</b>
      <span>{mod.description}</span>
    </label>
  {/each}
</div>

<style>
  h2 {
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
  .bundles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .bundles > div {
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
  }
</style>
