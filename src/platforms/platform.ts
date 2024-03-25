import { GameElementState } from "../elements/gameElementState";
import { RenderElement, RenderElementImpl } from "../elements/renderElement";

export class Platform extends RenderElementImpl {
    get canCollide(): boolean {
        return true;
    }

    protected _y: number;
    protected _x: number;
    protected _height: number;
    protected _width: number;
    protected _child: RenderElement | undefined;
    constructor(x: number, y: number, width: number, height: number) {
        super();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    render(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.roundRect(Math.round(this.x), Math.round(this._y), this._width, this._height, 20);
        context.fillStyle = "#fff";
        context.fill();
        context.closePath();
        context.fillText(this.x + "/" + this.y, this.x, this.y);
    }

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void { 
    }


    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number): boolean {
        return super.shouldRender(renderAreaXStart - this._width, renderAreaYStart + this._height, renderAreaXEnd, renderAreaYEnd);
    }
}