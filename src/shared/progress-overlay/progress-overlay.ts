import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PREFIX_NAME } from '../../const';
import interact from 'interactjs';

@customElement(`${PREFIX_NAME}-progress-overlay`)
export class ProgressOverlay extends LitElement {
  @property({ type: Number }) progress = 0;
  @property({ type: Boolean }) reverse = false;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) showStipes = false;
  @property({ type: Number }) tiltProgress = 0;

  @query(".progress-overlay") private targetRef!: HTMLDivElement;

  private height: number = 0
  private startY: number = 0
  private currentProgress: number = 0
  private active: boolean = false
  private moved: boolean = false

  protected async updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('progress')) {
      this.currentProgress = this.progress;
      await this.requestUpdate()
    }

    if (changedProps.has('tiltProgress')) {
      this.targetRef.style.setProperty('--jalousie-stripe-percentage', `${this.tiltProgress}%`)
    }
  }

  private initComponent(): void {
    if (!this.targetRef)
      return

    this.height = this.targetRef.offsetHeight;
    const interactable = interact(this.targetRef)

    interactable.draggable({
        listeners: {
            onstart: this.onDragStart.bind(this),
            move: this.onDragMove.bind(this),
            onend: this.onDragEnd.bind(this),
        }
    })

    interactable.on('dragmove', this.onDragMove.bind(this))
    interactable.on('dragend', this.onDragEnd.bind(this))
    interactable.on('dragstart', this.onDragStart.bind(this))

    this.targetRef.addEventListener('click', (e) => {
      if (this.moved) {
        e.preventDefault();
        e.stopImmediatePropagation(); // Optional: falls du Click-Handler hart blockieren willst
        this.moved = false; // reset für nächste Interaktion
      }
    }, true); 
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.initComponent();
  }

  protected firstUpdated() {
    this.initComponent();
  }

  private calculateValue(event: Interact.InteractEvent): number {
    const diffY = event.pageY - this.startY;
    if (Math.abs(diffY) > 5) 
      this.moved = true

    const diffValue = ((this.reverse ? diffY : -diffY) / this.height) * (this.max - this.min);
    const newValue = this.progress + diffValue;
    return Math.min(Math.max(newValue, this.min), this.max);
  }

  private onDragStart(event: Interact.InteractEvent) {
    this.startY = event.page.y
    this.active = true
    this.moved = false;
  }

  private async onDragMove(event: Interact.InteractEvent) {
    this.currentProgress = this.calculateValue(event)
    await this.requestUpdate()
  }

  private async onDragEnd(event: Interact.InteractEvent) {
    event.stopPropagation()
    event.preventDefault()

    this.currentProgress = this.calculateValue(event)
    this.dispatchEvent(new CustomEvent("update", { detail: this.currentProgress }));
    this.active = true
    
    await this.requestUpdate()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.targetRef) {
      interact(this.targetRef).unset();
    }
  }

  render() {
    const barStyle = this.reverse
      ? `bottom: ${100 - this.currentProgress}%;`
      : `top: ${100 - this.currentProgress}%;`;

    return html`
      <div class="progress-overlay ${this.reverse ? 'progress-overlay--reverse' : ''}">
        <div
          class="progress-overlay__bar ${this.active ? 'progress-overlay__bar--active' : ''} ${this.showStipes && this.tiltProgress < 100 ? 'progress-overlay__bar--tilt' : ''}"
          .style="${barStyle}"
        ></div>
      </div>
    `;
  }

  static styles = css`
    .progress-overlay {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      touch-action: none;
    }

    .progress-overlay__bar {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%);
    }

    .progress-overlay__bar--tilt::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg,
        #FFFFFF22 calc(var(--jalousie-stripe-percentage) / 2),
          transparent calc(var(--jalousie-stripe-percentage) / 2),
          transparent 50%,
        #FFFFFF22 50%,
        #FFFFFF22 calc(50% + calc(var(--jalousie-stripe-percentage) / 2)),
          transparent calc(50% + calc(var(--jalousie-stripe-percentage) / 2)),
          transparent 100%
      );
      background-size: 100px 100px; 
    }


    .progress-overlay__bar--active::after {
      opacity: 1;
    }

    .progress-overlay__bar::after {
      content: "";
      position: absolute;
      width: 30px;
      height: 4px;
      background: #18181b;
      border-radius: 2px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      opacity: 0.3;
      transition: all 0.25s ease-out;
    }

    .progress-overlay--reverse .progress-overlay__bar {
      top: 0;
      bottom: unset;
      background: linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);
    }

    .progress-overlay--reverse .progress-overlay__bar::after {
      bottom: 0;
      transform: translateX(-50%) translateY(-10px);
    }
  `;
}