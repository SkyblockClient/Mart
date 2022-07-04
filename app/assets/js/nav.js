///<reference path="api/base.js" />
import { AnchorApp, AnchorWeb } from "./api/fileApi.js";
import "./elements/folderChooser.js";
import "./elements/folderInfo.js";
import "./elements/skyclientStuff.js";

window.onerror = function (msg, url, line) {
  alert(`Something went wrong inside of Mart, DM KTibow#3960: ${msg}
${url}:${line}`);
};
el("#next").addEventListener("click", () => window.nextStep());
const splashDisplayed = await susStorage.splashDisplayed;
if (!splashDisplayed) {
  el("dialog").showModal();
  document.querySelector("#shut").addEventListener("click", () => {
    susStorage.splashDisplayed = true;
    el("dialog").close();
  });
}

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
    window.chosen = document.querySelector("input:checked").value;
    if (!window.chosen) {
      el("#next").innerHTML = "Please choose a folder";
      return;
    }
    susStorage.chosenPath = window.chosen;
    window.chosen = new AnchorApp(window.chosen);
  } else {
    if (!window.chosen) {
      el("#next").innerHTML = "Please choose a folder";
      return;
    }
    window.chosen = new AnchorWeb(window.chosen);
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
