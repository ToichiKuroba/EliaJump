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
        const text = convertToTimeString(renderData.time);
        const measure = context.drawContext.measureText(text);
        let actualHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
        const x = renderData.x + (renderData.width / 2) - (measure.width / 2);
        context.drawContext.fillText(text, x, renderData.y + actualHeight + renderData.height);
        context.drawContext.closePath();
        this._animationRender.render(context, renderData.animationData);
    }

}