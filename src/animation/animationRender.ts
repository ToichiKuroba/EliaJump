import { ImageMap } from "../image/imageMap";
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
    protected _render(context: OffscreenCanvasRenderingContext2D, renderData: AnimationRenderData): void {
        const image = this._imageMap.get(renderData.frame);

        if(!image) {
            return;
        }

        if(renderData.fliped) {
            context.save();
            context.scale(-1, 1);
            context.drawImage(image, (-renderData.x - renderData.width), renderData.y, renderData.width, renderData.height);  
            context.restore();
        }else {
            context.drawImage(image, renderData.x, renderData.y, renderData.width, renderData.height);  
        }

    }
}