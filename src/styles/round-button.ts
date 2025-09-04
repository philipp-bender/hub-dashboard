import { css } from "lit";
import { viewportStyles } from "./global";

export const roundButtonStyles = css`
  .round-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #363640;
    border-radius: 999px;
    color: #ffffff;
    width: 48px;
    height: 48px;
    cursor: pointer;
    border: 0;
  }

  @media (min-width: var(--viewport-md)) {
    .round-button {
      width: 64px;
      height: 64px;
    }
  }

  .round-button:hover {
    background-color: #4a4a57;
  }

  ha-icon {
    color: #ffffff;
    --mdc-icon-size: 24px;
    width: 24px;
    height: 24px;
  }
`;
