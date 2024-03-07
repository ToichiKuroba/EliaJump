import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";

export class Day extends DomElement<"span">{
    private _date: Date;
    constructor(container: HTMLElement, date: Date){
        super(container, "span");
        this._date = date;
    }

    refresh(): void {
        throw new Error("Method not implemented.");
    }
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
        throw new Error("Method not implemented.");
    }

}