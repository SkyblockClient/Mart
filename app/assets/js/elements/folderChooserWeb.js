///<reference path="../api/base.js" />
export const renderFolderChooserWeb = async (elem) => {
  const dropArea = html`
    <div
      class="text-center mt-4 p-4 rounded-md bg-gradient-to-br from-lime-800 to-emerald-800 group cursor-pointer"
    >
      <span id="drop" class="transition-all duration-500">Drop</span>
      your .minecraft folder here
      <br />
      Or
      <span class="group-hover:font-bold transition-all duration-500">click</span>
      to choose it
    </div>
  `;
  const dropText = dropArea.querySelector("#drop");
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropText.classList.add("font-bold");
  });
  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropText.classList.remove("font-bold");
  });
  const recognizeFolder = () => {
    dropArea.classList.remove("from-lime-800");
    dropArea.classList.remove("to-emerald-800");
    dropArea.classList.add("from-green-800");
    dropArea.classList.add("to-sky-800");
    elem.querySelector(
      "#result"
    ).innerHTML = `<span class="mti">check</span> You dropped ${window.chosen.name}, now click Next`;
  };
  dropArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropText.classList.remove("font-bold");
    const dropped = Array.from(e.dataTransfer.items).find((item) => item.kind == "file");
    window.chosen = await dropped.getAsFileSystemHandle();
    recognizeFolder();
  });
  dropArea.addEventListener("click", async () => {
    window.chosen = await window.showDirectoryPicker();
    recognizeFolder();
  });
  elem.innerHTML = `
    <div class="bg-neutral-800 rounded-md my-4 p-4">
      <span class="mti">info</span>
      <div class="inline-block">
        <b>Try downloading Mart as an app if the web version doesn't work.</b>
        <br />
        Also, if you're using MultiMC/PolyMC, make a new 1.8.9 Forge instance first.
      </div>
    </div>
    <p id="result"></p>
  `;
  if (!window.showDirectoryPicker) {
    const warn = html`
      <div class="bg-red-800 rounded-md mt-4 p-4">
        <span class="mti">warning</span>
        Your browser doesn't support the
        <code class="font-mono">showDirectoryPicker</code>
        API.
        <br />
        Use Chrome, or download Mart as an app.
      </div>
    `;
    elem.append(warn);
  } else {
    elem.append(dropArea);
  }
};
