import { html, css, TemplateResult } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import {
  COVER_SUPPORT_CLOSE_TILT,
  COVER_SUPPORT_OPEN_TILT,
  COVER_SUPPORT_STOP_TILT,
  ClimateEntity,
  supportsFeature,
} from "../../ha";
import { PREFIX_NAME } from "../../const";
import { ClimateCardConfig } from "./climate-card.types";
import { HubBaseCard } from "../base-card/base-card";
import "./controls/cover-card-tilt-controls";

@customElement(`${PREFIX_NAME}-climate-card`)
export class HubClimateCard extends HubBaseCard<ClimateCardConfig, ClimateEntity> {
  @query("hub-base-action-card") baseActionCardRef?: HTMLElement;
  @query("hub-modal") modalRef?: HTMLDialogElement;

  @state() private currentTemperature: number = 0;
  @state() private minTemperature: number = 0;
  @state() private maxTemperature: number = 0;

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) {
      this.currentTemperature = this.entity?.attributes?.current_temperature || 0;
      this.minTemperature = this.entity?.attributes?.min_temp || 0;
      this.maxTemperature = this.entity?.attributes?.max_temp || 0;
    }
  }

  private handleDimmableClick(): void {
    if (this.supportsTilt) {
      this.openModal();
    }
  }

  private openModal() {
    this.modalRef?.showModal();
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const name = this.config.name || this.entity?.attributes.friendly_name || this.config.entity;
    const icon = this.config.icon || "mdi:mdi:roller-shade";
    const minPosition = this.config?.min_position || 5
    const isClose = this.position > minPosition;

    return html`
      <hub-base-action-card
        class="cover-card"
        .active=${isClose}
        .icon=${icon}
        .label=${name}
        .subline=${isClose ? `Geschlossen - ${this.position}%` : `Offen`}
        .chevron=${this.supportsTilt}
      >
        <hub-progress-overlay 
          slot="overlay" 
          .progress="${this.position}" 
          @update="${this.handleProgressOverlayChange}" 
          @click="${this.handleDimmableClick}"
          .reverse=${true}
          .min=${minPosition}
          .showStipes="${this.supportsTilt}"
          .tiltProgress="${this.tiltPosition}"
        /> 
      </hub-base-action-card>

      <hub-modal .title=${name}>
        ${this.supportsTilt
          ? html` 
            <hub-cover-card-tilt-controls 
              .entity=${this.entity}
              .hass=${this.hass}
              .icon=${icon}
            /> `
          : ""}
      </hub-modal>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    .climate-card {
      --base-action-card-active-background: #85B639;
      --base-action-card-active-color: #17161c;
    }
  `;
}
