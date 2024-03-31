import { Controlls } from "./controlls";
import { GameElementHandler } from "./elements/gameElementHandler";
import "./controllbar.css";
import { ControllerHandler } from "./controller/controllerHandler";
import { Figure } from "./figure";
import { ResetButton } from "./resetButton";
import { SavePointHandler } from "./savePointHandler";
import { ResetWarning } from "./resetWarning";
import { LeaderBoard } from "./leaderBoard";

export class Controllbar extends GameElementHandler {
  private _parent: HTMLElement;
    private _player: Figure;
    private _savePointHandler: SavePointHandler;
  constructor(parent: HTMLElement, player: Figure, savePointHandler: SavePointHandler) {
    super();
    this._parent = parent;
    this._player = player;
    this._savePointHandler = savePointHandler;
  }

  subElementInitialize(): void {
    const controllsElement = this._parent.querySelector<HTMLDivElement>(".controlls .icon");
    if(controllsElement) {
      const controlls = new Controlls(controllsElement, this._player);
      this.add(controlls);
      ControllerHandler.Instance.controll(controlls);
    }

    const resetButtonElement = this._parent.querySelector<HTMLDivElement>(".restart .icon");
    if(resetButtonElement) {
        const resetButton = new ResetButton(resetButtonElement);
        this.add(resetButton);
        ControllerHandler.Instance.controll(resetButton);
        const resetWarningElement = resetButtonElement.parentElement?.querySelector<HTMLDivElement>(".restartWarning");
        if(resetWarningElement) {
            const resetWarning = new ResetWarning(resetWarningElement, this._savePointHandler, this._player);
            ControllerHandler.Instance.controll(resetWarning);
        }
    }

    const leaderBoardElement = this._parent.querySelector<HTMLDivElement>(".leaderBoard");
    if(leaderBoardElement) {
      const leaderBoard = new LeaderBoard(leaderBoardElement);
      this.add(leaderBoard);
      ControllerHandler.Instance.controll(leaderBoard);
    }
  }
}