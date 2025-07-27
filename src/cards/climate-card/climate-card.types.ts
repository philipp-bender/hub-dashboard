import { LovelaceCardConfig } from "../../ha";

export type ClimateCardConfig = LovelaceCardConfig & {
  entity: string;
  name?: string;
  icon?: string;
};
