import { AnimationRender } from "../animation/animationRender";
import { EndRender } from "../endRender";
import { ImageMap } from "../image/imageMap";
import { EliaBreakPlatformRender } from "../platforms/eliaBreakPlatformRender";
import { PlatformRender } from "../platforms/platformRender";
import { SavePointPlatformRender } from "../platforms/savePointPlatformRender";
import { StreamPlatformRender } from "../platforms/streamPlatformRender";

export interface RenderMap {
    "Platform": PlatformRender,
    "SavePointPlatform": SavePointPlatformRender,
    "StreamPlatform": StreamPlatformRender,
    "Animation": AnimationRender,
    "End": EndRender,
    "EliaBreakPlatform": EliaBreakPlatformRender
}

export class RenderMapImpl implements RenderMap {
    "Platform": PlatformRender;
    "SavePointPlatform": SavePointPlatformRender;
    "StreamPlatform": StreamPlatformRender;
    "Animation": AnimationRender;
    "End": EndRender;
    constructor(imageMap: ImageMap) {
        this.Platform = new PlatformRender();
        this.Animation = new AnimationRender(imageMap);
        this.StreamPlatform = new StreamPlatformRender(this.Platform);
        this.End = new EndRender();
        this.SavePointPlatform = new SavePointPlatformRender(this);
        this.EliaBreakPlatform = new EliaBreakPlatformRender();
    }
    "EliaBreakPlatform": EliaBreakPlatformRender;
}