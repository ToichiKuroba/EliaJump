import { CollisionHandler } from "./collision/collisionHandlerV2";
import "./game.css";
import { GameElementHandler } from "./elements/gameElementHandler";
import { AddedElementEvent, GameElementEvent } from "./elements/gameElementEventMap";
import { Figure } from "./figure";
import { PlatformField } from "./platforms/platformField";
import { GameField } from "./gameFlied";
import { isCollisionElement } from "./collision/collisionElement";
import { StreamPlatformField } from "./platforms/streamPlatformField"; 
import { SavePointHandler } from "./savePointHandler";
import { StarlingAnimation } from "./animation/starlingAnimation";
import { Controlls } from "./controlls";
import "external-svg-loader";
import { ControllerHandler } from "./controller/controllerHandler";
import { Controllbar } from "./controllbar";
import { Time } from "./time/time";
import { ImageHandler } from "./image/imageHandler";
import renderWorker from "./workers/render?worker";
import { RunHandler, RunHandlerImpl } from "./time/runHandler";
import { RunHistoryImpl } from "./time/runHistory";
import { End } from "./end";
import { EndStarlingAnimation } from "./animation/endStarlingAnimation";

function Init() {
    if (document.readyState == "complete") {
        const game = new Game();
        game.Start();
    }
}

Init();
document.addEventListener("readystatechange", (_ev) => {
    Init();
});

class Game {
    private _isRunning: boolean = false;
    private readonly _dev = true;
    private frameInterval: number = 0;
    private readonly collisionHandler: CollisionHandler;
    private readonly elementHandler: GameElementHandler;
    private readonly _gameField: GameField;
    private _savePointHandler: SavePointHandler | undefined;
    private _imageHandler: ImageHandler;
    private _renderWorker: Worker;
    private runHandler: RunHandler | undefined;
    constructor() {
        this.elementHandler = new GameElementHandler(); 
        this._renderWorker = new renderWorker();
        this._gameField = new GameField(document.querySelector<HTMLElement>(".game")!, this.elementHandler, this._renderWorker);
        this.collisionHandler = new CollisionHandler(this._gameField);
        ControllerHandler.Instance.dev = this._dev;
        this._imageHandler = new ImageHandler(this._renderWorker);
    }

    handleElementAdded = (ev: AddedElementEvent) => {
        console.log("Element Added");
        if(isCollisionElement(ev.element)) {
            this.collisionHandler.add(ev.element);
        }
    }

    handleElementRemoved = (ev: GameElementEvent<"Removed">) => {
        console.log("Element Removed");
        if(isCollisionElement(ev.sender)) {
            this.collisionHandler.removeElement(ev.sender);
        }
    }

    get isRunning() {
        return this._isRunning;
    }

    

    Start() {
        this.elementHandler.addEventListener("Added", this.handleElementAdded);
        this.elementHandler.addEventListener("Removed", this.handleElementRemoved);
        this._gameField.adjustSize();
        this._isRunning = true;
        this.frameInterval = setInterval(async () => {
            this._gameField.adjustSize();
            this.elementHandler.calculateNextFrame();
            this._savePointHandler?.checkSavePoint();
            this.collisionHandler.detectCollisions();
            this.elementHandler.showNotRenderElements();
            await this._gameField.startRender();
        }, 10);

        this.RunGame();
    }

    Stop() {
        this.dispose();
    }

    dispose() {
        clearInterval(this.frameInterval);
        this._gameField.dispose();
        this.elementHandler.removeEventListener("Added", this.handleElementAdded);
        this.elementHandler.removeEventListener("Removed", this.handleElementRemoved);
        this.elementHandler.dispose();
        this.collisionHandler.dispose();
        this._savePointHandler?.dispose();
        ControllerHandler.Instance.dispose();
        this._isRunning = false;
    }

    private RunGame() {
        const timeElement = document.querySelector<HTMLDivElement>(".time");
        const runHistory = new RunHistoryImpl();
        if(timeElement){
            const time = new Time(timeElement);
            this.runHandler = new RunHandlerImpl(time, runHistory);
            this.elementHandler.add(time);
        }

        let streamPlatform: StreamPlatformField | undefined;
        const player = new Figure(0, this._gameField.bottom - 50, new StarlingAnimation(this._imageHandler), this.runHandler);
        this._gameField.follow(player);
        this.elementHandler.add(player);
        ControllerHandler.Instance.controll(player);
        const controllsElement = document.querySelector<HTMLDivElement>(".title .controlls");
        if(controllsElement){
            const controlls = new Controlls(controllsElement, player);
            this.elementHandler.add(controlls);
            ControllerHandler.Instance.controll(controlls);
        }

        const dayContainer = document.querySelector<HTMLElement>(".dayContainer");
        if(dayContainer) {
            this._gameField.addToTranslate(dayContainer);
            streamPlatform = new StreamPlatformField(0, this._gameField.viewHeight, this._gameField.width, dayContainer);
            this.elementHandler.add(streamPlatform);
            if(this.runHandler) {
                this._savePointHandler = new SavePointHandler(player, streamPlatform, this.runHandler);
                ControllerHandler.Instance.controll(this._savePointHandler);
            }
        }else {
            this.elementHandler.add(new PlatformField(0, -1000, this._gameField.width, this._gameField.viewHeight + 1000))
        }

        let end: End | undefined;
        if(this.runHandler && streamPlatform) {
            end = new End(streamPlatform, player, this.runHandler, this._gameField.width, new EndStarlingAnimation(this._imageHandler));
            this.elementHandler.add(end);
        }


        const controllbarElement = document.querySelector<HTMLDivElement>(".controllbar");
        if(controllbarElement && this._savePointHandler && this.runHandler && end) {
            const controllbar = new Controllbar(controllbarElement, player, this._savePointHandler, this.runHandler, end);
            this.elementHandler.add(controllbar);
        }
        this.elementHandler.subElementInitialize();
        
        this._savePointHandler?.returnToSavePoint();
    }
}
