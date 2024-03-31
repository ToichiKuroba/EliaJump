import { GameElementState } from "../elements/gameElementState";
import { RenderElement, RenderElementImpl } from "../elements/renderElement";
import { RenderMap } from "../render/renderMap";

export class Platform extends RenderElementImpl {
    protected get rendererKey(): keyof RenderMap{
        return "Platform";
    }
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
    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void { 
    }
}