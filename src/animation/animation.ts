import { AnimationData } from "./animationData";
import { AnimationRenderData } from "./animationRender";

export interface Animation {
    start(): void;
    renderNextFrame(data: AnimationData) : AnimationRenderData | undefined;
    stop(): void;
    pause(): void;
}

export abstract class BaseAnimation<AnimationDataType extends AnimationData> implements Animation {
    protected abstract get frames() : string[];
    protected abstract get defaultPosition() : number;
    private _currentFrameCounter: number = 0;
    protected get currentFrame() {
        if(this.defaultPosition < 0) {
            throw new Error("defaultPosition can not be less than 0!");
        }else if(this.defaultPosition > this.frames.length) {
            throw new Error("defaultPosition can not be bigger than frames.length!");
        }
 
        const currentFrame = this.defaultPosition + this._currentFrameCounter;
        if(this.frames.length == 1 || this.frames.length <= currentFrame || currentFrame < 0) {
            return this.defaultPosition;
        }

        return currentFrame;
    }
    private _direction: number = 1;
    protected _lastFrameChange: number | undefined;
    protected changeInterval: number;

    constructor(changeInterval: number) {
        this.changeInterval = changeInterval;
    }

    start(): void {
        this._lastFrameChange = Date.now();
    }

    renderNextFrame(data: AnimationDataType): AnimationRenderData | undefined {
        if(this.frames.length <= 0) {
            return;
        }
        
        const frame = this.frames[this.currentFrame];
        if(this.frames.length > 1 && this._lastFrameChange && Date.now() - this._lastFrameChange > this.changeInterval) {
            this._lastFrameChange = Date.now();
            this._currentFrameCounter += this._direction;

            if(this._currentFrameCounter != 0 || this.currentFrame == this.defaultPosition) {
                this._direction = -this._direction;
                this._currentFrameCounter += this._direction;
                this._currentFrameCounter += this._direction;
            }
        }

        const positionChanged = data.prevRenderData?.x != data.x || data.prevRenderData.y != data.y || data.prevRenderData.width != data.width || data.prevRenderData.height != data.height;

        return { ...data, frame: frame, rendererKey: "Animation", transferables: [], needsRerender: positionChanged, prevRenderData: {... data.prevRenderData, prevRenderData: undefined} };
    }
    stop(): void {
        this._lastFrameChange = undefined;
        this._currentFrameCounter = 0;
        this._direction = 1;
    }
    pause(): void {
        this._lastFrameChange = undefined;    
    }
}