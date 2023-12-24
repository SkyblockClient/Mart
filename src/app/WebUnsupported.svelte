<script lang="ts">
  import Icon from "./lib/Icon.svelte";
  import iconError from "@ktibow/iconset-ic/error";
  import { ButtonLink } from "m3-svelte";
</script>

<div class="error">
  <Icon icon={iconError} />
  <p class="m3-font-headline-small">Unsupported browser</p>
  <p
    class="m3-font-body-medium"
    style="color: rgb(var(--m3-scheme-on-surface-variant))"
  >
    You can't choose folders with this browser.<br />Use Chrome/Edge or use Mart
    as an app.
  </p>
  <ButtonLink
    href="https://github.com/KTibow/Mart/releases/latest"
    type="filled"
  >
    Download Mart
  </ButtonLink>
</div>

<style>
  p {
    margin: 0;
  }

  .error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;

    background-color: rgb(var(--m3-scheme-error) / 0.25);
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
  .error :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(var(--m3-scheme-secondary));
    flex-shrink: 0;
  }
  .error :global(a) {
    margin-top: 0.5rem;
  }
</style>
