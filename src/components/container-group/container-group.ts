import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContainerGroupConfig } from "./container-group.types";
import { HomeAssistant } from "../../ha";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-container-group`)
export class HubContainerGroup extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: ContainerGroupConfig;
  @property({ type: Array, attribute: false }) public cards: any[] = [];

  async setConfig(config: any) {
    this.config = config;
  }

  protected firstUpdated() {
    const el = this.renderRoot.querySelector(".container-group__inner") as HTMLElement;
    if (!el) return;

    const height = el.offsetHeight;
    const rows = this.config?.rows || 4;
    const rowHeight = rows ? height / rows - 20 : 100;
    el.style.setProperty("--grid-size", `${rowHeight}px`);
    el.style.setProperty("--grid-rows", `${rows}`);
    el.style.setProperty("--grid-columns", `${this.config?.columns || 4}`);
  }

  render() {
    return html`
      <div class="container-group">
        <div class="container-group__track">
          <div class="container-group__headline">
            <h3 class="text-size-lg">${this.config?.heading || ""}</h3>
            <div class="container-group__actions">
              <!-- TODO -->
            </div>
          </div>
        </div>
        <div class="container-group__inner">
          <slot>
            ${this.cards?.map(
              (card, index) => html`
                <div
                  style="
                            grid-column: span ${this.config.cards?.[index]?.column_span || 1};
                            grid-row: span ${this.config.cards?.[index]?.row_span || 1};
                        "
                >
                  ${card}
                </div>
              `,
            )}
          </slot>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      css`
        .container-group {
          display: flex;
          flex-direction: column;
          position: relative;
          color: var(--color-white, #fff);
          height: 100%;
          border-radius: 28px;
        }
        .container-group__actions {
          display: inline-flex;
          gap: 10px;
          margin-left: 20px;
        }
        .container-group__track {
          display: flex;
          align-items: center;
          position: relative;
          min-height: 52px;
        }
        .container-group__headline {
          left: 0;
          position: sticky;
          display: inline-flex;
          align-items: center;
          z-index: 1;
        }
        .container-group__inner {
          display: grid;
          grid-template-columns: repeat(var(--grid-columns), var(--grid-size));
          grid-template-rows: repeat(var(--grid-rows), var(--grid-size));
          height: 100%;
          gap: 12px;
        }

        @media (min-width: var(--viewport-md)) {
          .container-group__inner {
            gap: 20px;
          }
        }
      `,
    ];
  }
}
