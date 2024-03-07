import { GameElementState } from "../elements/gameElementState";
import { CollisionElement } from "./collisionElement";

export class SurroundingCollidingElement extends CollisionElement {
    protected _width: number;
    protected _height: number;
    protected _y: number;
    protected _x: number;

    constructor(x: number, y: number, width: number, height: number){
        super();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    render(): void {
    }
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }

    get maxX(): number {
        return this._width;
    }

    get maxY(): number {
        return this._height;    
    }

    get minX(): number {
        return this.x;
    }

    get minY(): number {
        return this.y;
    }
}