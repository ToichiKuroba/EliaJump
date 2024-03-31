import { BaseAnimation } from "./animation";
import { AnimationData } from "./animationData";
import { AnimationRenderData } from "./animationRender";

export interface FigureAnimationData extends AnimationData {
    isLoadingJump: boolean,
    isLoadingFullJump: boolean,
    jumpDirection: number,
}

export abstract class FigureAnimation extends BaseAnimation<FigureAnimationData> {
    protected abstract get loadingJumpFrames() : [defaultPosition: number, frames: string[]];
    protected abstract get loadingFullJumpFrames() :[defaultPosition: number,  frames: string[]];
    protected abstract get loadingSideJumpFrames() : [defaultPosition: number, frames: string[]];
    protected abstract get loadingSideFullJumpFrames() : [defaultPosition: number, frames: string[]];
    protected abstract get defaultFrames() : [defaultPosition: number,  frames: string[]];
    protected abstract get defaultSideFrames() : [defaultPosition: number, frames: string[]];

    protected frames: string[] = [];
    protected defaultPosition: number = 0;
    private _width: number;
    private _baseHeight: number;

    constructor(width: number, baseHeight: number) {
        super(200);
        this._width = width;
        this._baseHeight = baseHeight;
    }

    renderNextFrame(data: FigureAnimationData): AnimationRenderData | undefined {
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

        let fliped = false;
        if(data.jumpDirection > 0) {
            fliped = true;
        }

        const renderData = super.renderNextFrame({...data, x, y, width: this._width, height: height});
        if(renderData) {
            renderData.fliped = fliped;
            return renderData;
        }
    }
}