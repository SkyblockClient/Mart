import "./app.css";
import App from "./app/AppApp.svelte";
import { init } from "@neutralinojs/lib";

init();

const app = new App({
  target: document.getElementById("app") as HTMLElement,
});

export default app;
