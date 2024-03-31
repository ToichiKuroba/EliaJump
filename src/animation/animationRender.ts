import { ImageMap } from "../image/imageMap";
import { RenderContext } from "../render/renderContext";
import { RenderData } from "../render/renderData";
import { TypedRenderer } from "../render/renderer";

export interface AnimationRenderData extends RenderData {
    frame: string,
    fliped?: boolean
}

export class AnimationRender extends TypedRenderer<AnimationRenderData> {
    private _imageMap: ImageMap;
    constructor(imageMap: ImageMap) {
        super();
        this._imageMap = imageMap;
    }
    protected _render(context: RenderContext, renderData: AnimationRenderData): void {
        const image = this._imageMap.get(renderData.frame);

        if(!image) {
            return;
        }

        if(renderData.fliped) {
            context.drawContext.save();
            context.drawContext.scale(-1, 1);
            context.drawContext.drawImage(image, (-renderData.x - renderData.width), renderData.y, renderData.width, renderData.height);  
            context.drawContext.restore();
        }else {
            context.drawContext.drawImage(image, renderData.x, renderData.y, renderData.width, renderData.height);  
        }

    }
}