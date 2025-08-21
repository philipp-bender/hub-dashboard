import { html, css, TemplateResult } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import {
  ClimateEntity,
  HvacMode,
  supportsFeature,
} from "../../ha";
import { PREFIX_NAME } from "../../const";
import { ClimateCardConfig } from "./climate-card.types";
import { HubBaseCard } from "../base-card/base-card";
import "./controls/climate-card-controls";

const SLIDER_MODES: Record<HvacMode, any> = {
    auto: "full",
    cool: "end",
    dry: "full",
    fan_only: "full",
    heat: "start",
    heat_cool: "full",
    off: "full",
  };

export const UNIT_C = "°C";
export const UNIT_F = "°F";

@customElement(`${PREFIX_NAME}-climate-card`)
export class HubClimateCard extends HubBaseCard<ClimateCardConfig, ClimateEntity> {
  @query("hub-base-action-card") baseActionCardRef?: HTMLElement;
  @query("hub-modal") modalRef?: HTMLDialogElement;

  @state() private currentTemperature: number = 0;

  protected updated(changed: Map<string, any>) {
    if (changed.has("hass")) {
      console.log(this.entity)
      this.currentTemperature = this.entity?.attributes?.current_temperature || 0;
    }
  }

  private openModal() {
    this.modalRef?.showModal();
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }


    const heatCoolModes = this.entity?.attributes?.hvac_modes?.filter((m) =>
      ["heat", "cool", "heat_cool"].includes(m)
    ) || [];

    const mode = this.entity?.state || '';
    const sliderMode =
      SLIDER_MODES[heatCoolModes.length === 1 && ["off", "auto"].includes(mode)
          ? heatCoolModes[0]
          : mode
      ];

    const step = this.entity?.attributes?.target_temp_step || (this.hass.config.unit_system.temperature === UNIT_F ? 1 : 0.5)
    const action = this.entity?.attributes?.hvac_action;
    const name = this.config.name || this.entity?.attributes.friendly_name || this.config.entity;
    const icon = this.config.icon || "mdi:thermometer";
    const targetTemperature = this.entity?.attributes?.temperature || 0;
    const minTemperature = this.entity?.attributes?.min_temp || 0;
    const maxTemperature = this.entity?.attributes?.max_temp || 0;

    return html`
      <hub-base-action-card
        class="climate-card"
        .active=${true}
        .icon=${icon}
        .label=${this.currentTemperature}
        .subline=${name}
        .chevron=${true}
      >
        <ha-control-circular-slider
          .preventInteractionOnScroll=${true}
          .mode=${sliderMode}
          .value=${targetTemperature}
          .min=${minTemperature}
          .max=${maxTemperature}
          .step=${step}
          .current=${this.currentTemperature}
        >
        </ha-control-circular-slider>
      </hub-base-action-card>

      <hub-modal .title=${name}>
        <hub-climate-card-controls 
          .entity=${this.entity}
          .hass=${this.hass}
          .icon=${icon}
        />
      </hub-modal>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    .climate-card {
      --base-action-card-active-background: #2D8EFF;
      --base-action-card-active-color: #17161c;
    }

    ha-control-circular-slider {
      position: absolute;
      inset: 10%;
      width: 80%;
      height: 80%;
    }
  `;
}
