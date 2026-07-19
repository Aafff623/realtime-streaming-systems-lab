(() => {
  const config = window.__PREVIEW_README__;
  const content = document.querySelector("#content");
  const status = document.querySelector("#status");
  const reloadButton = document.querySelector("#reload");

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };

  const loadReadme = async () => {
    if (window.location.protocol === "file:") {
      setStatus(config.fileProtocolMessage, "error");
      return;
    }

    setStatus("正在加载 README.md", "loading");
    content.replaceChildren();

    try {
      if (!window.marked) {
        throw new Error("marked 未加载");
      }

      const response = await fetch(`${config.source}?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const markdown = await response.text();
      content.innerHTML = window.marked.parse(markdown);
      setStatus("README 已加载", "ready");
    } catch (error) {
      setStatus(`${config.loadErrorMessage} ${error.message}`, "error");
    }
  };

  reloadButton.addEventListener("click", loadReadme);
  loadReadme();
})();
