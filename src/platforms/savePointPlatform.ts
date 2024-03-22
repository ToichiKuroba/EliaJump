import { DefaultGameElement } from "../elements/gameElement";
import { GameElementState } from "../elements/gameElementState";
import { RenderElement } from "../elements/renderElement";
import { RenderPrio } from "../elements/renderPrio";
import { SavePointElement } from "../savePoint";
import { Platform } from "./platform";

export class SavePointPlatform extends DefaultGameElement implements RenderElement, SavePointElement {
    private _platform: Platform;
    private _isReached: boolean = false;
    constructor(platform: Platform) {
        super();
        this._platform = platform;
    }
    get renderPrio(): RenderPrio {
        return RenderPrio.low;
    }
    set isReached(reached: boolean) {
        this._isReached = reached;
    }
    get canCollide(): boolean {
        return true;
    }

    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number): boolean {
        return this._platform.shouldRender(renderAreaXStart, renderAreaYStart, renderAreaXEnd, renderAreaYEnd);
    }

    get y() {
        return this._platform.y;
    }

    get x() {
        return this._platform.x;
    }

    get height(): number {
        return this._platform.height;
    }
    get width(): number {
        return this._platform.width;
    }
    render(context: CanvasRenderingContext2D): void {
        this._platform.render(context);
        const path = "M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z";
        const p = new Path2D(path);
        context.save();
        let x = this.x - 45;
        if(this.x <= 0) {
            x = this.x + this.width;
        }
        context.translate(x, this.y + this.height / 2 + 20);      
        context.fillStyle = this._isReached ? "#79ada3" : "#fff"
        context.scale(0.05, 0.05);
        context.fill(p);
        context.restore();
    }
    public get state(): GameElementState {
        return this._platform.state;
    }
    public set state(value: GameElementState) {
        this._platform.state = value;
    }

    calculateNextFrame(): void {
        this._platform.calculateNextFrame();
    }
    	
    handleResize(heightChange: number): void {
        this._platform.handleResize(heightChange);
    }

    dispose(): void {
        super.dispose();
        this._platform.dispose();
    }
}