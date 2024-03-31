import { RenderContext } from "./render/renderContext";
import { RenderData } from "./render/renderData";
import { RendererImpl } from "./render/renderer";

export class EndRender extends RendererImpl {
    render(context: RenderContext, renderData: RenderData): void {
        context.drawContext.save();
        context.drawContext.font = "100px Ariel";
        context.drawContext.fillStyle = "#81678e";
        context.drawContext.fillText("This is the end!", renderData.x, renderData.y);
        context.drawContext.fillText("Thanks for playing", renderData.x , renderData.y + 120);
        context.drawContext.restore();
    }

}