import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ButtonCardConfig } from "./button-card.types";
import { HomeAssistant } from "../../ha";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-button-card`)
export class HubButtonCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: ButtonCardConfig;

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
            "border-radius": "999px",
            "border-width": "0",
            padding: "0px 32px 0px 8px",
          },
        ],
        grid: [
          {
            "grid-template-areas": '"i n s" "i n s" "i n l"',
            "grid-template-rows": "64px 1fr min-content min-content",
            "grid-template-columns": "48px 1fr min-content",
          },
        ],
        img_cell: [
          {
            width: "48px",
            height: "48px",
            color: "#17161C",
            "border-radius": "999px",
            "background-color": "#FFD300",
          },
        ],
        name: [
          {
            "place-self": "unset",
          },
        ],
        icon: [
          {
            "font-size": "40px",
            color: "#17161C",
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
