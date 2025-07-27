import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../../ha";
import { RoundButtonConfig } from "./round-button.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-round-button`)
export class RoundButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: RoundButtonConfig;

  @state() private _card: any = null;

  async setConfig(config: any) {
    this.config = config;

    const helpers = await (window as any).loadCardHelpers();

    if (!config) return;

    this._card = await helpers.createCardElement({
      ...config,
      type: "custom:button-card",
      styles: {
        card: [
          {
            "background-color": "#363640",
            "border-radius": "50%",
            width: "64px",
            height: "64px",
            "border-width": "0",
          },
        ],
        icon: [
          {
            "font-size": "40px",
            color: "#ffffff",
          },
        ],
      },
    });

    this._card.hass = this.hass;
    this.requestUpdate();
  }

  render() {
    return html`${this._card}`;
  }
}
