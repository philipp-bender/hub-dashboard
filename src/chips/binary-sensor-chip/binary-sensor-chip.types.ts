import { LovelaceViewConfig } from "../../ha";

export type BinarySensorChipConfig = LovelaceViewConfig & {
  entities?: string[];
  type: string;
  text_singular: string;
  text_plural: string;
  icon: string;
  name?: string;
};
