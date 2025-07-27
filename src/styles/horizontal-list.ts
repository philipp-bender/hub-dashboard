import { css } from "lit";

export const horizontalListStyles = css`
  .horizontal-list {
    display: flex;
    flex-direction: row;
    gap: 40px;
  }

  .horizontal-list__item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
