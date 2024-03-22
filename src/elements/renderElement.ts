import { CollisionElement } from "../collision/collisionElement";
import { DefaultGameElement, GameElement } from "./gameElement";
import { RenderPrio } from "./renderPrio";

export abstract class RenderElementImpl extends DefaultGameElement implements RenderElement{
    get renderPrio(): RenderPrio {
        return RenderPrio.normal;
    }

    get canCollide(): boolean {
        return false;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    protected abstract _y: number;
    protected abstract _x: number;
    abstract get height(): number;
    abstract get width(): number;
    handleResize(heightChange: number) {
        this._y += heightChange;
    }
    abstract render(context: CanvasRenderingContext2D) : void;
    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number) {
        return this._x >= renderAreaXStart && this._x <= renderAreaXEnd && this._y >= renderAreaYStart && this._y <= renderAreaYEnd;
    }
}

export function isRenderElement(element : GameElement | RenderElement) : element is RenderElement {
    return typeof (element as RenderElement).render == "function"; 
}

export interface RenderElement extends CollisionElement {
    get x(): number;
    get y(): number;
    handleResize(heightChange: number):void;
    render(context: CanvasRenderingContext2D) : void;
    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number) : boolean;
    get renderPrio(): RenderPrio
}