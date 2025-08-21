import { html, css, TemplateResult } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import {
  COVER_SUPPORT_CLOSE_TILT,
  COVER_SUPPORT_OPEN_TILT,
  COVER_SUPPORT_STOP_TILT,
  CoverEntity,
  supportsFeature,
} from "../../ha";
import { PREFIX_NAME } from "../../const";
import { CoverCardConfig } from "./cover-card.types";
import { HubBaseCard } from "../base-card/base-card";
import "./controls/cover-card-tilt-controls";

@customElement(`${PREFIX_NAME}-cover-card`)
export class HubCoverCard extends HubBaseCard<CoverCardConfig, CoverEntity> {
  @query("hub-base-action-card") baseActionCardRef?: HTMLElement;
  @query("hub-modal") modalRef?: HTMLDialogElement;

  @state() private position: number = 0;
  @state() private tiltPosition: number = 0;

  private initComponent(): void {
    if (this.entity && this.baseActionCardRef) {
      this.position = 100 - this.entity?.attributes?.current_position || 0;
      this.tiltPosition = this.entity?.attributes?.current_tilt_position || 0;
    }
  }

  private get supportsTilt(): boolean {
    if (!this.entity)
      return false

    return supportsFeature(this.entity, COVER_SUPPORT_OPEN_TILT) ||
      supportsFeature(this.entity, COVER_SUPPORT_CLOSE_TILT) ||
      supportsFeature(this.entity, COVER_SUPPORT_STOP_TILT)
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
      const currentPosition = this.entity?.attributes?.current_position || 0
      this.position = 100 - currentPosition;
      this.tiltPosition = this.entity?.attributes?.current_tilt_position || 0;
    }
  }

  private handleProgressOverlayChange(event: CustomEvent): void {
    if (event.detail !== null) {
      this.updatePosition(100 - event.detail)
    } 
  }

  private updatePosition(value: number): void {
    const domain = this.config.entity.split('.')[0];

    this.hass.callService(domain, 'set_cover_position', {
      entity_id: this.entity?.entity_id,
      position: value,
    });
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
    .cover-card {
      --base-action-card-active-background: #85B639;
      --base-action-card-active-color: #17161c;
    }
  `;
}
