import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ClimateEntity, HomeAssistant, isActive, isAvailable } from "../../../ha";
import { PREFIX_NAME } from "../../../const";
import { roundButtonStyles } from "../../../styles/index";
import setupCustomlocalize from "../../../localize";
import { horizontalListStyles } from "../../../styles/horizontal-list";

@customElement(`${PREFIX_NAME}-climate-card-controls`)
export class CoverCardTiltControls extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entity!: ClimateEntity;



  protected render(): TemplateResult {
    const customLocalize = setupCustomlocalize(this.hass);


    return html`
      <div class="vertical-list">
        <div class="horizontal-list">
          
        </div>
        <div class="horizontal-list">
          <div class="horozonzal-list__item">
            
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [roundButtonStyles, horizontalListStyles, css``];
  }
}
