import { ControllbarElement } from "./controllbar";
import { GameElementState } from "./elements/gameElementState";
import { ModalDomElementImpl } from "./elements/modalDomElement";
import "./leaderBoard.css";

export class LeaderBoard extends ModalDomElementImpl<"div"> implements ControllbarElement {
    refresh(): void {
    }

    state: GameElementState = GameElementState.Active;
    calculateNextFrame(): void {
        
    }

}