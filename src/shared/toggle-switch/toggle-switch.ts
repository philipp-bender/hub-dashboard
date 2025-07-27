import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ToggleSize } from "./toggle-switch.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-toggle-switch`)
export class ToggleSwitch extends LitElement {
  @property({ type: Boolean, reflect: true }) model = false;
  @property({ type: String }) size: ToggleSize = "default";
  @property({ type: Boolean }) colored = false;

  private _toggle() {
    this.model = !this.model;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button
        type="button"
        class="toggle
          ${this.model ? "toggle--active" : ""}
          ${this.colored ? "toggle--colored" : ""}"
        role="switch"
        aria-checked="${this.model}"
        @click=${this._toggle}
      >
        <span aria-hidden="true" class="toggle__pin"></span>
      </button>
    `;
  }

  static styles = css`
    .toggle {
      display: inline-flex;
      position: relative;
      border-radius: 9999px;
      border-color: transparent;
      transition: all ease-in-out 200ms;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.5);
      height: 40px;
      width: 80px;
      border: none;
      outline: none;
      padding: 0;
    }
    .toggle__pin {
      display: inline-block;
      border-radius: 9999px;
      background-color: #ffffff;
      transition: all ease-in-out 200ms;
      pointer-events: none;
      width: 40px;
      height: 40px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .toggle.toggle--active .toggle__pin {
      transform: translateX(40px);
    }
    .toggle.toggle--active.toggle--colored {
      background-color: #ffd300;
    }
  `;
}
