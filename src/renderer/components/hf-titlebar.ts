import { LitElement, TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators.js";

declare global {
  interface HTMLElementTagNameMap {
    "hf-titlebar": Titlebar;
  }
}

@customElement("hf-titlebar")
export class Titlebar extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--hf-titlebar-height);

      display: grid;
      place-items: center;
      text-align: center;

      -webkit-app-region: drag;

      background-color: hsl(0deg 0% 0% / 12%);
    }
  `;

  render(): TemplateResult {
    return html` <div></div> `;
  }
}
