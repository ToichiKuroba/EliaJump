import { Controlls } from "./controlls";
import { GameElementHandler } from "./elements/gameElementHandler";
import "./controllbar.css";
import { ControllerHandler } from "./controller/controllerHandler";
import { Figure } from "./figure";
import { SavePointHandler } from "./savePointHandler";
import { ResetWarning } from "./resetWarning";
import { LeaderBoard } from "./time/leaderBoard";
import { GameElement } from "./elements/gameElement";
import { RunHandler } from "./time/runHandler";
import { End } from "./end";

export interface ControllbarElement extends GameElement {
  get open(): boolean,
  toggleOpen(): void;
}

export class Controllbar extends GameElementHandler {
  private _parent: HTMLElement;
    private _player: Figure;
    private _savePointHandler: SavePointHandler;
    private _controllbarElements: ControllbarElement[] = [];
    private _openElement: ControllbarElement | null = null;
  private _runHandler: RunHandler;
  private _end: End;
  constructor(parent: HTMLElement, player: Figure, savePointHandler: SavePointHandler, runHandler: RunHandler, end: End) {
    super();
    this._parent = parent;
    this._player = player;
    this._savePointHandler = savePointHandler;
    this._runHandler = runHandler;
    this._end = end;
  }

  calculateNextFrame(): void {
      super.calculateNextFrame();
      if(this._openElement?.open === false){
        this._openElement = null;
      }
      for (let index = 0; index < this._controllbarElements.length; index++) {
        const controllbarElement = this._controllbarElements[index];
        if(controllbarElement.open && this._openElement != controllbarElement) {
          if(this._openElement) {
            this._openElement.toggleOpen();
            this._openElement = null;
          }

          this._openElement = controllbarElement;
        }
      }
  }

  add(element: ControllbarElement): void {
      super.add(element);
      this._controllbarElements.push(element);
  }

  subElementInitialize(): void {
    const controllsElement = this._parent.querySelector<HTMLDivElement>(".controlls .icon");
    if(controllsElement) {
      const controlls = new Controlls(controllsElement, this._player);
      this.add(controlls);
      ControllerHandler.Instance.controll(controlls);
    }

    const resetWarningElement = this._parent.querySelector<HTMLDivElement>(".restart");
    if(resetWarningElement) {
        const resetWarning = new ResetWarning(resetWarningElement, this._savePointHandler, this._player, this._runHandler, this._end);
        this.add(resetWarning);
        ControllerHandler.Instance.controll(resetWarning);
    }

    const leaderBoardElement = this._parent.querySelector<HTMLDivElement>(".leaderBoard");
    if(leaderBoardElement) {
      const leaderBoard = new LeaderBoard(leaderBoardElement);
      this.add(leaderBoard);
      ControllerHandler.Instance.controll(leaderBoard);
    }
  }
}