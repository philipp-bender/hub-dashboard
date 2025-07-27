import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import HubUtil from "../../utils/hub-utils";
import { HomeAssistant } from "../../ha";
import { LightChipConfig } from "./light-chip.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-light-chip`)
export class HubLightChip extends LitElement {
  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: LightChipConfig;

  @state() private _lightsOn: string[] = [];
  @state() private _lightsOnCards: any[] = [];

  static styles = css`
    button {
      background: var(--accent-color);
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: var(--accent-color-dark, #444);
    }
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
      this._updateLights();
    }
  }

  private async _updateLights() {
    const helpers = await (window as any).loadCardHelpers();

    const lights = Object.entries(this.hass.states)
      .filter(([eid, stateObj]: [string, any]) => eid.startsWith("light.") && stateObj.state === "on")
      .map(([eid]) => eid);

    const extraEntities = Array.isArray(this.config?.extra_entities) ? this.config.extra_entities : [];
    const extras = extraEntities.filter((eid: string) => {
      const stateObj = this.hass.states[eid];
      return stateObj && stateObj.state === "on";
    });

    this._lightsOn = [...lights, ...extras];
    this._lightsOnCards = await HubUtil.createCardsFromConfig(
      this._lightsOn.map((entity) => ({
        type: "tile",
        entity: entity,
        features_position: "bottom",
        vertical: true,
        tap_action: { action: "toggle" },
      })),
      helpers,
      this.hass,
    );
  }

  private _toggleAllOff() {
    this._lightsOn.forEach((light) => {
      this.hass.callService("light", "turn_off", {
        entity_id: light,
      });
    });
    this._closeModal();
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
    const count = this._lightsOn.length;
    const text =
      count === 1
        ? this.config?.text_singular || "1 Licht an"
        : (this.config?.text_plural || `${count} Lichter an`).replace("{count}", `${count}`);

    if (count === 0) return html``;

    return html`
      <hub-base-button-card
        .icon="${this.config?.icon}"
        .label="${this.config?.name}"
        .subline="${text}"
        @click=${this._openModal}
      ></hub-base-button-card>

      <hub-modal title="Aktive Lichter">
        <div class="hub-light-chip__modal">${this._lightsOnCards}</div>
        <div slot="actions">
          <hub-base-button-card
            icon="mdi:light-switch-off"
            label="Alle aus"
            @click=${this._toggleAllOff}
          ></hub-base-button-card>
        </div>
      </hub-modal>
    `;
  }
}
