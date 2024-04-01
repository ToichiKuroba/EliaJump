import { DomElement } from "../elements/domElement";
import { GameElementState } from "../elements/gameElementState";
import { convertToTimeString } from "../util/convertToTimeString";

export class Time extends DomElement<"div"> implements TimeHandler {
    private lastTimestamp: number = Date.now();
    private _time: number;
    constructor(element: HTMLDivElement) {
        super(element);
        const savedTime = localStorage.getItem("time");
        this._time = savedTime ? Number.parseInt(savedTime) : 0;
        setInterval(() => localStorage.setItem("time", this._time.toString()), 100);
    }
    get isRunning(): boolean {
        return this.state == GameElementState.Active;
    }
    get time(): number {
        return this._time;
    }
    start(): void {
        if(this.state != GameElementState.Active) {
            this.state = GameElementState.Active;
            this.lastTimestamp = Date.now();
        }
    }
    endTime(): number {
        this.state = GameElementState.Inactive;
        const run = this._time;
        this.reset();
        return run;
    }

    private reset() {
        this._time = 0;
        localStorage.removeItem("time");
    }

    refresh(): void {
        this.element.innerText = convertToTimeString(this._time);
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
        const now = Date.now();
        this._time += now - this.lastTimestamp;
        this.lastTimestamp = now;
    }
}

export interface TimeHandler {
    endTime() : number,
    start(): void,
    get isRunning() : boolean;
    get time(): number,
}

