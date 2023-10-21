import App from "./app/App.svelte";

const app = new App({
  target: document.getElementById("app") as HTMLElement,
  props: {
    neutralino: false,
  },
});

export default app;
