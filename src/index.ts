import App from "./app/AppWeb.svelte";

window.packs = fetch(
  "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/packs.json",
).then((r) => r.json());
window.mods = fetch(
  "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/mods.json",
).then((r) => r.json());
const app = new App({
  target: document.getElementById("app") as HTMLElement,
});

export default app;
