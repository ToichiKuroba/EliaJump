import { readResourceImages } from "../util/resourceImage";
import { FigureAnimation } from "./figureAnimation";

export class StarlingAnimation extends FigureAnimation {
    private _defaultSideFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    private _defaultFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    private _loadingJumpFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    private _loadingFullJumpFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    private _loadingSideJumpFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    private _loadingSideFullJumpFrames: [defaultPosition: number, frames: HTMLImageElement[]];
    constructor() {
        super(111, 77);
        this._defaultFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > ")];
        this._defaultSideFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side >")];
        this._loadingJumpFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .jump >")];
        this._loadingFullJumpFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .bigJump >")];
        this._loadingSideJumpFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side > .jump >")];
        this._loadingSideFullJumpFrames = [1, readResourceImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > .side > .bigJump >")];
    }

    protected get loadingJumpFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._loadingJumpFrames;
    }
    protected get loadingFullJumpFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._loadingFullJumpFrames;
    }
    protected get loadingSideJumpFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._loadingSideJumpFrames;
    }
    protected get loadingSideFullJumpFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._loadingSideFullJumpFrames;
    }
    protected get defaultFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._defaultFrames;
    }
    protected get defaultSideFrames(): [defaultPosition: number, frames: HTMLImageElement[]] {
        return this._defaultSideFrames;
    }

}

