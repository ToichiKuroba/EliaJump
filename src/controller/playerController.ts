import { Figure } from "../figure";
import { GameElementController } from "./gameElementController";

export class PlayerController extends GameElementController{
    private _dev: boolean;
    private _player: Figure;
    private keyDownHandler = (ev: KeyboardEvent) => this.playerKeyDown(ev);
    private keyUpHandler = (ev: KeyboardEvent) => this.playerKeyUp(ev);
    constructor(player: Figure, dev = false) {
        super(player);
        this._dev = dev;
        this._player = player;
    }

    addListeners(): void {
        document.addEventListener("keydown", this.keyDownHandler);
        document.addEventListener("keyup", this.keyUpHandler);
    }

    removeListeners(): void {
        document.removeEventListener("keydown", this.keyDownHandler);
        document.removeEventListener("keyup", this.keyUpHandler);
    }

    private playerKeyUp(ev: KeyboardEvent) {
        if ((ev.key == 'a' || ev.key == 'w' || ev.key == 'd')) {
            this._player.endJumpLoad();
        }

        if (this._dev) {
            if (ev.key == 'ArrowLeft' || ev.key == "ArrowDown" || ev.key == 'ArrowRight' || ev.key == "ArrowUp") {
                this._player.endMove();
            }

            if (ev.key == 'g') {
                this._player.toggleGravity();
            }
        }
    }

    private playerKeyDown(ev: KeyboardEvent) {
        if (ev.key == 'w') {
            this._player.startJumpLoad("up");
        }

        if (ev.key == 'a') {
            this._player.startJumpLoad("left");
        }

        if (ev.key == 'd') {
            this._player.startJumpLoad("right");
        }


        if (this._dev && (ev.key == 'ArrowLeft' || ev.key == 'ArrowRight' || ev.key == "ArrowUp" || ev.key == "ArrowDown")) {
            this._player.move(ev.key, ev.shiftKey, ev.ctrlKey);
        }
    }
}