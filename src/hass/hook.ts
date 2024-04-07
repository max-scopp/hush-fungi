import { setSystemTheme } from "../renderer/setSystemTheme";

window.addEventListener("hass-hook:theme-update", ({ detail }: CustomEvent) => {
  setSystemTheme();

  setTimeout(() => {
    const headerDrag = document.createElement("style");
    headerDrag.append(`
      .header
      {
        -webkit-app-region: drag;
      }
      
      ha-menu-button,
      ha-button-menu,
      paper-tab,
      ha-icon-button-arrow-prev
      {
        -webkit-app-region: no-drag;
        
      }
    `);

    const sidebarUndrag = document.createElement("style");
    sidebarUndrag.append(`
    ha-sidebar
      {
        -webkit-app-region: no-drag;
      }
    `);

    document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("home-assistant-main")
      .shadowRoot.querySelector("ha-drawer")
      .querySelector("ha-panel-lovelace")
      .shadowRoot.querySelector("hui-root")
      .shadowRoot.append(headerDrag);

    document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("home-assistant-main")
      .shadowRoot.querySelector("ha-drawer")
      .append(sidebarUndrag);
  }, 1e3);
});
