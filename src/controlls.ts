import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";
import { Figure } from "./figure";
import "./controlls.css";
import { ControllbarElement } from "./controllbar";

export class Controlls extends DomElement<"div"> implements ControllbarElement {
    private _player: Figure;
    constructor(element: HTMLDivElement, player: Figure) {
        super(element);
        this._player = player;
    }

    toggleOpen(): void {
        this.open = !this.open;
    }
    open: boolean = true;

    refresh(): void {
        if(this.open){
            this.element.parentElement?.classList.add("open");
        }else {
            this.element.parentElement?.classList.remove("open");
        }
    }
    state: GameElementState = GameElementState.Active;
    calculateNextFrame(): void {
        if(this._player.speedY < 0) {
            this.open = false;
        }
    }

}