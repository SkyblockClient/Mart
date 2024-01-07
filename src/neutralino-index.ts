import "./app.css";
import App from "./app/app/App.svelte";
import { init } from "@neutralinojs/lib";

init();

window.packs = fetch(
  "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/packs.json"
).then((r) => r.json());
window.mods = fetch(
  "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/mods.json"
).then((r) => r.json());
const app = new App({
  target: document.getElementById("app") as HTMLElement,
});

export default app;
