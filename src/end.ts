import { GameElementHandler } from "./elements/gameElementHandler";
import { GameElementState } from "./elements/gameElementState";
import { RenderElementImpl } from "./elements/renderElement";
import { EndRenderData } from "./endRender";
import { Figure } from "./figure";
import { RenderData } from "./render/renderData";
import { RenderMap } from "./render/renderMap";
import { Run } from "./time/run";
import { RunHandler } from "./time/runHandler";

export class End extends RenderElementImpl {
    private _elementHandler: GameElementHandler;
    private _width: number;
    private _player: Figure;
    private _reached: boolean = false;
    private _runHandler: RunHandler;
    get reached() {
        return this._reached;
    }
    protected get rendererKey(): keyof RenderMap {
        return "End";
    }
    get width(): number {
        return this._width;
    }

    protected _y: number;
    protected _x: number;
    private _prevEndRenderData: EndRenderData | undefined;
    private _run: Run | undefined;
    get renderData(): RenderData | undefined {
        const data = super.renderData;
        const time = this._run?.finalTime ?? this._runHandler.currentTime;
        const needsRerender = data?.needsRerender ? true : this._prevEndRenderData?.reached != this._reached || this._prevEndRenderData?.time != time;
        this._prevEndRenderData = {...data, reached: this._reached, needsRerender, time: time, prevRenderData: {...this._prevEndRenderData, prevRenderData: undefined} } as EndRenderData;
        return this._prevEndRenderData;
    }

    constructor(elementHandler: GameElementHandler, player: Figure, runHandler: RunHandler, width: number) {
        super();
        this._elementHandler = elementHandler;
        this._runHandler = runHandler;
        this._y = 0;
        this._x = 0;
        this._width = width;
        this._player = player;
    }

    get height(): number {
        return -500;
    }

    state: GameElementState = GameElementState.Active;
    calculateNextFrame(): void {
        if (!this._reached) {
            this._y = this._elementHandler.topY;
            if (this._player.canSave() && this._player.y <= this.y && this._runHandler.isRunning) {
                this._reached = true;
                this._run = this._runHandler.endRun(true);
            }
        }

        if(this._player.canSave() && this._player.y <= this.y) {
            this._player.pause();
        }
        else {
            this._player.resume();
        }
    }

    reset(){
        this._reached = false;
        this._run = undefined;
    }

}