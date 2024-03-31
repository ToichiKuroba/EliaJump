import { ImageHandler } from "../image/imageHandler";
import { FigureAnimation } from "./figureAnimation";

export class StarlingAnimation extends FigureAnimation {
    private static Height = 77;
    private static Width = 111;
    private _defaultSideFrames: [defaultPosition: number, frames: string[]] = [0, []];
    private _defaultFrames: [defaultPosition: number, frames: string[]] = [0, []];
    private _loadingJumpFrames: [defaultPosition: number, frames: string[]] = [0, []];
    private _loadingFullJumpFrames: [defaultPosition: number, frames: string[]] = [0, []];
    private _loadingSideJumpFrames: [defaultPosition: number, frames: string[]] = [0, []];
    private _loadingSideFullJumpFrames: [defaultPosition: number, frames: string[]] = [0, []];
    constructor(imageHandler: ImageHandler) {
        super(StarlingAnimation.Width, StarlingAnimation.Height);
        
        const bitmapOptions: ImageBitmapOptions =  {resizeHeight:StarlingAnimation.Height * 2, resizeWidth:  StarlingAnimation.Width * 2};
        this._defaultFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > ",bitmapOptions)];
        this._defaultSideFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side >",bitmapOptions)];
        this._loadingJumpFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .jump >",bitmapOptions)];
        this._loadingFullJumpFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .bigJump >",bitmapOptions)];
        this._loadingSideJumpFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side > .jump >",bitmapOptions)];
        this._loadingSideFullJumpFrames = [1, imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side > .bigJump >",bitmapOptions)];
    }

    protected get loadingJumpFrames(): [defaultPosition: number, frames: string[]] {
        return this._loadingJumpFrames;
    }
    protected get loadingFullJumpFrames(): [defaultPosition: number, frames: string[]] {
        return this._loadingFullJumpFrames;
    }
    protected get loadingSideJumpFrames(): [defaultPosition: number, frames: string[]] {
        return this._loadingSideJumpFrames;
    }
    protected get loadingSideFullJumpFrames(): [defaultPosition: number, frames: string[]] {
        return this._loadingSideFullJumpFrames;
    }
    protected get defaultFrames(): [defaultPosition: number, frames: string[]] {
        return this._defaultFrames;
    }
    protected get defaultSideFrames(): [defaultPosition: number, frames: string[]] {
        return this._defaultSideFrames;
    }

}

