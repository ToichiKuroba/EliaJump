import { SavePointHandler } from "../savePointHandler";
import { Controller } from "./controller";

export class SavePointController implements Controller {
    private _savePointHandler: SavePointHandler;

    private keyPressHandler = (ev: KeyboardEvent) => this.savePointHandlerKeyPress(ev);
    constructor(savePointHandler: SavePointHandler){
        this._savePointHandler = savePointHandler;
    }
    addListeners(): void {
        document.addEventListener("keypress", this.keyPressHandler);
    }
    removeListeners(): void {
        document.removeEventListener("keypress", this.keyPressHandler);
    }
    
    dispose(): void {
        this.removeListeners();
    }

    private savePointHandlerKeyPress(ev: KeyboardEvent) {
        if (ev.key == "r") {
            this._savePointHandler.returnToSavePoint();
        }
    }
}