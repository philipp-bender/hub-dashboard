import { LovelaceViewConfig } from "../../ha";

export type RoundButtonConfig = LovelaceViewConfig & {
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
  tap_action?: {
    action: string;
    entity?: string;
    service?: string;
    service_data?: Record<string, any>;
    navigation_path?: string
  };
};
