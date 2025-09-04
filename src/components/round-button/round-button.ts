import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { RoundButtonConfig } from "./round-button.types";
import { PREFIX_NAME } from "../../const";
import { roundButtonStyles } from "../../styles/index";

@customElement(`${PREFIX_NAME}-round-button`)
export class RoundButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: RoundButtonConfig;


  setConfig(config: RoundButtonConfig) {
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
      <button class="round-button" @click=${this._handleClick}>
        ${this.config.icon ? html`<ha-icon .icon=${this.config.icon}></ha-icon>` : ""}
      </button>
    `;
  }

  static get styles(): CSSResultGroup {
    return [roundButtonStyles, css``];
  }
}
