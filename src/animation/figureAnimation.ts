import { BaseAnimation } from "./animation";
import { AnimationData } from "./animationData";

export interface FigureAnimationData extends AnimationData {
    isLoadingJump: boolean,
    isLoadingFullJump: boolean,
    jumpDirection: number,
}

export abstract class FigureAnimation extends BaseAnimation<FigureAnimationData> {
    protected abstract get loadingJumpFrames() : [defaultPosition: number, frames: HTMLImageElement[]];
    protected abstract get loadingFullJumpFrames() :[defaultPosition: number,  HTMLImageElement[]];
    protected abstract get loadingSideJumpFrames() : [defaultPosition: number, HTMLImageElement[]];
    protected abstract get loadingSideFullJumpFrames() : [defaultPosition: number, HTMLImageElement[]];
    protected abstract get defaultFrames() : [defaultPosition: number, HTMLImageElement[]];
    protected abstract get defaultSideFrames() : [defaultPosition: number, HTMLImageElement[]];

    protected frames: HTMLImageElement[] = [];
    protected defaultPosition: number = 0;
    private _width: number;
    private _baseHeight: number;

    constructor(width: number, baseHeight: number) {
        super(200);
        this._width = width;
        this._baseHeight = baseHeight;
    }

    renderNextFrame(context: CanvasRenderingContext2D, data: FigureAnimationData): void {
        context.save();
        let height = this._baseHeight;
        [this.defaultPosition, this.frames] = this.defaultFrames;
        if(data.isLoadingFullJump) {
            height = height / 1.5;
            [this.defaultPosition, this.frames] = data.jumpDirection != 0 ? this.loadingSideFullJumpFrames : this.loadingFullJumpFrames;
        } else if(data.isLoadingJump) {
            height = height / 1.25;
            [this.defaultPosition, this.frames] = data.jumpDirection != 0 ? this.loadingSideJumpFrames : this.loadingJumpFrames;
        }else if(data.jumpDirection != 0) {
            [this.defaultPosition, this.frames] = this.defaultSideFrames;
        }
            
        let x = data.x - (this._width - data.width) / 2;
        let y = data.y + (data.height - height);

        if(data.jumpDirection > 0) {
            context.scale(-1, 1);
            
            x *= -1;
            x -= this._width;
        }

        super.renderNextFrame(context, {...data, x, y, width: this._width, height: height});
        context.restore();
    }
}