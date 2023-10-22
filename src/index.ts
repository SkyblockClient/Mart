import App from "./app/AppWeb.svelte";

const app = new App({
  target: document.getElementById("app") as HTMLElement,
});

export default app;
