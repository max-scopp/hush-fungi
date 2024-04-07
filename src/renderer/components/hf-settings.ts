import { MdOutlinedSelect } from "@material/web/all";
import "@material/web/elevation/elevation";
import { LitElement, TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { STORE_PREFERRED_SURFACE } from "../../shared/constants";

declare global {
  interface HTMLElementTagNameMap {
    "hf-settings": Settings;
  }
}

@customElement("hf-settings")
export class Settings extends LitElement {
  static styles = css`
    :host {
      position: relative;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      height: 70%;
      width: 90%;

      --md-elevation-level: 3;

      background: var(--md-sys-color-surface);
    }
  `;

  handleSurfaceChange(e: Event) {
    window.store.set(
      STORE_PREFERRED_SURFACE,
      (e.target as MdOutlinedSelect).value,
    );
  }

  render(): TemplateResult {
    return html`
      <md-elevation></md-elevation>
      <h1>Settings</h1>
      <md-list>
        <md-list-item>
          Fruits

          <md-outlined-select slot="end" @change="${this.handleSurfaceChange}">
            <md-select-option value="mica">Mica</md-select-option>
            <md-select-option value="acrylic">Acrylic</md-select-option>
          </md-outlined-select>
        </md-list-item>
        <!-- <md-divider></md-divider>
        <md-list-item> Apple </md-list-item> -->
      </md-list>
    `;
  }
}
