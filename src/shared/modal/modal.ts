import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { roundButtonStyles } from "../../styles/index";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-modal`)
export class HubModal extends LitElement {
  @property({ type: String }) title = "";

  @state() private dialog: HTMLDialogElement | null = null;

  protected firstUpdated() {
    this.dialog = this.renderRoot.querySelector("dialog");
    this.dialog?.addEventListener("close", () => {
      this.dispatchEvent(new CustomEvent("modal-closed"));
    });
  }

  public showModal() {
    this.dialog?.showModal();
    this.dispatchEvent(new CustomEvent("modal-opened"));
  }

  public hideModal() {
    this.dialog?.close();
  }

  render() {
    return html`
      <dialog>
        <div class="modal__inner">
          ${this.title ? html`<h2 class="modal__title">${this.title}</h2>` : null}
          <div class="modal__content">
            <slot></slot>
          </div>
          <div class="modal__actions">
            <div class="modal__left">
              <button class="round-button" name="Close" icon="" @click=${this.hideModal} aria-label="Close">
                <ha-state-icon icon="mdi:close"></ha-state-icon>
              </button>
            </div>
            <div class="modal__pagination">
              <slot name="pagination"></slot>
            </div>
            <div class="modal__right">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </dialog>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      roundButtonStyles,
      css`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(30px);
        }
        dialog {
          border: none;
          border-radius: 1.5rem;
          padding: 0;
          width: 100%;
          height: 100%;
          margin: 20px;
          background: linear-gradient(90deg, #0a090d 0%, #201f25 100%);
          color: white;
          position: relative;
        }
        .modal__inner {
          display: flex;
          height: calc(100% - 40px);
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .modal__title {
          font-size: 1.5rem;
          width: 100%;
          margin: 0;
          margin-bottom: 20px;
        }
        .modal__content {
          flex: 1;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .modal__actions {
          position: absolute;
          display: inline-flex;
          justify-content: space-between;
          bottom: 20px;
          left: 20px;
          right: 20px;
        }
        .modal__left,
        .modal__right,
        .modal__pagination {
          width: 33%;
          display: flex;
          align-items: center;
        }
        .modal__right {
          justify-content: flex-end;
        }
        .modal__pagination {
          justify-content: center;
        }
        ::slotted([slot="actions"]) {
          display: flex;
          gap: 0.5rem;
        }
      `,
    ];
  }
}
