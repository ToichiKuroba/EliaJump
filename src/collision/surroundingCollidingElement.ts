import { AxisLine } from "./axisLine";
import { CollisionHandlerElement } from "./collisionHandlerElement";

export class SurroundingCollidingElement implements CollisionHandlerElement {
    protected _width: number;
    protected _height: number;
    protected _y: number;
    protected _x: number;

    constructor(x: number, y: number, width: number, height: number){
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    
    get canColide(): boolean {
        return true;
    }

    get xAxisLine() : AxisLine {
        return new AxisLine(this._x, this._width);
    }

    get yAxisLine() : AxisLine {
        return new AxisLine(this._y, this._height);
    }
}