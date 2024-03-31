import { RenderContext } from "../render/renderContext";
import { RenderData } from "../render/renderData";
import { RenderMap } from "../render/renderMap";
import { TypedRenderer } from "../render/renderer";

export interface SavePointPlatformRenderData extends RenderData {
    platform: RenderData,
    isReached: boolean,
}

export class SavePointPlatformRender extends TypedRenderer<SavePointPlatformRenderData> {
    private _map: RenderMap;
    constructor(map: RenderMap) {
        super();
        this._map = map;
    }

    protected _render(context: RenderContext, renderData: SavePointPlatformRenderData): void {
        this._map[renderData.platform.rendererKey].render(context, renderData.platform);
        const path = "M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z";
        const p = new Path2D(path);
        context.drawContext.save();
        let x = renderData.x - 45;
        if(renderData.x <= 0) {
            x = renderData.x + renderData.width;
        }
        context.drawContext.translate(x, renderData.y + renderData.height / 2 + 20);      
        context.drawContext.fillStyle = renderData.isReached ? context.colorMap["success-color"] : context.colorMap["primary-background-color"];
        context.drawContext.scale(0.05, 0.05);
        context.drawContext.fill(p);
        context.drawContext.restore();
    }
    
}