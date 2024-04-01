import { AnimationRender, AnimationRenderData } from "./animation/animationRender";
import { RenderContext } from "./render/renderContext";
import { RenderData } from "./render/renderData";
import { TypedRenderer } from "./render/renderer";
import { convertToTimeString } from "./util/convertToTimeString";

export interface EndRenderData extends RenderData {
    reached: boolean,
    time: number,
    animationData: AnimationRenderData
}

export class EndRender extends TypedRenderer<EndRenderData> {
    private _animationRender: AnimationRender;
    constructor(animationRender: AnimationRender) {
        super();
        this._animationRender = animationRender;
    }

    protected _render(context: RenderContext, renderData: EndRenderData): void {
        context.drawContext.beginPath();
        context.drawContext.font = "50px Arial";
        context.drawContext.fillStyle = renderData.reached ? context.colorMap["success-color"] : context.colorMap["primary-font-color"];
        const text = "Your time:";
        const timeText = convertToTimeString(renderData.time);
        const timeMeasure = context.drawContext.measureText(timeText);
        const textMeasure = context.drawContext.measureText(text);
        const gap = 10;
        let actualTextHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;
        let actualTimeHeight = timeMeasure.actualBoundingBoxAscent + timeMeasure.actualBoundingBoxDescent + actualTextHeight + gap;
        const textX = renderData.x + (renderData.width / 2) - (textMeasure.width / 2);
        const timeX = renderData.x + (renderData.width / 2) - (timeMeasure.width / 2);
        context.drawContext.fillText(text, textX, renderData.y + actualTextHeight + renderData.height);
        context.drawContext.fillText(timeText, timeX, renderData.y + actualTimeHeight + renderData.height);
        context.drawContext.closePath();
        this._animationRender.render(context, renderData.animationData);
    }

}