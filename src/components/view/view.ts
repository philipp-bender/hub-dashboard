import { LitElement, html, css, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import HubUtil from "../../utils/hub-utils";
import { roundButtonStyles, viewportStyles } from "../../styles/index";
import { HomeAssistant, LovelaceCard } from "../../ha";
import { ViewConfig } from "./view.types.js";
import { HubModal } from "../../shared/modal/modal";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-view`)
export class HubView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public sections: LovelaceCard[] = [];
  @property({ type: Object }) public config?: ViewConfig;

  @state() private _navigation: LovelaceCard[] = [];
  @state() private _quickNavigation: LovelaceCard[] = [];
  @state() private _chips: LovelaceCard[] = [];

  @state() private leftShadow = false;
  @state() private rightShadow = false;

  @query("#navigationModal") private _modal!: HubModal;
  @query(".scroll") private scrollContainer!: HTMLDivElement;

  private _navigationConfig: any[] = [];
  private _quickNavigationConfig: any[] = [];
  private _chipsConfig: any[] = [];

  protected async firstUpdated(_changedProperties: PropertyValues) {
    this.scrollContainer.addEventListener("scroll", this.handleScroll.bind(this));
    this.handleScroll();

    const sidebarEl = this.shadowRoot!.querySelector(".hub-layout") as HTMLElement;
    const sidebarWidth = sidebarEl.getBoundingClientRect()?.x ?? 0;

    this.scrollContainer.style.setProperty("--sidebar-width", `${sidebarWidth}px`);
    this.scrollContainer.style.setProperty("--header-height", `${HubUtil.getHeaderHeight()}px`);

    this._quickNavigationConfig = HubUtil.getQuickNavigationItems();
    this._navigationConfig = HubUtil.getNavigationItems();
    this._chipsConfig = HubUtil.getChipItems();

    const helpers = await (window as any).loadCardHelpers();

    this._navigation = await HubUtil.createCardsFromConfig(this._navigationConfig, helpers, this.hass);
    this._quickNavigation = await HubUtil.createCardsFromConfig(this._quickNavigationConfig, helpers, this.hass);
    this._chips = await HubUtil.createCardsFromConfig(this._chipsConfig, helpers, this.hass);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("hass")) {
      this._navigation.forEach((card) => (card.hass = this.hass));
      this._quickNavigation.forEach((card) => (card.hass = this.hass));
      this._chips.forEach((card) => (card.hass = this.hass));
    }
  }

  public async setConfig(config: any) {
    this.config = config;
  }

  private handleScroll(): void {
    const el = this.scrollContainer;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    this.leftShadow = scrollLeft > 0;
    this.rightShadow = scrollLeft < maxScrollLeft;
  }

  protected render() {
    return html`
      <div class="hub-layout">
        <aside class="sidebar">
          <nav class="nav">
            <button
              class="round-button"
              name="Menu"
              icon=""
              @click="${() => this._modal?.showModal?.()}"
              aria-label="Menu"
            >
              <ha-state-icon icon="mdi:menu"></ha-state-icon>
            </button>

            ${this._quickNavigation}
          </nav>
          <nav class="nav">
            <!-- bottom nav -->
          </nav>
        </aside>

        <div class="body">
          <header>
            <div>${this.config?.title || "Dashboard"}</div>
          </header>

          <main>
            <div
              class="scroll ${this.leftShadow ? "scroll__left-shadow" : ""} ${this.rightShadow
                ? "scroll__right-shadow"
                : ""}"
            >
              <div class="inner">
                ${this.sections.map((card) => html`<div style="--base-column-count: 24;">${card}</div>`)}
              </div>
            </div>
          </main>

          <footer>${this._chips}</footer>
        </div>
      </div>

      <hub-modal id="navigationModal" title="Lichter an?">
        <div class="navigation-modal__grid">${this._navigation}</div>
      </hub-modal>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      roundButtonStyles,
      viewportStyles,
      css`
        .hub-layout {
          display: flex;
          height: 100vh;
          background: linear-gradient(90deg, #0a090d 0%, #201f25 100%);
          color: white;
          font-family: sans-serif;
        }

        .sidebar {
          width: 80px;
          display: flex;
          flex: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem 0;
        }

        @media (min-width: var(--viewport-md)) {
          .sidebar {
            width: 104px;
          }
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .body {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: calc(100vw - 104px);
          overflow: hidden;
        }

        .scroll {
          position: relative;
          display: flex;
          overflow: auto;
          height: 100%;
          padding-right: 40px;
        }

        .scroll__left-shadow::before {
          content: "";
          position: fixed;
          left: calc(var(--sidebar-width) + 80px);
          top: 0;
          height: calc(100% - 104px);
          width: 150px;
          z-index: 2;
          box-shadow: inset 40px 0 40px -7px #0a090d;
          pointer-events: none;
        }

        .scroll__right-shadow::after {
          content: "";
          position: fixed;
          right: 0;
          top: 0;
          height: calc(100% - 104px);
          width: 150px;
          z-index: 2;
          box-shadow: inset -40px 0 40px -7px #201f25;
          pointer-events: none;
        }

        .inner {
          display: flex;
          gap: 40px;
        }

        header {
          padding: 20px 20px 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        main {
          flex: 1;
          overflow: auto;
        }

        footer {
          height: 64px;
          width: 100%;
          padding: 20px 20px 20px 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
        }

        .navigation-modal__grid {
          display: grid;
          grid-template-columns: 1fr;
          width: 100%;
          gap: 8px;
        }

        @media (min-width: var(--viewport-md)) {
          .navigation-modal__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .scroll__left-shadow::before {
            left: calc(var(--sidebar-width) + 104px);
          }
        }
      `,
    ];
  }
}
