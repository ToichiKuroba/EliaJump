import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";
import "./resetButton.css";

export class ResetButton extends DomElement<"div"> {
    refresh(): void {
    }

    showResetWarning() {
        this.element.parentElement?.classList.add("open");
    }


    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }
}