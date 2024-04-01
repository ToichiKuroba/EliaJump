import { LeaderBoard } from "../time/leaderBoard";
import { ModalElementController } from "./modalElementController";

export class LeaderBoardController extends ModalElementController {
    private _leaderBoard: LeaderBoard;
    constructor(leaderBoard: LeaderBoard) {
        super(leaderBoard);
        this._leaderBoard = leaderBoard;
    }

    onclick = () => this._leaderBoard.toggleOpen();


    addListeners(): void {
        super.addListeners();
        this._leaderBoard.modal?.addEventListener("click", this.onclick);
    }

    removeListeners(): void {
        super.removeListeners();
        this._leaderBoard.modal?.removeEventListener("click", this.onclick);
    }

}