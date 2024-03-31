import { ResetWarning } from "../resetWarning";
import { ModalElementController } from "./modalElementController";

export class ResetWarningController extends ModalElementController {
    private _resetWarning: ResetWarning;
    private yesButtonClick = () => {this._resetWarning.reset();this._resetWarning.close();}
    private noButtonClick = () => this._resetWarning.close();
    constructor(resetWarning: ResetWarning) {
        super(resetWarning);
        this._resetWarning = resetWarning;
    }

    addListeners(): void {
        super.addListeners();
        this._resetWarning.YesButton?.addEventListener("click", this.yesButtonClick);
        this._resetWarning.NoButton?.addEventListener("click", this.noButtonClick);
    }
    removeListeners(): void {
        super.removeListeners();
        this._resetWarning.YesButton?.removeEventListener("click", this.yesButtonClick);
        this._resetWarning.NoButton?.removeEventListener("click", this.noButtonClick);
    }
}