import { DefaultGameElement } from "./gameElement";

export abstract class DomElement<ElementKey extends keyof HTMLElementTagNameMap> extends DefaultGameElement {
    protected element: HTMLElementTagNameMap[ElementKey];
    constructor(container: HTMLElement, element: ElementKey | HTMLElementTagNameMap[ElementKey]) {
        super();
        if(typeof element === "string") {
            this.element = document.createElement(element);
        }else {
            this.element = element;
        }
        
        this.addElement(container, this.element);
    }

    protected addElement(container: HTMLElement, element: HTMLElementTagNameMap[ElementKey]) {
        container.appendChild(element);
    }
    abstract refresh(): void;
}