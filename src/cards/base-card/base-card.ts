import { CardConfig } from "../../types";
import { HassEntity } from "home-assistant-js-websocket";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { HomeAssistant, LovelaceCard } from "../../ha";

export abstract class HubBaseCard<
  T extends CardConfig = CardConfig,
  E extends HassEntity = HassEntity,
> extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) protected config!: T;

  getCardSize(): number | Promise<number> {
    return 1
  }

  setConfig(config: T): void {
    if (!config.entity) {
      throw new Error("Entity must be specified");
    }

    this.config = config
  }

  protected get entity(): E | undefined {
    if (!this.config || !this.hass || !this.config.entity) 
      return undefined;

    const entityId = this.config.entity;
    return this.hass.states[entityId] as E;
  }
}