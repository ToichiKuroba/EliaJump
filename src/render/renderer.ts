import { RenderContext } from "./renderContext";
import { RenderData } from "./renderData";

export abstract class RendererImpl implements Renderer {
    abstract render(context: RenderContext, renderData: RenderData): void;
    
}

export abstract class TypedRenderer<RenderDataType extends RenderData> extends RendererImpl {
    render(context: RenderContext, renderData: RenderData): void {
        this._render(context, renderData as RenderDataType);
    }

    protected abstract _render(context: RenderContext, renderData: RenderDataType) : void;
}

export interface Renderer {
    render(context: RenderContext, renderData: RenderData): void;
}