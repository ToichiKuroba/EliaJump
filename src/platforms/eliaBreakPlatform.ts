import { CollisionV2 } from "../collision/collision";
import { CollisionType } from "../collision/collisionType";
import { MovingCollisionElement } from "../collision/movingCollisionElement";
import { GameElementState } from "../elements/gameElementState";
import { Platform } from "./platform";

export class EliaBreakPlatform extends Platform implements MovingCollisionElement {
    private static speed = 5;
    private readonly _startY: number;
    private readonly _endY: number;
    private _direction = 1;
    state: GameElementState = GameElementState.Active;
    private static PauseFrames = 100;
    private pausedFrames = 0;

    constructor(x: number, startY: number, endY: number, width: number, height: number) {
        super(x, startY, width, height);
        this._startY = startY;
        this._endY = endY;
    }
    get speedX(): number {
        return 0;
    }
    get speedY(): number {
        return EliaBreakPlatform.speed * this._direction;
    }
    get wantsTofixCollision(): boolean {
        return false;
    }
    fixCollision(collision: CollisionV2): void {
        if(collision.type == CollisionType.Ignore) {
            return;
        }

        this._x = collision.contactX;
        this._y = collision.contactY;

        if(collision.type == CollisionType.Horizontal) {
            this._direction = -this._direction;
        }
    }

    calculateNextFrame(): void {
        if (this._y == this._startY && this.pausedFrames < EliaBreakPlatform.PauseFrames) {
            this.pausedFrames++;
        } else {
            this.pausedFrames = 0;
            this._y += EliaBreakPlatform.speed * this._direction;

            if (this._y > this._startY) {
                this._y = this._startY;
                this._direction = -1;
            } else if (this._y < this._endY) {
                this._y = this._endY;
                this._direction = 1;
            }
        }
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);
        const paddingTopBottom = 20;
        const fontSize = (this.height - paddingTopBottom * 2) / 2;
        context.save();
        context.fillStyle = "#000";  
        context.font = fontSize + "px arial";
        context.textAlign = "center";
        context.fillText("ELIA", this.x + this._width /2, this._y + 10 + paddingTopBottom, this._width - 10);
        context.fillText("BREAK", this.x + this._width /2, this._y + 10 + paddingTopBottom + fontSize + 5, this._width - 10);
        context.font = fontSize * 2 + "px arial";
        context.fillText("🎉", this.x + 20, this._y + 20 + paddingTopBottom);
        context.fillText("🎉", this.x + this._width - 20, this._y + 20 + paddingTopBottom);
        context.restore();
    }
}