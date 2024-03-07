import { DefaultGameElement } from "./gameElement";

export abstract class RenderElement extends DefaultGameElement {
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    protected abstract _y: number;
    protected abstract _x: number;
    abstract get height(): number;
    handleResize(heightChange: number) {
        this._y += heightChange;
    }
    abstract render(context: CanvasRenderingContext2D) : void;
    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number) {
        return this._x >= renderAreaXStart && this._x <= renderAreaXEnd && this._y >= renderAreaYStart && this._y <= renderAreaYEnd;
    }
}