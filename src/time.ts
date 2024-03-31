import { DomElement } from "./elements/domElement";
import { GameElementState } from "./elements/gameElementState";

export class Time extends DomElement<"div"> {
    private lastTimestamp: number = Date.now();
    private time: number;

    constructor(element: HTMLDivElement) {
        super(element);
        const savedTime = localStorage.getItem("time");
        this.time = savedTime ? Number.parseInt(savedTime) : 0;
        setInterval(() => localStorage.setItem("time", this.time.toString()), 100);
    }

    refresh(): void {
        let date = new Date(this.time);
        let days = Math.floor(this.time / (1000 * 60 * 60 * 24));
        let hours = date.getUTCHours() + days * 24;
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
            
        this.element.innerText =  hours.toString().padStart(2, '0') + ':' + minutes + ':' + seconds + ':' + milliseconds
    }
    state: GameElementState = GameElementState.Active;
    calculateNextFrame(): void {
        const now = Date.now();
        this.time += now - this.lastTimestamp;
        this.lastTimestamp = now;
    }

}