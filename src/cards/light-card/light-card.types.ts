import { LovelaceCardConfig } from "../../ha";

export type LightCardConfig = LovelaceCardConfig & {
  entity: string;
  name?: string;
  icon?: string;
  quick_action?: boolean;
};
