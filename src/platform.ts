import { CollisionElement } from "./collision/collisionElement";
import { GameElementState } from "./elements/gameElementState";

export class Platform extends CollisionElement {
    protected _y: number;
    protected _x: number;
    protected _height: number;
    protected _width: number;
    constructor(x: number, y: number, width: number, height: number) {
        super();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    render(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(Math.round(this.x), Math.round(this.y), this._width, this._height);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }


    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number): boolean {
        return super.shouldRender(renderAreaXStart - this._width, renderAreaYStart + this._height, renderAreaXEnd, renderAreaYEnd);
    }
}