import { GameElementHandler } from "./elements/gameElementHandler";
import { RenderElement } from "./elements/renderElement";
import { FocusElement } from "./util/focusElement";

export type ResizeCallback = (heightChange: number) => void;

export class GameField {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _gameFrame: HTMLElement;
    private readonly _context: CanvasRenderingContext2D | null;
    private static BufferY = 100;
    private static BufferX = 50;
    private static YTranslationOffsetMultiplier = 0.25;
    private static CameraAcceleration = 10;
    private static gradientStartColor = "#bca0b6";
    private static gradientEndColor = "#e2d7dd";
    yTranslation = 0;
    nextYTranslation = 0;
    private readonly _elementHandler: GameElementHandler;
    private _focusElement: FocusElement | undefined;
    private readonly _dev: boolean;
    private _clearBeforeRender: boolean = true;
    private _translateElements: HTMLElement[] = [];
    private _resizeCallbacks: (ResizeCallback | null)[] = [];
    get bottom() {
        return this._canvas.height;
    }
    
    get width() {
        return this._canvas.width;
    }

    get viewHeight() {
        return this._canvas.height;
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

        if(!this._focusElement.shouldRender(this._focusElement.x, -this.yTranslation, this._focusElement.x, this._canvas.height - this.yTranslation)) {
            this._inNextStageCounter++;
        } else {
            this._inNextStageCounter = 0;
        }

        if(this._inNextStageCounter > GameField.FramesUntilStageChange) {
            this.centerOnFollowObject();
        }
    }

    constructor(gameFrame : HTMLElement, elementHandler: GameElementHandler, dev: boolean = false){
        this._gameFrame = gameFrame;
        this._dev = dev;
        this._canvas = this._gameFrame.querySelector<HTMLCanvasElement>("canvas")!;
        this._context = this._canvas.getContext("2d");
        this._context?.save();
        this._elementHandler = elementHandler;

        document.addEventListener("keypress", (ev) => {
            if(this._dev && ev.key == ' ' && ev.ctrlKey) {
                this._clearBeforeRender = !this._clearBeforeRender;
                console.log("Clear before render: " + this._clearBeforeRender);
            }
        });
    }

    render(element: RenderElement) {
        if(this._context != null && element.shouldRender(-GameField.BufferX, -(this.yTranslation + GameField.BufferY), this.width + GameField.BufferX, this.viewHeight + GameField.BufferY - this.yTranslation)) {
            element.render(this._context);
        }
    }

    adjustSize(){ 
        const heightAdjustment = this._gameFrame.clientHeight - this._canvas.height;
        const widthAdjustment = this._gameFrame.clientWidth - this._canvas.width;
        if(widthAdjustment != 0) {
            this._canvas.width = this._gameFrame.clientWidth;
        }
        if(heightAdjustment != 0) {
            this._canvas.height = this._gameFrame.clientHeight;
            this._elementHandler.handleResize(heightAdjustment);
            this._context?.translate(0, Math.round(this.yTranslation));
            for (let index = 0; index < this._resizeCallbacks.length; index++) {
                const callback = this._resizeCallbacks[index];
                if(callback != null) {
                    callback(heightAdjustment);
                }
            }
        }
    }

    renderFrame() {
        this.translateScreen();

        if(this._context) {
            this._context.clearRect(0, -Math.round(this.yTranslation), this.width, this.viewHeight);
        }
        this._elementHandler.render(this);
    }

    clearScreen() {
        if(this._clearBeforeRender) {
            this._context?.clearRect(-GameField.BufferX, -(Math.round(this.yTranslation) + GameField.BufferY), this.width + GameField.BufferX, this.viewHeight + GameField.BufferY);
        }
    }

    translateScreen() {
        this._context?.translate(0, -Math.round(this.yTranslation));
        this.calcualteYTranslation();
        this.yTranslation -= this._cameraSpeed;
        const roundedYTranslation = Math.round(this.yTranslation);
        this._context?.translate(0, roundedYTranslation);
        for (let index = 0; index < this._translateElements.length; index++) {
            const translateElement = this._translateElements[index];
            translateElement.style.transform = `translate(0, ${roundedYTranslation}px)`;
        }
    }

    addToTranslate(element: HTMLElement){
        element.style.setProperty("--gradientStart", GameField.gradientStartColor);
        element.style.setProperty("--gradientEnd", GameField.gradientEndColor);
        this._translateElements.push(element);
    }

    dispose() {
        this.clearScreen();
    }

    follow(element: FocusElement){
        this._focusElement = element;
    }
}