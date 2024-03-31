import { RenderContext } from "../render/renderContext";
import { RenderData } from "../render/renderData";
import { RendererImpl } from "../render/renderer";

export class PlatformRender extends RendererImpl {
    render(context: RenderContext, renderData: RenderData) {
        context.drawContext.beginPath();
        context.drawContext.roundRect(Math.round(renderData.x), Math.round(renderData.y), renderData.width, renderData.height, 20);
        context.drawContext.fillStyle = context.colorMap["primary-background-color"];
        context.drawContext.fill();
        context.drawContext.closePath();
    }
}