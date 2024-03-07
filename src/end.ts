import { GameElementState } from "./elements/gameElementState";
import { RenderElement } from "./elements/renderElement";

export class End extends RenderElement {
    protected _y: number;
    protected _x: number;

    constructor(x: number, y: number) {
        super();
        this._x = x;
        this._y = y;
    }

    get height(): number {
        return 200;
    }
    render(context: CanvasRenderingContext2D): void {
        context.save();
        context.font = "100px Ariel";
        context.fillStyle = "#81678e";
        context.fillText("This is the end!", this._x, this._y);
        context.fillText("Thanks for playing", this._x , this._y + 120);
        context.restore();
    }
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }

}