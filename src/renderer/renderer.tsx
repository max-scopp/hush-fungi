/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * Currently, the Node.js integration is enabled for @electron/remote to work,
 * however, I want to move away from it but haven't been arsed to make all the changed
 * for it yet.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";
import "./global.scss";

window.addEventListener("keyup", ({ code }) => {
  if (code === "Escape") {
    window.electron.window.blur();
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
