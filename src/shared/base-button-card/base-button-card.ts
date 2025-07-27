import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-base-button-card`)
export class HubBaseButtonCard extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) subline = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) chevron = false;

  render() {
    return html`
      <button class="hub-base-button-card">
        <div class="hub-base-button-card__icon">
          <ha-icon .icon="${this.icon}"></ha-icon>
        </div>
        <div class="hub-base-button-card__inner">
          <slot>
            <div class="text-size-base">${this.label}</div>
            ${this.subline ? html`<div class="hub-base-button-card__subline text-size-sm">${this.subline}</div>` : ""}
          </slot>
        </div>
        ${this.chevron
          ? html`
              <div class="button-card__chevron">
                <ha-icon icon="mdi:chevron-right"></ha-icon>
              </div>
            `
          : ""}
        <md-ripple></md-ripple>
      </button>
    `;
  }

  static styles = css`
    .hub-base-button-card {
      position: relative;
      display: inline-flex;
      align-items: center;
      background-color: #363640;
      gap: 12px;
      border-radius: 999px;
      border: 0;
      padding: 8px 32px 8px 8px;
      color: #ffffff;
      cursor: pointer;
    }
    .hub-base-button-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      color: #17161c;
      border-radius: 999px;
      background-color: #ffd300;
    }
    .hub-base-button-card__inner {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      flex: 1;
    }
    .hub-base-button-card__subline {
      font-size: 0.875rem;
      opacity: 0.7;
    }
    .button-card__chevron {
      margin-left: 8px;
      display: flex;
      align-items: center;
    }
  `;
}
