import { DomElement } from "../elements/domElement";
import { GameElementController } from "./gameElementController";

export class ClickController<ElementKey extends keyof HTMLElementTagNameMap> extends GameElementController {
    private _element: DomElement<ElementKey>;
    private _clickFunction: (ev: MouseEvent) => void;
    constructor(element: DomElement<ElementKey>, clickFunction: (ev: MouseEvent) => void){
        super(element);
        this._element = element;
        this._clickFunction = clickFunction;
    }

    addListeners(): void {
        const element: HTMLElement = this._element.element;
        element.addEventListener("click", this._clickFunction);
    }
    
    removeListeners(): void {
        const element: HTMLElement = this._element.element;
        element.removeEventListener("click", this._clickFunction);
    }
}