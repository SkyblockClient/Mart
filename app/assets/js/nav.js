///<reference path="api/base.js" />
import { AnchorApp, AnchorWeb } from "./api/fileApi.js";
import "./elements/folderChooser.js";
import "./elements/folderInfo.js";
import "./elements/skyclientStuff.js";

window.onerror = function (msg, url, line) {
  alert(`Something went wrong inside of Mart, message @KTibow: ${msg}
${url}:${line}`);
};
el("#next").addEventListener("click", () => window.nextStep());

el("main").innerHTML = `
  <h1 class="text-3xl">1. Choose your .minecraft folder</h1>
  <folder-chooser></folder-chooser>
`;
window.nextStep = async () => {
  el("#next").innerHTML = `
  <span class="font-bold">
    <span class="mti">arrow_forward</span>
    Next
  </span>
  `;
  if (IS_NEUTRALINO) {
    const path = document.querySelector("input:checked")?.value;
    if (!path) {
      el("#next").innerHTML = "Please choose a folder";
      return;
    }
    susStorage.chosenPath = path;
    window.chosen = new AnchorApp(path);
  } else {
    if (!window.chosenHandle) {
      el("#next").innerHTML = "Please choose a folder";
      return;
    }
    window.chosen = new AnchorWeb(window.chosenHandle);
  }
  delete window.nextStep;
  el("main").innerHTML = `
    <h1 class="text-3xl">2. Check what you chose</h1>
    <folder-info></folder-info>
  `;
};
/*
if (!IS_NEUTRALINO && "serviceWorker" in navigator) {
  console.log("Registering service worker");
  navigator.serviceWorker.register("sw.js").then((reg) => {
    console.log("Service worker registration succeeded", reg);
  });
}
*/
