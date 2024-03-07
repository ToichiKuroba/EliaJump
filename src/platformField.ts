import { GameElementHandler } from "./elements/gameElementHandler";
import { Platform } from "./platform";

export class PlatformField extends GameElementHandler {
    private static PlatformHeight = 25;
    private static PlatformWidthMultiplier = 0.25;
    private static PlatformGap = 125;
    private _height: number;
    private _widht: number;
    private _y: number;
    private _x: number;
    constructor(x: number, y: number, width: number, height: number) {
        super();
        this._x = x;
        this._y = y;
        this._widht = width;
        this._height = height;
    }

    handleResize(heightChange: number): void {
        this._y -= heightChange;
        super.handleResize(heightChange);
    }

    subElementInitialize(): void {
        const platformWidth = this._widht * PlatformField.PlatformWidthMultiplier;
        const platformHeight = PlatformField.PlatformHeight;
        const platformRowSpace = PlatformField.PlatformGap + platformHeight;
        let x = this._x;
        let cnt = 0;
        for (let y = (this._y + this._height) - platformRowSpace; y >= this._y; y -= platformRowSpace) {
            if(cnt % 2) {
               x = (this._x + this._widht) - platformWidth;
            }else {
                x = 0;
            }

            this.add(new Platform(x, y, platformWidth, platformHeight));
            cnt++;
        }
    }
}