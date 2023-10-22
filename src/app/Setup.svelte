<script lang="ts">
  import Icon from "@iconify/svelte";
  import iconQuestion from "@iconify-icons/ic/outline-question-mark";
  import iconSliders from "@iconify-icons/ic/tune";
  import iconTrash from "@iconify-icons/ic/delete";
  import iconPlus from "@iconify-icons/ic/add";
  import iconCheck from "@iconify-icons/ic/check";
  import iconRight from "@iconify-icons/ic/arrow-forward";
  import { Button, CircularProgressIndeterminate } from "m3-svelte";
  import { createEventDispatcher } from "svelte";

  export let mode: "unknown" | "minecraft" | undefined;
  export let profileStatus: "yes" | "no" | "loading" | undefined;
  export let folderStatus: "yes" | "no" | "loading" | undefined;
  const dispatch = createEventDispatcher();
</script>

{#if mode == "unknown"}
  <div class="wrapper">
    <div class="icon">
      <Icon icon={iconQuestion} />
    </div>
    <div class="text">
      <p>
        This is an unknown launcher. We'll trust you already have your instance
        configured and install mods directly.
      </p>
    </div>
  </div>
{:else if mode == "minecraft"}
  <div class="wrapper">
    <div class="icon">
      <Icon icon={iconSliders} />
    </div>
    <div class="text">
      <p>You need a profile and folder to launch SkyClient.</p>
      <div class="dual">
        <div>
          <span>Profile</span>
          {#if profileStatus == "yes"}
            <Icon icon={iconCheck} />
          {:else if profileStatus == "no"}
            <Button
              type="text"
              iconType="full"
              on:click={() => dispatch("createProfile")}
            >
              <Icon icon={iconPlus} />
            </Button>
          {:else if profileStatus == "loading"}
            <CircularProgressIndeterminate />
          {/if}
        </div>
        <div>
          <span>Folder</span>
          {#if folderStatus == "yes"}
            <Icon icon={iconCheck} />
            <Button
              type="text"
              iconType="full"
              on:click={() => dispatch("deleteFolder")}
            >
              <Icon icon={iconTrash} />
            </Button>
          {:else if folderStatus == "no"}
            <Button
              type="text"
              iconType="full"
              on:click={() => dispatch("createFolder")}
            >
              <Icon icon={iconPlus} />
            </Button>
          {:else if folderStatus == "loading"}
            <CircularProgressIndeterminate />
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

{#if mode}
  <Button
    on:click={() => dispatch("next")}
    type="filled"
    iconType="left"
    extraOptions={{
      class: "m3-container m3-font-label-large filled icon-left next-button",
    }}
  >
    <Icon icon={iconRight} />
    Next
  </Button>
{:else}
  <p>...</p>
{/if}

<style>
  p {
    margin: 0;
  }
  .wrapper {
    display: flex;
    gap: 0.5rem;
  }
  .wrapper > * {
    display: flex;
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
  }
  .wrapper > .icon {
    min-width: 5rem;
    min-height: 5rem;
    align-items: center;
    justify-content: center;
    border-radius: 1rem 0.5rem 0.5rem 1rem;
  }
  .wrapper > .text {
    flex-direction: column;
    flex-grow: 1;
    border-radius: 0.5rem 1rem 1rem 0.5rem;
  }
  .wrapper :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }
  .dual {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .dual > div {
    display: flex;
    height: 3.5rem;
    gap: 0.5rem;
    align-items: center;
    padding: 0 1.25rem;
    border-radius: 3.5rem;

    background-color: rgb(var(--m3-scheme-surface-container-high));
    flex: 1;
  }
  .dual > div > span {
    margin-right: auto;
  }
  .dual > div > :global(button) {
    margin-right: -0.75rem;
  }
  .dual > div > :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: -0.25rem;
  }

  :global(.next-button) {
    margin-top: 2rem;
    width: 100%;
  }
</style>
