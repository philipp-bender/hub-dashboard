import { html, css, TemplateResult } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import {
  LightColorMode,
  LightEntity,
  lightSupportsBrightness,
  lightSupportsColorMode,
} from "../../ha";
import { PREFIX_NAME } from "../../const";
import { LightCardConfig } from "./light-card.types";
import "./controls/light-card-color-temp-controls";
import { HubBaseCard } from "../base-card/base-card";

@customElement(`${PREFIX_NAME}-light-card`)
export class HubLightCard extends HubBaseCard<LightCardConfig, LightEntity> {
  @query("hub-base-action-card") baseActionCardRef?: HTMLElement;
  @query("hub-modal") modalRef?: HTMLDialogElement;

  @state() private supportsBrightness: boolean = false;
  @state() private supportsColorTemp: boolean = false;

  @state() private brightness: number = 0;
  @state() private colorTempKelvin: number = 0;

  private get _brightnessPercentage(): number {
    return (this.brightness / 255) * 100;
  }

  private initComponent(): void {
    if (this.entity && this.baseActionCardRef) {
      this.supportsBrightness = lightSupportsBrightness(this.entity);
      this.supportsColorTemp = lightSupportsColorMode(this.entity, LightColorMode.COLOR_TEMP);
      this.brightness = this.entity.attributes.brightness || 0;
      this.colorTempKelvin = this.entity.attributes.color_temp_kelvin || 0;
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.initComponent();
  }

  protected firstUpdated() {
    this.initComponent();
  }

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) {
      this.brightness = this.entity?.attributes?.brightness || 0;
      this.colorTempKelvin = this.entity?.attributes?.color_temp_kelvin || 0;
    }
  }

  private handleDimmableClick(): void {
    if (this.supportsColorTemp) {
      this.openModal();
    } else  {
      this.handleClick();
    }
  }

  private handleCardClick(): void {
    if (!this.supportsBrightness)
      this.handleClick();
  }

  private handleClick(): void {
    const state = this.hass.states[this.config.entity];
    const domain = this.config.entity.split(".")[0];
    this.hass.callService(domain, state.state === "on" ? "turn_off" : "turn_on", {
      entity_id: this.config.entity,
    });
  }

  private handleProgressOverlayChange(event: CustomEvent): void {
    if (event.detail !== null) {
      this.updateBrightness(event.detail)
    } 
  }

  private updateBrightness(value: number): void {
    const domain = this.config.entity.split(".")[0];

    this.hass.callService(domain, "turn_on", {
      entity_id: this.config.entity,
      brightness_pct: value,
    });
  }

  private openModal() {
    this.modalRef?.showModal();
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const name = this.config.name || this.entity?.attributes.friendly_name || this.config.entity;
    const icon = this.config.icon || "mdi:lightbulb";
    const isOn = this.entity?.state === "on";

    return html`
      <hub-base-action-card
        class="light-card"
        @click="${this.handleCardClick}"
        .active=${isOn}
        .icon=${icon}
        .label=${name}
        .subline=${isOn ? "An" : "Aus"}
        .chevron=${this.supportsColorTemp}
      >
        ${this.config?.quick_action
          ? html` <hub-toggle-switch slot="action" .model="${isOn}" @change="${this.handleClick}" size="large" /> `
          : ""}
        ${this.supportsBrightness
          ? html` 
            <hub-progress-overlay 
              slot="overlay" 
              .progress="${this._brightnessPercentage}" 
              @update="${this.handleProgressOverlayChange}" 
              @click="${this.handleDimmableClick}"
            /> `
          : ""}
      </hub-base-action-card>

      <hub-modal .title=${name}>
        ${this.supportsColorTemp
          ? html`
              <hub-light-card-color-temp-controls
                .entity=${this.entity}
                .hass=${this.hass}
                .icon=${icon}
              />
            `
          : ""}
      </hub-modal>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    .light-card {
      --base-action-card-active-background: #ffd300;
      --base-action-card-active-color: #17161c;
    }
  `;
}
