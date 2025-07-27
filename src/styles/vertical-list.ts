import { css } from "lit";

export const verticalListStyles = css`
  .vertical-list {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .vertical-list__item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
