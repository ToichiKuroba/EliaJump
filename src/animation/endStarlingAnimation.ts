import { ImageHandler } from "../image/imageHandler";
import { BaseAnimation } from "./animation";
import { AnimationData } from "./animationData";
import { AnimationRenderData } from "./animationRender";
export interface EndStarlingAnimationData extends AnimationData {
    figureX: number,
    figureY: number,
    limitX: number,
    limitY: number,
    startX: number,
    startY: number
}

export class EndStarlingAnimation extends BaseAnimation<EndStarlingAnimationData> {
    private static Height = 77;
    private static Width = 111;
    private static LoopTime = 15000;
    private _loopTime = 0;
    private _lastLoopRender = 0;
    private _frames: string[];
    private _directionX= 1;
    static BaseSeed = 1223414.323221;
    constructor(imageHandler: ImageHandler){
        super(200);        
        const bitmapOptions: ImageBitmapOptions =  {resizeHeight:EndStarlingAnimation.Height * 2, resizeWidth:  EndStarlingAnimation.Width * 2};
        this._frames = imageHandler.queryImages([".wingsDownImage", ".defaultImage", ".wingsUpImage"], ".defaultImage", ".resources > ", bitmapOptions);
    }

    get width(): number {
        return EndStarlingAnimation.Width;
    }

    get height(): number {
        return EndStarlingAnimation.Height;
    }

    protected get frames(): string[] {
        return this._frames;
    }
    protected get defaultPosition(): number {
        return 1;
    }

    renderNextFrame(data: EndStarlingAnimationData): AnimationRenderData | undefined {
        const maxSize = this.width > this.height ? this.width : this.height;
        const minSize = this.width <= this.height ? this.width : this.height;
        const limitX = data.limitX - maxSize;
        const limitY = data.limitY - maxSize;
        const startY = data.startY + maxSize - minSize;
        const startX = data.startX + maxSize - minSize;
        const movementWidth = (limitX - startX);
        const movementHeight = limitY - startY;
        const speedXPerMS = movementWidth * 2 / EndStarlingAnimation.LoopTime;
        
        const now = Date.now();
        const timeSinceLastRender = now - this._lastLoopRender;
        this._loopTime += timeSinceLastRender;
        if(this._loopTime > EndStarlingAnimation.LoopTime) {
            this._loopTime -= EndStarlingAnimation.LoopTime; 
        }

        this._lastLoopRender = now;
        let speedX = speedXPerMS * timeSinceLastRender * this._directionX;

        let x = data.x + speedX;
        if(x > limitX){
            this._directionX = -this._directionX;
            x = limitX - (x - limitX);
            speedX = x - data.x;
        }

        if(x < startX){
            this._directionX = -this._directionX;
            x = startX + (startX - x);
        }

        if(x > limitX || x < data.startX){
            x = data.startX;
        }


        const f = Math.sin((2 * Math.PI / (movementWidth / 2)) * x) + 1;
        let y = startY + ((movementHeight) / 2) * f;


        let speedY = data.y - y;
        if(y > limitY) {
            y = limitY;
            speedY = 0;
        }
        if(y < startY) {
            y = startY;
            speedY = 0;
        }

        let rotationMod = 0;

        if(speedX < 0 && speedY >= 0) {
            rotationMod = -180;
        }
        else if(speedX < 0 && speedY < 0) {
            rotationMod = 180;
        }
        else if(speedY < 0) 
        {
            rotationMod = 360;
        }
        
        let rotationDegree = 90 - (rotationMod + Math.atan(speedY / speedX) * 180 / Math.PI);

        const renderData = super.renderNextFrame({
            ...data,
            x,
            y
        });

        if(renderData){
            renderData.rotationDegree = rotationDegree;
        }

        return renderData;
    }

}