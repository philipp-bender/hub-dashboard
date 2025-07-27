import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-base-action-card`)
export class HubBaseActionCard extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) subline = "";
  @property({ type: String }) text = "";
  @property({ type: Boolean }) active = false;
  @property({ type: String }) icon = "emoji_objects";
  @property({ type: Boolean }) chevron = false;
  @property({ type: Boolean }) locked = false;
  @property({ type: Boolean }) editMode = false;

  @query(".base-action-card") baseActionCardRef?: HTMLDivElement;
  @query(".base-action-card__actions") actionRef?: HTMLDivElement;
  @query(".base-action-card__headline") labelRef?: HTMLHeadingElement;

  private handleClick(event: Event) {
    if (this.actionRef && this.actionRef.contains(event.target as Node)) {
      return;
    }
    if (!this.baseActionCardRef || !this.labelRef) {
      return;
    }

    this.dispatchEvent(new CustomEvent("click", { detail: event }));
  }

  render() {
    return html`
      <div
        class="base-action-card
          ${this.active && !this.editMode ? "base-action-card--active" : ""}
          ${this.chevron ? "base-action-card--chevron" : ""}
          ${this.editMode ? "base-action-card--edit-mode" : ""}"
        @click=${this.handleClick}
      >
        ${this.locked ? html`<div class="base-action-card__locked"><ha-icon icon="mdi:lock"></ha-icon></div>` : null}

        <div class="base-action-card__inner">
          <div class="base-action-card__content">
            <slot name="overlay"></slot>
            <slot name="icon">
              ${this.icon ? html`<ha-icon class="base-action-card__icon" .icon=${this.icon}></ha-icon>` : null}
            </slot>
            <div class="base-action-card__labels">
              <h3 class="base-action-card__headline">${this.label}</h3>
              <span class="base-action-card__subline">${this.subline}</span>
              ${this.text ? html`<span class="base-action-card__text text-size-sm">${this.text}</span>` : null}
            </div>
            <slot name="media"></slot>
            ${!this.editMode
              ? html`
                  <div class="base-action-card__actions">
                    <slot name="action"></slot>
                  </div>
                `
              : null}
          </div>
          ${this.chevron || this.editMode
            ? html`
                <svg class="base-action-card__chevron" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8,0 C8.55228475,0 9,0.44771525 9,1 L9,8 C9,8.55228475 8.55228475,9 8,9 L1,9 C0.44771525,9 0,8.55228475 0,8 C0,7.44771525 0.44771525,7 1,7 L7,7 L7,1 C7,0.487164161 7.38604019,0.0644928393 7.88337887,0.00672773133 L8,0 Z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              `
            : null}
        </div>
      </div>
    `;
  }

  static styles = css`
    .base-action-card {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: var(--base-action-card-background, #363640);
      color: var(--base-action-card-color, #fff);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      container-type: size;
    }

    .base-action-card.base-action-card--active {
      background-color: var(--base-action-card-active-background, #ffd300);
      color: var(--base-action-card-active-color, #17161c);
    }

    .base-action-card--active .base-action-card__subline,
    .base-action-card--active .base-action-card__text {
      color: var(--base-action-card-active-color, #23232a);
    }
    .base-action-card--chevron {
      border-radius: 24px 24px 0 24px;
    }
    .base-action-card--edit-mode .base-action-card__headline,
    .base-action-card--edit-mode .base-action-card__icon,
    .base-action-card--edit-mode .base-action-card__text,
    .base-action-card--edit-mode .base-action-card__subline {
      color: #444;
    }
    .base-action-card--edit-mode .base-action-card__actions {
      display: none;
    }
    .base-action-card__inner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 12px;
      z-index: 1;
    }
    .base-action-card__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0;
      z-index: 1;
    }
    .base-action-card__labels {
      z-index: 3;
    }
    .base-action-card__icon {
      width: 48px;
      height: 48px;
      font-size: 2rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .base-action-card__headline {
      font-size: 1rem;
      line-height: 1rem;
      margin-top: 0;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-block-start: 0;
      margin-block-end: 0;
    }
    .base-action-card__subline {
      font-size: 0.875rem;
      opacity: 0.7;
    }
    .base-action-card__text {
      color: #888;
      font-size: 0.875rem;
      display: block;
    }
    .base-action-card__actions {
      margin-top: 8px;
      display: block;
    }
    .base-action-card__locked {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .base-action-card__chevron {
      position: absolute;
      right: 8px;
      bottom: 8px;
      left: auto;
      width: 9px;
      height: 9px;
    }
  `;
}
