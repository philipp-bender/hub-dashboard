import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CoverEntity, HomeAssistant, isActive, isAvailable } from "../../../ha";
import { PREFIX_NAME } from "../../../const";
import { roundButtonStyles } from "../../../styles/index";
import setupCustomlocalize from "../../../localize";
import { horizontalListStyles } from "../../../styles/horizontal-list";

@customElement(`${PREFIX_NAME}-cover-card-tilt-controls`)
export class CoverCardTiltControls extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entity!: CoverEntity;

  private onChange(e: CustomEvent<number>): void {
    const value = e.detail;

    this.hass.callService("cover", 'set_cover_position', {
      entity_id: this.entity?.entity_id,
      position: 100 - value,
    });
  }

  private onTiltChange(e: CustomEvent<number>): void {
    const value = e.detail;

    this.hass.callService("cover", 'set_cover_tilt_position', {
      entity_id: this.entity?.entity_id,
      tilt_position: 100 - value,
    });
  }

  private onOpen(e: MouseEvent): void {
    e.stopPropagation();
    this.hass.callService("cover", "open_cover", {
      entity_id: this.entity.entity_id,
    });
  }

  private onClose(e: MouseEvent): void {
    e.stopPropagation();
    this.hass.callService("cover", "close_cover", {
      entity_id: this.entity.entity_id,
    });
  }

  private onStop(e: MouseEvent): void {
    e.stopPropagation();
    this.hass.callService("cover", "stop_cover", {
      entity_id: this.entity.entity_id,
    });
  }

  protected render(): TemplateResult {
    const customLocalize = setupCustomlocalize(this.hass);

    const currentPosition = this.entity?.attributes?.current_position || 0
    const position = 100 - currentPosition;
    const currentTiltPosition = this.entity?.attributes?.current_tilt_position || 0;
    const tiltPosition = 100 - currentTiltPosition

    return html`
      <div class="vertical-list">
        <div class="horizontal-list">
          <div class="horizontal-list__item">
              <div class="light-color-temp-controls__label">${customLocalize("hub.card.cover.position")}</div>
              <div class="light-color-temp-controls__value">
                <hub-slider-input
                    orientation="vertical"
                    class="light-color-temp-control"
                    .value=${position}
                    .disabled=${!isAvailable(this.entity)}
                    .inactive=${!isActive(this.entity)}
                    .min=${0}
                    .max=${100}
                    @drag-end=${this.onChange}
                    .size=${200}
                />
              </div>
          </div>
          <div class="horizontal-list__item">
              <div class="light-color-temp-controls__label">${customLocalize("hub.card.cover.tilt_position")}</div>
              <div class="light-color-temp-controls__value">
                <hub-slider-input
                    orientation="vertical"
                    class="light-color-temp-control"
                    .value=${tiltPosition}
                    .disabled=${!isAvailable(this.entity)}
                    .inactive=${!isActive(this.entity)}
                    .min=${0}
                    .max=${100}
                    @drag-end=${this.onTiltChange}
                    .size=${200}
                />
              </div>
          </div>
        </div>
        <div class="horizontal-list">
          <div class="horozonzal-list__item">
            <button class="round-button" @click=${this.onOpen}>
                <ha-state-icon icon="mdi:arrow-up"></ha-state-icon>
            </button>
            <button class="round-button" @click=${this.onStop}>
                <ha-state-icon icon="mdi:pause"></ha-state-icon>
            </button>
            <button class="round-button" @click=${this.onClose}>
                <ha-state-icon icon="mdi:arrow-down"></ha-state-icon>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [roundButtonStyles, horizontalListStyles, css``];
  }
}
