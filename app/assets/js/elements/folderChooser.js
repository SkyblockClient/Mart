/// <reference path="../api/neutralino.js" />
import { renderFolderChooserApp } from "./folderChooserApp.js";
import { renderFolderChooserWeb } from "./folderChooserWeb.js";

class FolderChooser extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    if (IS_NEUTRALINO) {
      await renderFolderChooserApp(this);
    } else {
      await renderFolderChooserWeb(this);
    }
  }
}

customElements.define("folder-chooser", FolderChooser);
