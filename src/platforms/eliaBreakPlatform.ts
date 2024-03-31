import { CollisionV2 } from "../collision/collision";
import { CollisionType } from "../collision/collisionType";
import { MovingCollisionElement } from "../collision/movingCollisionElement";
import { GameElementState } from "../elements/gameElementState";
import { RenderArea } from "../elements/renderArea";
import { RenderMap } from "../render/renderMap";
import { Platform } from "./platform";

export class EliaBreakPlatform extends Platform implements MovingCollisionElement {
    private static speed = 5;
    private readonly _startY: number;
    private readonly _endY: number;
    private _direction = 1;
    state: GameElementState = GameElementState.Active;
    private static PauseFrames = 100;
    private pausedFrames = 0;
    
protected get rendererKey(): keyof RenderMap {
    return "EliaBreakPlatform"
}

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
}