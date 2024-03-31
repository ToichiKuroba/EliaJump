import { LeaderBoard } from "../leaderBoard";
import { ModalElementController } from "./modalElementController";

export class LeaderBoardController extends ModalElementController {
    private _leaderBoard: LeaderBoard;
    constructor(leaderBoard: LeaderBoard) {
        super(leaderBoard);
        this._leaderBoard = leaderBoard;
    }

}