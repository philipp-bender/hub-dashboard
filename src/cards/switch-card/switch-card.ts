import { html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { HassEntityBase } from "home-assistant-js-websocket";
import { PREFIX_NAME } from "../../const";
import { SwitchCardConfig } from "./switch-card.types";
import { HubBaseCard } from "../base-card/base-card";
import setupCustomlocalize from "../../localize";

@customElement(`${PREFIX_NAME}-switch-card`)
export class HubSwitchCard extends HubBaseCard<SwitchCardConfig, HassEntityBase> {

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) {
      console.log(changed, this.entity)
    }
  }

  private handleClick(): void {
    const state = this.hass.states[this.config.entity];
    const domain = this.config.entity.split(".")[0];
    this.hass.callService(domain, state.state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.config.entity,
    });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const customLocalize = setupCustomlocalize(this.hass);
    const name = this.config.name || this.entity?.attributes.friendly_name || this.config.entity;
    const textOn = this.config.textOn || customLocalize('hub.on')
    const textOff = this.config.textOn || customLocalize('hub.off')
    const icon = this.config.icon || "mdi:toggle-switch";
    const isOn = this.entity?.state === "on";

    return html`
      <hub-base-action-card
        class="switch-card"
        @click="${this.handleClick}"
        .active=${isOn}
        .icon=${icon}
        .label=${name}
        .subline=${isOn ? textOn : textOff}
      >
      </hub-base-action-card>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    .switch-card {
      --base-action-card-active-background: #ffd300;
      --base-action-card-active-color: #17161c;
    }
  `;
}
