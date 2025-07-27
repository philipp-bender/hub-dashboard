import { LightCardConfig } from "./cards/light-card/light-card.types";
import { LovelaceConfig, LovelaceCard } from "./ha";

export interface HubLovelaceConfig extends LovelaceConfig {
  navigation?: LovelaceCard[];
  quick_navigation?: LovelaceCard[];
  chips?: LovelaceCard[];
}

export type CardConfig = LightCardConfig;
