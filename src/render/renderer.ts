import { RenderData } from "./renderData";

export abstract class RendererImpl implements Renderer {
    abstract render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData): void;
    
}

export abstract class TypedRenderer<RenderDataType extends RenderData> extends RendererImpl {
    render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData): void {
        this._render(context, renderData as RenderDataType);
    }

    protected abstract _render(context: OffscreenCanvasRenderingContext2D, renderData: RenderDataType) : void;
}

export interface Renderer {
    render(context: OffscreenCanvasRenderingContext2D, renderData: RenderData): void;
}