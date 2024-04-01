import { GameElementState } from "./elements/gameElementState";
import { Figure } from "./figure";
import { SavePointHandler } from "./savePointHandler";
import "./resetWarning.css";
import { ModalDomElementImpl } from "./elements/modalDomElement";
import { ControllbarElement } from "./controllbar";
import { RunHandler } from "./time/runHandler";
import { End } from "./end";

export class ResetWarning extends ModalDomElementImpl<"div"> implements ControllbarElement {
    private _saveHandler: SavePointHandler;
    private _player: Figure;
    private _runHandler: RunHandler;
    private _end: End;
    constructor(element: HTMLDivElement, saveHandler: SavePointHandler, player: Figure, runHandler: RunHandler, end: End) {
        super(element);
        this._saveHandler = saveHandler;
        this._player = player;
        this._runHandler = runHandler;
        this._end = end;
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
        this._player.resume();
        this._player.goToStartPosition();
        this._saveHandler.deleteSavePoints();
        if(this._end.reached) {
            this._end.reset();
        }else {
            this._runHandler.endRun(false);
        }
    }

    close() {
        this.element.classList.remove("open");
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }
}