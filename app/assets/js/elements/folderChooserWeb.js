///<reference path="../api/base.js" />
export const renderFolderChooserWeb = async (elem) => {
  const dropArea = html`
    <div
      class="text-center mt-4 p-4 rounded-md bg-gradient-to-br from-nord9/75 to-nord10/75 group cursor-pointer"
    >
      <span id="drop" class="transition-all duration-500">Drop</span>
      your .minecraft folder here
      <br />
      Or
      <span class="group-hover:font-bold transition-all duration-500"
        >click</span
      >
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
    dropArea.classList.add("hidden");
    document.querySelector("#next").classList.remove("hidden");
    elem.querySelector(
      "#result"
    ).innerHTML = `<span class="mti">check</span> You dropped ${window.chosenHandle.name}`;
  };
  dropArea.addEventListener("drop", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropText.classList.remove("font-bold");
    const dropped = Array.from(e.dataTransfer.items).find(
      (item) => item.kind == "file"
    );
    window.chosenHandle = await dropped.getAsFileSystemHandle();
    recognizeFolder();
  });
  dropArea.addEventListener("click", async () => {
    if (!elem.querySelector("details"))
      elem.querySelector("#result").prepend(errorExplanation);
    window.chosenHandle = await window.showDirectoryPicker();
    recognizeFolder();
  });
  elem.innerHTML = String.raw`
    <div class="bg-nord1 rounded-md my-4 p-4 flex gap-1">
      <span class="mti">info</span>
      <div class="inline-block flex-grow">
        <p class="font-bold">Try downloading Mart as an app if the web version doesn't work.</p>
        <p>Also, if you're using PrismLauncher, PolyMC, or MultiMC, make a new 1.8.9 Forge instance first.</p>
      </div>
    </div>
    <p id="result"></p>
  `;
  const errorExplanation = html([
    String.raw`
    <details class="group">
      <summary
        class="cursor-pointer bg-nord1 p-4 rounded-md text-sm marker:font-['Material_Icons'] marker:content-['expand\\_more'] group-open:marker:content-['expand\\_less']"
      >
        <span class="align-top">
          Error like "can't open this folder because it contains system files"
        </span>
      </summary>
      <p class="mt-4">
        There are 3 possible solutions. Try them in order.
      </p>
      <ul class="list-disc list-inside">
        <li>Drag your .minecraft folder into Mart instead of clicking to choose it</li>
        <li>Temporarily drag your .minecraft folder to Documents, use Mart, then drag it back</li>
        <li>Download Mart as an app</li>
      </ul>
    </details>
  `,
  ]);
  if (!window.showDirectoryPicker) {
    const warn = html`
      <div class="bg-nord11/50 rounded-md mt-4 p-4 flex gap-1">
        <span class="mti">warning</span>
        <div class="inline-block">
          Your browser doesn't support the
          <code class="font-mono">showDirectoryPicker</code>
          API.
          <br />
          Use Chrome, Edge, or
          <a
            class="underline"
            href="https://github.com/SkyblockClient/Mart/releases/latest"
            >download Mart as an app.</a
          >
        </div>
      </div>
    `;
    elem.append(warn);
  } else {
    elem.append(dropArea);
  }
  document.querySelector("#next").classList.add("hidden");
};
