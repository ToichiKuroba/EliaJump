import { ResetWarning } from "../resetWarning";
import { GameElementController } from "./gameElementController";

export class ResetWarningController extends GameElementController {
    private _resetWarning: ResetWarning;
    private yesButtonClick = () => {this._resetWarning.reset();this._resetWarning.close();}
    private noButtonClick = () => this._resetWarning.close();
    constructor(resetWarning: ResetWarning) {
        super(resetWarning);
        this._resetWarning = resetWarning;
    }

    addListeners(): void {
        this._resetWarning.YesButton?.addEventListener("click", this.yesButtonClick);
        this._resetWarning.NoButton?.addEventListener("click", this.noButtonClick);
    }
    removeListeners(): void {
        throw new Error("Method not implemented.");
    }
}