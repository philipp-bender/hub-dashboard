import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, isActive, isAvailable, LightEntity } from "../../../ha";
import { PREFIX_NAME } from "../../../const";
import { roundButtonStyles } from "../../../styles/index";
import setupCustomlocalize from "../../../localize";
import { verticalListStyles } from "../../../styles/vertical-list";

@customElement(`${PREFIX_NAME}-light-card-color-temp-controls`)
export class LightCardColorTempControls extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entity!: LightEntity;
  @property({ type: String }) private icon: string = "mdi:lightbulb";

  onChange(e: CustomEvent<number>): void {
    const value = e.detail;
    console.log("Brightness changed to:", e);

    this.hass.callService("light", "turn_on", {
      entity_id: this.entity.entity_id,
      brightness_pct: (value / 255) * 100,
    });
  }

  colorTemperature(kelvin: number): void {
    this.hass.callService("light", "turn_on", {
      entity_id: this.entity.entity_id,
      color_temp_kelvin: kelvin,
    });
  }

  protected render(): TemplateResult {
    const customLocalize = setupCustomlocalize(this.hass);

    const brightness = this.entity.attributes.brightness || 0;

    return html`
      <div class="vertical-list">
        <div class="vertical-list__item">
            <div class="light-color-temp-controls__label">${customLocalize("hub.card.light.brightness")}</div>
            <div class="light-color-temp-controls__value">
            <hub-slider-input
                class="light-color-temp-control"
                .value=${brightness}
                .disabled=${!isAvailable(this.entity)}
                .inactive=${!isActive(this.entity)}
                .min=${0}
                .max=${255}
                @drag-end=${this.onChange}
                .size=${350}
            />
            </div>
        </div>
        <div class="vertical-list__item">
            <div class="light-color-temp-controls__label">${customLocalize("hub.card.light.color_temp")}</div>
            <div class="light-color-temp-controls__value">
            <button class="round-button" style="color: #C1DFF7" @click=${() => this.colorTemperature(6000)}>
                <ha-state-icon .icon="${this.icon}"></ha-state-icon>
            </button>
            <button class="round-button" style="color: #E4F2FD" @click=${() => this.colorTemperature(5000)}>
                <ha-state-icon .icon="${this.icon}"></ha-state-icon>
            </button>
            <button class="round-button" style="color: #FAF4C2" @click=${() => this.colorTemperature(4000)}>
                <ha-state-icon .icon="${this.icon}"></ha-state-icon>
            </button>
            <button class="round-button" style="color: #FBE59C" @click=${() => this.colorTemperature(3300)}>
                <ha-state-icon .icon="${this.icon}"></ha-state-icon>
            </button>
            <button class="round-button" style="color: #F5B549" @click=${() => this.colorTemperature(2700)}>
                <ha-state-icon .icon="${this.icon}"></ha-state-icon>
            </button>
            </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [roundButtonStyles, verticalListStyles, css``];
  }
}
