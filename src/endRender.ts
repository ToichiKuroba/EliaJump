import { RenderContext } from "./render/renderContext";
import { RenderData } from "./render/renderData";
import { RendererImpl, TypedRenderer } from "./render/renderer";
import { convertToTimeString } from "./util/convertToTimeString";

export interface EndRenderData extends RenderData {
    reached: boolean,
    time: number,
}

export class EndRender extends TypedRenderer<EndRenderData> {
    protected _render(context: RenderContext, renderData: EndRenderData): void {
        context.drawContext.beginPath();
        context.drawContext.font = "50px Arial";
        context.drawContext.fillStyle = renderData.reached ? context.colorMap["success-color"] : context.colorMap["primary-font-color"];
        const text = convertToTimeString(renderData.time);
        const measure = context.drawContext.measureText(text)
        let actualHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
        context.drawContext.fillText(text, renderData.x, renderData.y + actualHeight + renderData.height);
        context.drawContext.closePath();
    }

}