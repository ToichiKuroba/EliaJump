import { GameElementState } from "./elements/gameElementState";
import { Figure } from "./figure";
import { SavePointHandler } from "./savePointHandler";
import "./resetWarning.css";
import { ModalDomElementImpl } from "./elements/modalDomElement";
import { ControllbarElement } from "./controllbar";

export class ResetWarning extends ModalDomElementImpl<"div"> implements ControllbarElement {
    private _saveHandler: SavePointHandler;
    private _player: Figure;
    constructor(element: HTMLDivElement, saveHandler: SavePointHandler, player: Figure) {
        super(element);
        this._saveHandler = saveHandler;
        this._player = player;
    }

    get YesButton() {
        return this.modal?.querySelector<HTMLDivElement>(".yesBtn") ?? null;
    }
    get NoButton() {
        return this.modal?.querySelector<HTMLDivElement>(".noBtn") ?? null;
    }

    refresh(): void {
    }

    reset() {
        this._player.goToStartPosition();
        this._saveHandler.deleteSavePoints();
    }

    close() {
        this.element.classList.remove("open");
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }
}