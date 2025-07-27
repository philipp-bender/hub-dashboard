import { LovelaceViewConfig } from "../../ha";

export type ContainerGroupConfig = LovelaceViewConfig & {
  heading?: string;
  type: string;
  columns?: number;
  rows?: number;
  cards: Array<{
    type: string;
    column_span?: number;
    row_span?: number;
  }>;
};
