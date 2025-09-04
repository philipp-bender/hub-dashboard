import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { ButtonCardConfig } from "./button-card.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-button-card`)
export class HubButtonCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: ButtonCardConfig;

  setConfig(config: ButtonCardConfig) {
    if (!config) throw new Error("No config provided");
    this.config = config;
  }

  private _handleClick() {
    const tap = this.config.tap_action;
    if (!tap) return;

    switch (tap.action) {
      case "navigate":
        if (tap.navigation_path) {
          history.pushState(null, "", tap.navigation_path);
          const ev = new Event("location-changed", { bubbles: true, composed: true });
          window.dispatchEvent(ev);
        }
        break;

      case "toggle":
        if (this.hass && (tap.entity || this.config.entity)) {
          this.hass.callService("homeassistant", "toggle", {
            entity_id: tap.entity ?? this.config.entity,
          });
        }
        break;

      case "call-service":
        if (this.hass && tap.service) {
          const [domain, service] = tap.service.split(".");
          this.hass.callService(domain, service, tap.service_data || {});
        }
        break;

      default:
        console.warn("Unsupported tap_action", tap);
    }
  }

  render() {
    return html`
      <div class="button-card" @click=${this._handleClick}>
        <div class="button-card__img">
          ${this.config.icon ? html`<ha-icon .icon=${this.config.icon}></ha-icon>` : ""}
        </div>
        ${this.config.name ? html`<div class="button-card__name">${this.config.name}</div>` : ""}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .button-card {
      background-color: #363640;
      border-radius: 999px;
      border: none;
      padding: 0px 32px 0px 4px;
      display: grid;
      grid-template-areas:
        "i n s"
        "i n s"
        "i n l";
      grid-template-rows: 54px 1fr min-content min-content;
      grid-template-columns: 48px 1fr min-content;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    @media (min-width: var(--viewport-md)) {
      .button-card {
        grid-template-rows: 64px 1fr min-content min-content;
        grid-template-columns: 48px 1fr min-content;
      }
    }

    .button-card:hover {
      background-color: #4a4a57;
    }

    .button-card__img {
      grid-area: i;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background-color: #ffd300;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (min-width: var(--viewport-md)) {
      .button-card__img {
        width: 48px;
        height: 48px;
      }
    }

    .button-card ha-icon {
      font-size: 24px;
      color: #17161c;
    }

    .button-card__name {
      grid-area: n;
      place-self: unset;
      font-size: 16px;
      color: #ffffff;
      padding-left: 8px;
    }
  `;
}
