import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";

export class Controlls extends DomElement<"div"> {
    open: Boolean = true;

    refresh(): void {
        if(this.open){
            this.element.classList.add("open");
            this.element.classList.remove("closed");
        }else {
            this.element.classList.add("closed");
            this.element.classList.remove("open");
        }
    }
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }

}