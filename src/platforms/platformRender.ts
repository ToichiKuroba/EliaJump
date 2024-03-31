import { RenderData } from "../render/renderData";
import { RendererImpl } from "../render/renderer";

export class PlatformRender extends RendererImpl {
    render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData) {
        context.beginPath();
        context.roundRect(Math.round(renderData.x), Math.round(renderData.y), renderData.width, renderData.height, 20);
        context.fillStyle = "#fff";
        context.fill();
        context.closePath();
    }
}