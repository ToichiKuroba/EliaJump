import { AnimationData } from "./animationData";

export interface Animation {
    start(): void;
    renderNextFrame(context: CanvasRenderingContext2D, data: AnimationData) : void;
    stop(): void;
    pause(): void;
}

export abstract class BaseAnimation<AnimationDataType extends AnimationData> implements Animation {
    protected abstract get frames() : HTMLImageElement[];
    protected abstract get defaultPosition() : number;
    private _currentFrameCounter: number = 0;
    protected get currentFrame() {
        if(this.defaultPosition < 0) {
            throw new Error("defaultPosition can not be less than 0!");
        }else if(this.defaultPosition > this.frames.length) {
            throw new Error("defaultPosition can not be lonter than frames.length!");
        }
 
        const currentFrame = this.defaultPosition + this._currentFrameCounter;
        if(this.frames.length == 1 || this.frames.length <= currentFrame || currentFrame < 0) {
            return this.defaultPosition;
        }

        return currentFrame;
    }
    private _direction: number = 1;
    private _lastFrameChange: number | undefined;
    protected changeInterval: number;

    constructor(changeInterval: number) {
        this.changeInterval = changeInterval;
    }

    start(): void {
        this._lastFrameChange = Date.now();
    }

    renderNextFrame(context: CanvasRenderingContext2D, data: AnimationDataType): void {
        if(this.frames.length <= 0) {
            return;
        }
        
        context.drawImage(this.frames[this.currentFrame], data.x, data.y, data.width, data.height);  
        if(this.frames.length > 1 && this._lastFrameChange && Date.now() - this._lastFrameChange > this.changeInterval) {
            this._lastFrameChange = Date.now();
            this._currentFrameCounter += this._direction;

            if(this._currentFrameCounter != 0 || this.currentFrame == this.defaultPosition) {
                this._direction = -this._direction;
                this._currentFrameCounter += this._direction;
                this._currentFrameCounter += this._direction;
            }
        }
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