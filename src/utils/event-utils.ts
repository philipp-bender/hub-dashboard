export default class EventUtil {
  static isEventInsideElement(event: Event, root: HTMLElement, selector: string): boolean {
    if (!root || !selector) return false;
    if (!(event instanceof PointerEvent)) return false;

    const elements = Array.from(root.querySelectorAll(selector));

    if (root.shadowRoot) {
        elements.push(...Array.from(root.shadowRoot.querySelectorAll(selector)));
    }

    return elements.some(el => el.contains(event.target as Node));
    }
}
