import { RenderData } from "./render/renderData";
import { RendererImpl } from "./render/renderer";

export class EndRender extends RendererImpl {
    render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData): void {
        context.save();
        context.font = "100px Ariel";
        context.fillStyle = "#81678e";
        context.fillText("This is the end!", renderData.x, renderData.y);
        context.fillText("Thanks for playing", renderData.x , renderData.y + 120);
        context.restore();
    }

}