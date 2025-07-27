import { LovelaceViewConfig } from "../../ha";

export type LightChipConfig = LovelaceViewConfig & {
  extra_entities?: string[];
  type: string;
  text_singular: string;
  text_plural: string;
  icon: string;
  name?: string;
};
