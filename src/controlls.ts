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
        this._open = !this.open;
    }
    private _open: boolean | undefined;
    get open(): boolean {
        return this._open === undefined ? this.element.parentElement?.classList.contains("open") ?? false : this._open;
    }

    refresh(): void {
        if (this._open !== undefined) {
            if (this._open) {
                this.element.parentElement?.classList.add("open");
            } else {
                this.element.parentElement?.classList.remove("open");
            }
        }
    }
    state: GameElementState = GameElementState.Active;
    calculateNextFrame(): void {
        if (this._player.speedY < 0) {
            this._open = false;
        } else if (this._player.state == GameElementState.Inactive && this._open === undefined) {
            this.element.parentElement?.classList.remove("open");
        }
    }

}