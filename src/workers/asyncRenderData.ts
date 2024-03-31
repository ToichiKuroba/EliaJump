import { ColorMap } from "../colorHandler";
import { RenderPrio } from "../elements/renderPrio";
import { RenderData } from "../render/renderData";

export function IsAsyncRenderData(value: any) : value is AsyncRenderData {
    const asyncRenderData = value as AsyncRenderData;
    return asyncRenderData.renderData !== undefined && asyncRenderData.prevYTranslation !== undefined && asyncRenderData.yTranslation !== undefined && asyncRenderData.colorMap !== undefined;
} 

export interface AsyncRenderData {
    renderData: Map<RenderPrio, RenderData[]>[],
    prevYTranslation: number,
    yTranslation: number,
    colorMap: ColorMap
}