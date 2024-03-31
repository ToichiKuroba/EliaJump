import { ColorMap } from "../colorHandler";

export interface RenderContext {
    drawContext: OffscreenCanvasRenderingContext2D,
    colorMap: ColorMap
}