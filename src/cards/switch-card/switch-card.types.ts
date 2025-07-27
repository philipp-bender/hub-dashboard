import { LovelaceCardConfig } from "../../ha";

export type SwitchCardConfig = LovelaceCardConfig & {
  entity: string;
  name?: string;
  icon?: string;
  textOn?: string
  textOff?: string
};
