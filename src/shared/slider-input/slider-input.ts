import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SliderInputOrientation, SliderInputType } from "./slider-input.types";
import { PREFIX_NAME } from "../../const";

@customElement(`${PREFIX_NAME}-slider-input`)
export class SliderInput extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: String }) unit: string = "%";
  @property({ type: String }) orientation: SliderInputOrientation = "horizontal";
  @property({ type: Boolean }) flip = false;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) size = 200;
  @property({ type: Number }) height = 64;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) tooltip = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: SliderInputType = "dimmable";

  private _onInput(e: Event) {
    const value = (e.target as HTMLInputElement).valueAsNumber;
    this.value = value;
    this.dispatchEvent(new CustomEvent("update", { detail: value }));
  }

  private _onChange(e: Event) {
    const value = (e.target as HTMLInputElement).valueAsNumber;
    this.value = value;
    this.dispatchEvent(new CustomEvent("drag-end", { detail: value }));
  }

  render() {
    const inputClasses = [
      "slider-input__input",
      this.orientation === "vertical" ? "slider-input__input--vertical" : "",
      this.type ? `slider-input__input--${this.type}` : "",
      this.flip ? "slider-input__input--rtl" : "",
    ].join(" ");

    const style = this.orientation === "vertical" ? `height: ${this.size}px;` : `width: ${this.size}px;`;

    return html`
      <div class="slider-input">
        ${this.tooltip ? html`<div class="slider-input__tooltip">${this.value}${this.unit}</div>` : null}
        <input
          type="range"
          class="${inputClasses}"
          style="${style}"
          .value=${String(this.value)}
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.step)}
          @input=${this._onInput}
          @change=${this._onChange}
          ?disabled=${this.disabled}
        />
      </div>
    `;
  }

  static styles = css`
    .slider-input {
      position: relative;
      display: inline-block;
    }
    .slider-input__tooltip {
      position: absolute;
      top: -2.5em;
      left: 50%;
      width: 60px;
      height: 1em;
      text-align: center;
      color: #81b5cc;
      font-weight: bold;
      white-space: nowrap;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 2;
    }
    .slider-input__input {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      cursor: pointer;
      outline: none;
      overflow: hidden;
      border-radius: 20px;
      background: #b0b0b0;
      height: 40px;
      transition: background 0.2s;
    }
    .slider-input__input--vertical {
      writing-mode: vertical-lr;
      width: 40px;
      height: 200px;
    }
    .slider-input__input--rtl {
      direction: rtl;
    }
    /* Track */
    .slider-input__input::-webkit-slider-runnable-track {
      height: 40px;
      background: #b0b0b0;
      border-radius: 20px;
    }
    .slider-input__input::-moz-range-track {
      height: 40px;
      background: #b0b0b0;
      border-radius: 20px;
    }
    /* Thumb */
    .slider-input__input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: 40px;
      width: 40px;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: -420px 0 0 400px #ffd300;
      transition: box-shadow 0.2s;
    }
    .slider-input__input--shutter::-webkit-slider-thumb {
      box-shadow: -420px 0 0 400px #85b639;
    }
    .slider-input__input--heating::-webkit-slider-thumb {
      box-shadow: -420px 0 0 400px #2d8eff;
    }
    .slider-input__input--vertical::-webkit-slider-thumb {
      box-shadow: 0 -420px 0 400px #85b639;
    }
    .slider-input__input::-moz-range-thumb {
      height: 40px;
      width: 40px;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: -420px 0 0 400px #ffd300;
      transition: box-shadow 0.2s;
    }
    .slider-input__input--shutter::-moz-range-thumb {
      box-shadow: -420px 0 0 400px #85b639;
    }
    .slider-input__input--heating::-moz-range-thumb {
      box-shadow: -420px 0 0 400px #2d8eff;
    }
    .slider-input__input--vertical::-moz-range-thumb {
      box-shadow: 0 -420px 0 400px #85b639;
    }
  `;
}
