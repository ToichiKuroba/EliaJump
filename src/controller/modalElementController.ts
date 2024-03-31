import { ModalDomElement } from "../elements/modalDomElement";
import { GameElementController } from "./gameElementController";

export class ModalElementController extends GameElementController {
    private _modalElement: ModalDomElement;
    private onButtonClick = () => this._modalElement.toggleOpen();
    addListeners(): void {
        this._modalElement.icon?.addEventListener("click", this.onButtonClick);
    }


    removeListeners(): void {
        this._modalElement.icon?.removeEventListener("click", this.onButtonClick);
    }

    constructor(modalElement: ModalDomElement) {
        super(modalElement);
        this._modalElement = modalElement;
    }
}