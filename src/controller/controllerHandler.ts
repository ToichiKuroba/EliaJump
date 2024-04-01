import { Controlls } from "../controlls";
import { GameElement } from "../elements/gameElement";
import { Figure } from "../figure";
import { ResetWarning } from "../resetWarning";
import { SavePointHandler } from "../savePointHandler";
import { ResetWarningController } from "./resetWarningController";
import { ClickController } from "./clickController";
import { Controller } from "./controller";
import { PlayerController } from "./playerController";
import { SavePointController } from "./savePointController";
import { LeaderBoard } from "../time/leaderBoard";
import { LeaderBoardController } from "./leaderBoardController";
import { isModalDomElement } from "../elements/modalDomElement";
import { ModalElementController } from "./modalElementController";

export class ControllerHandler {
    private static instance = new ControllerHandler();
    private _dev: boolean = false;
    set dev(value: boolean) {
        this._dev = value;
    }
    private _controllers: Controller[] = [];
    private constructor() {
    }

    static get Instance() {
        return ControllerHandler.instance;
    }

    controll(controllElement: GameElement | SavePointHandler) {
        let controller: Controller | undefined;
        if(controllElement instanceof Figure) {
            controller = new PlayerController(controllElement, this._dev);
        }else if(controllElement instanceof SavePointHandler) {
            controller = new SavePointController(controllElement);
        }else if(controllElement instanceof Controlls) {
            controller = new ClickController(controllElement, () => controllElement.toggleOpen());
        }else if(controllElement instanceof ResetWarning) {
            controller = new ResetWarningController(controllElement);
        }else if(controllElement instanceof LeaderBoard) {
            controller = new LeaderBoardController(controllElement);
        }else if(isModalDomElement(controllElement)) {
            controller = new ModalElementController(controllElement);
        }

        if(controller) {
            controller.addListeners();
            this._controllers.push(controller);
        }
    }

    addListeners() {
        for (let index = 0; index < this._controllers.length; index++) {
            const controller = this._controllers[index];
            controller.addListeners();
        }
    }

    dispose() {
        for (let index = 0; index < this._controllers.length; index++) {
            const controller = this._controllers[index];
            controller.dispose();
        }
    }
}