import { LovelaceViewElement } from "../ha";
import { HubLovelaceConfig } from "../types";

export default class HubUtil {
  static getLovelacePanel(): LovelaceViewElement | null | undefined {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace") as LovelaceViewElement | null | undefined;
    return panel;
  }

  static getRoot() {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const panel = main?.shadowRoot?.querySelector("ha-panel-lovelace") as LovelaceViewElement | null | undefined;
    const root = panel?.shadowRoot?.querySelector("hui-root");
    return root;
  }

  static getHeaderHeight() {
    const root = HubUtil.getRoot();
    const header = root?.shadowRoot?.querySelector(".header") as HTMLElement;

    return header?.offsetHeight || 0;
  }

  static getConfig() {
    const panel = this.getLovelacePanel();
    return panel?.lovelace?.config || null;
  }

  static getViews() {
    const config = this.getConfig();
    return config?.views || null;
  }

  static getNavigationItems() {
    const config = this.getConfig() as HubLovelaceConfig;
    return config?.navigation || [];
  }

  static getQuickNavigationItems() {
    const config = this.getConfig() as HubLovelaceConfig;
    return config?.quick_navigation || [];
  }

  static getChipItems() {
    const config = this.getConfig() as HubLovelaceConfig;
    return config?.chips || [];
  }

  static async createCardsFromConfig(configArray, helpers, hass) {
    if (!Array.isArray(configArray)) return [];

    const cards = await Promise.all(
      configArray.map(async (cardConfig) => {
        const card = await helpers.createCardElement(cardConfig);
        card.hass = hass;
        return card;
      }),
    );

    return cards;
  }
}
