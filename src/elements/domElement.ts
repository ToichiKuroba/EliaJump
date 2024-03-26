import { DefaultGameElement } from "./gameElement";

export abstract class DomElement<ElementKey extends keyof HTMLElementTagNameMap> extends DefaultGameElement {
    private _element: HTMLElementTagNameMap[ElementKey];
    get element(): HTMLElementTagNameMap[ElementKey] {
        return this._element;
    }
    constructor(element: HTMLElementTagNameMap[ElementKey]);
    constructor(element: ElementKey | HTMLElementTagNameMap[ElementKey], container: HTMLElement);
    constructor(element: ElementKey | HTMLElementTagNameMap[ElementKey], container?: HTMLElement) {
        super();
        if (typeof element === "string") {
            this._element = document.createElement(element);
        } else {
            this._element = element;
        }

        if(container) {
            container.appendChild(this.element);
        }
    }

    abstract refresh(): void;
}