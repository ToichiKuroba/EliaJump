import { RenderContext } from "../render/renderContext";
import { RenderData } from "../render/renderData";
import { PlatformRender } from "./platformRender";

export class EliaBreakPlatformRender extends PlatformRender {
    render(context: RenderContext, renderData: RenderData): void {
        super.render(context, renderData);
        const paddingTopBottom = 20;
        const fontSize = (renderData.height - paddingTopBottom * 2) / 2;
        context.drawContext.save();
        context.drawContext.fillStyle = context.colorMap["primary-font-color"];  
        context.drawContext.font = fontSize + "px arial";
        context.drawContext.textAlign = "center";
        context.drawContext.fillText("ELIA", renderData.x + renderData.width /2, renderData.y + 10 + paddingTopBottom, renderData.width - 10);
        context.drawContext.fillText("BREAK", renderData.x + renderData.width /2, renderData.y + 10 + paddingTopBottom + fontSize + 5, renderData.width - 10);
        context.drawContext.font = fontSize * 2 + "px arial";
        context.drawContext.fillText("🎉", renderData.x + 20, renderData.y + 20 + paddingTopBottom);
        context.drawContext.fillText("🎉", renderData.x + renderData.width - 20, renderData.y + 20 + paddingTopBottom);
        context.drawContext.restore();
    }
}