import { LovelaceCardConfig } from "../../ha";

export type CoverCardConfig = LovelaceCardConfig & {
  entity: string;
  name?: string;
  icon?: string;
  quick_action?: boolean;
  min_position?: number
};
