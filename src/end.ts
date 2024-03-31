import { GameElementState } from "./elements/gameElementState";
import { RenderElementImpl } from "./elements/renderElement";
import { RenderMap } from "./render/renderMap";

export class End extends RenderElementImpl {
    protected get rendererKey(): keyof RenderMap {
        return "End";
    }
    get width(): number {
        return 0;
    }

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

    state: GameElementState = GameElementState.Inactive;
    calculateNextFrame(): void {
    }

}