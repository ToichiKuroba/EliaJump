import { RenderData } from "../render/renderData";
import { PlatformRender } from "./platformRender";

export class EliaBreakPlatformRender extends PlatformRender {
    render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData): void {
        super.render(context, renderData);
        const paddingTopBottom = 20;
        const fontSize = (renderData.height - paddingTopBottom * 2) / 2;
        context.save();
        context.fillStyle = "#000";  
        context.font = fontSize + "px arial";
        context.textAlign = "center";
        context.fillText("ELIA", renderData.x + renderData.width /2, renderData.y + 10 + paddingTopBottom, renderData.width - 10);
        context.fillText("BREAK", renderData.x + renderData.width /2, renderData.y + 10 + paddingTopBottom + fontSize + 5, renderData.width - 10);
        context.font = fontSize * 2 + "px arial";
        context.fillText("🎉", renderData.x + 20, renderData.y + 20 + paddingTopBottom);
        context.fillText("🎉", renderData.x + renderData.width - 20, renderData.y + 20 + paddingTopBottom);
        context.restore();
    }
}