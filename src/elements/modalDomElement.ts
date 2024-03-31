import { DomElement } from "./domElement";
import { GameElement } from "./gameElement";
import "./modal.css";

export abstract class ModalDomElementImpl<ElementType extends keyof HTMLElementTagNameMap> extends DomElement<ElementType> implements ModalDomElement {
    get open() {
        return this.element.classList.contains("open");
    }

    get icon() {
        return this.element.querySelector<HTMLElement>(".icon");
    }

    get modal() {
        return this.element.querySelector<HTMLElement>(".modal");
    }

    toggleOpen() {
        this.element.classList.toggle("open");
    }
}

export function isModalDomElement(element: GameElement) : element is ModalDomElement {
    const modalElement = (element as ModalDomElement);
    return typeof modalElement.toggleOpen === "function" && modalElement.icon !== undefined;
}

export interface ModalDomElement extends GameElement {
    toggleOpen(): void;
    get icon(): HTMLElement | null;
}