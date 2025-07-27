import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import HubUtil from "../../utils/hub-utils";
import { HomeAssistant } from "../../ha";
import { BinarySensorChipConfig } from "./binary-sensor-chip.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-binary-sensor-chip`)
export class HubBinarySensorChip extends LitElement {
  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: BinarySensorChipConfig;

  @state() private _sensorsOn: string[] = [];
  @state() private _sensorsOnCards: any[] = [];

  static styles = css`
    .hub-light-chip__modal {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      width: 100%;
      gap: 20px;
    }
  `;

  setConfig(config: any) {
    this.config = config;
  }

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) {
      this._updateSensors();
    }
  }

  private async _updateSensors() {
    const helpers = await (window as any).loadCardHelpers();

    const entities = Array.isArray(this.config?.entities) ? this.config.entities : [];
    this._sensorsOn = entities.filter((eid: string) => {
      const stateObj = this.hass.states[eid];
      return stateObj && stateObj.state === "on";
    });

    this._sensorsOnCards = await HubUtil.createCardsFromConfig(
      this._sensorsOn.map((entity) => ({
        type: "tile",
        entity: entity,
        features_position: "bottom",
        icon: this.config?.icon,
        vertical: true,
        tap_action: { action: "none" },
        icon_tap_action: { action: "none" },
      })),
      helpers,
      this.hass,
    );
  }

  private _openModal() {
    const modal = this.renderRoot.querySelector("hub-modal") as any;
    modal?.showModal();
  }

  private _closeModal() {
    const modal = this.renderRoot.querySelector("hub-modal") as any;
    modal?.hideModal();
  }

  render() {
    const count = this._sensorsOn?.length ?? 0;
    const text =
      count === 1
        ? this.config?.text_singular || "1 Sensor an"
        : (this.config?.text_plural || `${count} Sensoren an`).replace("{count}", `${count}`);

    if (count === 0) return html``;

    return html`
      <hub-base-button-card
        .icon="${this.config?.icon}"
        .label="${this.config?.name}"
        .subline="${text}"
        @click=${this._openModal}
      ></hub-base-button-card>

      <hub-modal title="Aktive Sensoren">
        <div class="hub-light-chip__modal">${this._sensorsOnCards}</div>
      </hub-modal>
    `;
  }
}
