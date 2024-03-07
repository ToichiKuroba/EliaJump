import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";

export class Day extends DomElement<"span">{
    private _date: Date;
    constructor(container: HTMLElement, date: Date, height: number){
        super(container, "span");
        this._date = date;
        this.element.style.setProperty("--dayHeight", height + "px");
        const dateElement = document.createElement("span");
        dateElement.classList.add("date");
        dateElement.innerText = this._date.getDate().toString();
        this.element.appendChild(dateElement);
        if(this._date.getDate() == 1) {
            const monthElement = document.createElement("span");
            monthElement.classList.add("month");
            monthElement.innerText = date.toLocaleString('default', { month: 'long' });
            this.element.appendChild(monthElement);
        }
    }

    refresh(): void {
    }
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
        throw new Error("Method not implemented.");
    }

}