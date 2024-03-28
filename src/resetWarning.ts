import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";
import { Figure } from "./figure";
import { SavePointHandler } from "./savePointHandler";
import "./resetButton.css";

export class ResetWarning extends DomElement<"div"> {
    private _saveHandler: SavePointHandler;
    private _player: Figure;
    private noButton: HTMLDivElement | null;
    private yesButton: HTMLDivElement | null;
    constructor(element: HTMLDivElement, saveHandler: SavePointHandler, player: Figure) {
        super(element);
        this._saveHandler = saveHandler;
        this._player = player;
        this.yesButton = element.querySelector<HTMLDivElement>(".yesBtn");
        this.noButton = element.querySelector<HTMLDivElement>(".noBtn");
    }

    get YesButton() {
        return this.yesButton;
    }
    get NoButton() {
        return this.noButton;
    }

    refresh(): void {
    }

    reset() {
        this._player.goToStartPosition();
        this._saveHandler.deleteSavePoints();
    }

    close() {
        this.element.parentElement?.classList.remove("open");
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }
}