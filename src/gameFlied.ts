import { ColorHandler } from "./colorHandler";
import { GameElementHandler } from "./elements/gameElementHandler";
import { FocusElement } from "./util/focusElement";
import { AsyncRenderData } from "./workers/asyncRenderData";

export type ResizeCallback = (heightChange: number) => void;

export class GameField {
    private static BufferY = 100;
    private static BufferX = 50;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _gameFrame: HTMLElement;
    private static YTranslationOffsetMultiplier = 0.25;
    private static CameraAcceleration = 10;
    yTranslation = 0;
    nextYTranslation = 0;
    private readonly _elementHandler: GameElementHandler;
    private _focusElement: FocusElement | undefined;
    private _translateElements: HTMLElement[] = [];
    private _resizeCallbacks: (ResizeCallback | null)[] = [];
    private _renderWorker: Worker;
    private _lastHeight: number;
    private _lastWidth: number;
    private _renderPromise: Promise<any> | null = null;
    private _colorHandler: ColorHandler;
    get bottom() {
        return this._canvas.clientHeight;
    }
    
    get width() {
        return this._canvas.clientWidth;
    }

    get viewHeight() {
        return this._canvas.clientHeight;
    }

    private _inNextStageCounter = 0;

    private static FramesUntilStageChange = 1;

    private get _nextYTranslationDistance() {
        return Math.round(this.yTranslation) - Math.round(this.nextYTranslation);
    }

    private get _cameraSpeed() {
        return this._nextYTranslationDistance / GameField.CameraAcceleration;
    }

    addResizeCallback(callback: ResizeCallback) : () => void {
        const newIndex = this._resizeCallbacks.length;
        this._resizeCallbacks.push(callback);
        return () => {
            this._resizeCallbacks[newIndex] = null;
        }
    }

    private centerOnFollowObject() {
        if(this._focusElement) {
            const newYTranslation = -(this._focusElement.y + this._focusElement.height) + this.viewHeight - this.viewHeight * GameField.YTranslationOffsetMultiplier;
            this.nextYTranslation = newYTranslation > 0 ? newYTranslation : 0;
        }
    }

    private calcualteYTranslation() {
        if(!this._focusElement) {
            this.nextYTranslation = 0;
            return;
        }
        
        if(this._focusElement.canFocus()) {
            this.centerOnFollowObject();
        }
       
        if(this._focusElement.y > (this.viewHeight - this.yTranslation) || this._focusElement.y < -this.yTranslation) {
            this._inNextStageCounter++;
        } else {
            this._inNextStageCounter = 0;
        }

        if(this._inNextStageCounter > GameField.FramesUntilStageChange) {
            this.centerOnFollowObject();
        }
    }

    constructor(gameFrame : HTMLElement, elementHandler: GameElementHandler, renderWorker: Worker){
        this._gameFrame = gameFrame;
        this._canvas = this._gameFrame.querySelector<HTMLCanvasElement>("canvas")!;
        this._elementHandler = elementHandler;
        this._renderWorker = renderWorker;
        this._lastWidth = this._canvas.width;
        this._lastHeight = this._canvas.height;
        const offscreen = this._canvas.transferControlToOffscreen();
        this._renderWorker.postMessage({canvas: offscreen}, [offscreen]);
        this._colorHandler = new ColorHandler(this._canvas);
    }

    async startRender() {
        const [prevYTranslation, yTranslation] = this.doTranslation();
        let datas = this._elementHandler.getRenderElementDatas({ xStart: -GameField.BufferX,  xEnd: this.width + GameField.BufferX, yStart: -(yTranslation + GameField.BufferY), yEnd: (-yTranslation) + this.viewHeight + GameField.BufferY });
        if(this._renderPromise){
            await this._renderPromise;
        }

        this._renderWorker.postMessage({render: {renderData: datas.datas, prevYTranslation, yTranslation, colorMap: this._colorHandler.colorMap} as AsyncRenderData}, datas.transferables);
        this._renderPromise = new Promise((resolve) => {
            let timeout = setTimeout(resolve, 10);
            this._renderWorker.onmessage = ({data}) => {
                if(data && data.renderCompletet === true) {
                    clearTimeout(timeout);
                    resolve(data);
                }
            };
        });
    }

    adjustSize(){ 
        const dpr = window.devicePixelRatio * 2;
        const widthAdjustment = this._canvas.clientWidth * dpr - this._lastWidth;
        const heightAdjustment = this._canvas.clientHeight * dpr - this._lastHeight;
        if(widthAdjustment != 0) {
            this._lastWidth = this._canvas.clientWidth * dpr;
        }

        if(heightAdjustment != 0) {
            this._lastHeight = this._canvas.clientHeight * dpr;
            this._elementHandler.handleResize(heightAdjustment / dpr);
            for (let index = 0; index < this._resizeCallbacks.length; index++) {
                const callback = this._resizeCallbacks[index];
                if(callback != null) {
                    callback(heightAdjustment / dpr);
                }
            }
        }
       

        if(heightAdjustment != 0 || widthAdjustment != 0) {
            this._renderWorker.postMessage({widthAdjustment, heightAdjustment, dpr});
        }
    }

    doTranslation() : [prevYTranslation: number, yTranslation: number] {
        const prevYTranslation = Math.round(this.yTranslation);
        this.calcualteYTranslation();
        this.yTranslation -= this._cameraSpeed;
        const roundedYTranslation = Math.round(this.yTranslation);
        for (let index = 0; index < this._translateElements.length; index++) {
            const translateElement = this._translateElements[index];
            translateElement.style.transform = `translate(0, ${roundedYTranslation}px)`;
        }

        return [prevYTranslation, roundedYTranslation];
    }

    addToTranslate(element: HTMLElement){
        this._translateElements.push(element);
    }

    dispose() {
    }

    follow(element: FocusElement){
        this._focusElement = element;
    }
}