import { DefaultGameElement } from "../elements/gameElement";
import { GameElementState } from "../elements/gameElementState";
import { RenderArea } from "../elements/renderArea";
import { RenderElement, extractRenderData } from "../elements/renderElement";
import { RenderPrio } from "../elements/renderPrio";
import { RenderData } from "../render/renderData";
import { SavePointElement } from "../savePoint";
import { Platform } from "./platform";
import { SavePointPlatformRenderData } from "./savePointPlatformRender";

export class SavePointPlatform extends DefaultGameElement implements RenderElement, SavePointElement {
    private _platform: Platform;
    private _isReached: boolean = false;
    private _prevRenderData: RenderData | undefined;
    constructor(platform: Platform) {
        super();
        this._platform = platform;
    }
    get prevRenderData(): RenderData | undefined {
        return this._prevRenderData;
    }
    shouldRender(renderArea: RenderArea): boolean {
        return this._platform.shouldRender(renderArea);
    }
    get renderData(): RenderData {
        this._prevRenderData =  {...extractRenderData(this, "SavePointPlatform"), isReached: this._isReached, platform: this._platform.renderData } as SavePointPlatformRenderData;
        return this._prevRenderData;
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