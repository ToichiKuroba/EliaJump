import { Controlls } from "./controlls";
import { Figure } from "./figure";
import { SavePointHandler } from "./savePointHandler";

export class Controller {
    private _dev: boolean;
    player: Figure | undefined;
    savePointHandler: SavePointHandler | undefined;
    private _controlls: Controlls | undefined;
    private _controllsClickHandler = (ev: MouseEvent) => this.controllsClick();
    set controlls(value: Controlls | undefined) {
        if(this._controlls) {
            this._controlls.element.removeEventListener("click", this._controllsClickHandler);
        }

        this._controlls = value;

        if(this._controlls) {
            this._controlls.element.addEventListener("click", this._controllsClickHandler);
        }
    }

    constructor(dev = false) {
        this._dev = dev;
        document.addEventListener("keydown", (ev) => this.playerKeyDown(ev));
        document.addEventListener("keyup", ev => this.playerKeyUp(ev));
        document.addEventListener("keypress", (ev) => this.savePointHandlerKeyPress(ev));
    }

    private controllsClick(value?: boolean){
        if(this._controlls){
            this._controlls.open = value ?? !this._controlls.open;
        }
    }

    private savePointHandlerKeyPress(ev: KeyboardEvent) {
        if (this.savePointHandler && ev.key == "r") {
            this.savePointHandler.returnToSavePoint();
        }
    }

    private playerKeyUp(ev: KeyboardEvent) {
        if (this.player) {
            if ((ev.key == 'a' || ev.key == 'w' || ev.key == 'd')) {
                this.controllsClick(false);
                this.player.endJumpLoad();
            }

            if (this._dev) {
                if (ev.key == 'ArrowLeft' || ev.key == "ArrowDown" || ev.key == 'ArrowRight' || ev.key == "ArrowUp") {
                    this.player.endMove();
                }

                if (ev.key == 'g') {
                    this.player.toggleGravity();
                }
            }
        }
    }

    private playerKeyDown(ev: KeyboardEvent) {
        if (this.player) {
            if (ev.key == 'w') {
                this.player.startJumpLoad("up");
            }

            if (ev.key == 'a') {
                this.player.startJumpLoad("left");
            }

            if (ev.key == 'd') {
                this.player.startJumpLoad("right");
            }


            if (this._dev && (ev.key == 'ArrowLeft' || ev.key == 'ArrowRight' || ev.key == "ArrowUp" || ev.key == "ArrowDown")) {
                this.player.move(ev.key, ev.shiftKey, ev.ctrlKey);
            }
        }
    }
}