import "./app.css";
import App from "./app/App.svelte";
import { init } from "@neutralinojs/lib";

init();

const app = new App({
  target: document.getElementById("app") as HTMLElement,
  props: {
    neutralino: true,
  },
});

export default app;
