import { CollisionElement } from "../collision/collisionElement";
import { RenderData } from "../render/renderData";
import { RenderMap } from "../render/renderMap";
import { DefaultGameElement, GameElement } from "./gameElement";
import { GameElementState } from "./gameElementState";
import { RenderArea } from "./renderArea";
import { RenderPrio } from "./renderPrio";

export abstract class RenderElementImpl extends DefaultGameElement implements RenderElement{
    private _prevRenderData: RenderData | undefined;
    get prevRenderData(): RenderData | undefined {
        return this._prevRenderData;
    }
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
    protected abstract get rendererKey(): keyof RenderMap;
    handleResize(heightChange: number) {
        this._y += heightChange;
    }

    get renderData() : RenderData | undefined {
        this._prevRenderData = extractRenderData(this, this.rendererKey);
        return this._prevRenderData;
    }
    
    shouldRender(renderArea: RenderArea) {    
        return this.x >= renderArea.xStart - this.width && this.x <= renderArea.xEnd && this.y >= renderArea.yStart - this.height && this.y <= renderArea.yEnd;
    }
}

export function isRenderElement(element : GameElement | RenderElement) : element is RenderElement {
    return typeof (element as RenderElement).shouldRender === "function"; 
}

export interface RenderElement extends CollisionElement {
    get x(): number;
    get y(): number;
    handleResize(heightChange: number):void;
    get renderPrio(): RenderPrio,
    get renderData(): RenderData | undefined,
    shouldRender(renderArea: RenderArea):boolean,
    get prevRenderData(): RenderData | undefined,
}

export function extractRenderData(renderElement: RenderElement & GameElement, rendererKey: keyof RenderMap) : RenderData {
    return {
        rendererKey,
        y : renderElement.y,
        x : renderElement.x,
        height: renderElement.height,
        width: renderElement.width,
        needsRerender: renderElement.state != GameElementState.Inactive,
        transferables: [],
        prevRenderData: {...renderElement.prevRenderData, prevRenderData: undefined}
    } as RenderData;
}