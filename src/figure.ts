import { FigureAnimation } from "./animation/figureAnimation";
import { CollisionV2 } from "./collision/collision";
import { CollisionType } from "./collision/collisionType";
import { MovingCollisionElement } from "./collision/movingCollisionElement";
import { GameElementState } from "./elements/gameElementState";
import { RenderElementImpl } from "./elements/renderElement";
import { RenderPrio } from "./elements/renderPrio";
import { SavePoint } from "./savePoint";
import { FocusElement } from "./util/focusElement";
import { Timer } from "./util/timer";

export class Figure extends RenderElementImpl implements FocusElement, MovingCollisionElement {
    private _animation: FigureAnimation;
    get renderPrio(): RenderPrio {
        return RenderPrio.hight;
    }

    get height(): number {
        return this._height;
    }
    canSave() {
        return !this._isJumping && !this._isDoubleJumping;
    }
    get canCollide(): boolean {
        return true;
    }

    protected _speedX: number = 0;
    protected _speedY: number = 0;
    protected _y: number;
    protected _x: number;
    protected _width = 72;
    protected _height = 72;
    private static FullJumpLoadTime = 1000;
    private static SmallJumpStrength = 10;
    private static MediumJumpStrength = 50;
    private static FullJumpStrength = 100;
    public static FullJumpHeight = 675;
    private static MaxJumpDistance = 500;
    private static MaxFootSpeed = 1;
    private _jumpStrengthX = 0;
    private _jumpStrengthY = 0;
    private _jumpStartTime = 0;
    private _spaceTimer = new Timer();
    private _dev: boolean;
    static MaxFallSpeed: number = 10;
    private _ignoreGravity: boolean = false;
    private get _footSpeed() {
        return (Figure.MaxFootSpeed / 100) * this._jumpStrengthY;
    };
    private _isJumping = false;
    private _isDoubleJumping = false;
    private _direction = 0;
    private _ignoreCollision = false;
    constructor(x: number, y: number, figureAnimation: FigureAnimation, dev: boolean = false) {
        super();
        this._animation = figureAnimation;
        this._x = x;
        this._y = y;
        this._dev = dev;
        document.addEventListener("keydown", (ev) => this.keyDown(ev));
        document.addEventListener("keyup", ev => this.keyUp(ev));
    }
    get speedX(): number {
        return this._speedX;
    }
    get speedY(): number {
        return this._speedY;
    }
    get wantsTofixCollision(): boolean {
        return true;
    }
    get width(): number {
        return this._width;
    }

    canFocus(): boolean {
        return !this._isJumping;
    }

    private get _jumpDistance() {
        return (Figure.MaxJumpDistance / 100) * this._jumpStrengthX;
    }

    private get _jumpLength() {
        if (this._footSpeed == 0 || this._jumpDistance == 0) {
            return Figure.FullJumpLoadTime * this._jumpStrengthY;
        }

        return this._jumpDistance / this._footSpeed;
    }

    private get _jumpHeight() {
        return (Figure.FullJumpHeight / 100) * this._jumpStrengthY;
    }

    private get gravity() {
        if (this._footSpeed == 0 || this._jumpDistance == 0) {
            return this.gravityY;
        }

        return (-2 * this._jumpHeight * Math.pow(this._footSpeed, 2)) / Math.pow(this._jumpDistance, 2);
    }

    private get gravityY() {
        return (-2 * this._jumpHeight) / Math.pow(this._jumpLength, 2);
    }

    private get initialVelocity() {
        if (this._footSpeed == 0 || this._jumpDistance == 0) {
            return this.initialVelocityY;
        }

        return (2 * this._jumpHeight * this._footSpeed) / this._jumpDistance;
    }

    private get initialVelocityY() {
        return (2 * this._jumpHeight) / this._jumpLength;
    }


    keyDown(ev: KeyboardEvent) {
        if (!this._isJumping && !this._isDoubleJumping) {
            if (ev.key == 'w' && !this._spaceTimer.isRunning) {
                this._direction = 0;
                this._spaceTimer.Start();
            }

            if (ev.key == 'a' && !this._spaceTimer.isRunning) {
                this._direction = -1;
                this._spaceTimer.Start();
            }

            if (ev.key == 'd' && !this._spaceTimer.isRunning) {
                this._direction = 1;
                this._spaceTimer.Start();
            }
        } else if (!this._isDoubleJumping) {
            if (ev.key == 'w' && !this._spaceTimer.isRunning) {
                this.endJump();
                this._isDoubleJumping = true;
                this._direction = 0;
                this._spaceTimer.Start();
            }

            if (ev.key == 'a' && !this._spaceTimer.isRunning) {
                this.endJump();
                this._isDoubleJumping = true;
                this._direction = -1;
                this._spaceTimer.Start();
            }

            if (ev.key == 'd' && !this._spaceTimer.isRunning) {
                this.endJump();
                this._isDoubleJumping = true;
                this._direction = 1;
                this._spaceTimer.Start();
            }
        }

        if (this._dev) {
            const devSpeed = ev.shiftKey ? 100 : ev.ctrlKey ? 1 : 10;
            if (ev.key == 'ArrowLeft' || ev.key == 'ArrowRight' || ev.key == "ArrowUp" || ev.key == "ArrowDown") {
                this._ignoreCollision = true;
                this._ignoreGravity = true;
                this.endJump();
            }

            if (ev.key == 'ArrowLeft') {
                this._x -= devSpeed;
            }

            if (ev.key == 'ArrowRight') {
                this._x += devSpeed;
            }

            if (ev.key == "ArrowUp") {
                this._y -= devSpeed;
            }

            if (ev.key == "ArrowDown") {
                this._y += devSpeed;
            }
        }
    }

    keyUp(ev: KeyboardEvent) {
        if (!this._isJumping) {
            if ((ev.key == 'a' || ev.key == 'w' || ev.key == 'd') && this._spaceTimer.isRunning) {
                document.querySelector<HTMLAudioElement>("#jump")?.play();
                this._animation.start();
                this._spaceTimer.Stop();
                this._jumpStartTime = Date.now();
                this._isJumping = true;
                this._jumpStrengthY = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
                this._jumpStrengthX = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
                this._spaceTimer.Reset();
                console.log(`${this._jumpStrengthX} - ${this._jumpStrengthY}`);
            }
        }

        if (this._dev) {
            if (ev.key == 'ArrowLeft' || ev.key == "ArrowDown" || ev.key == 'ArrowRight' || ev.key == "ArrowUp") {
                this._ignoreCollision = false;
            }

            if (ev.key == 'g') {
                this._ignoreGravity = false;
            }

        }
    }

    private ApproximateJumpStrength(baseJumpStrength: number) {
        if (baseJumpStrength < Figure.SmallJumpStrength) {
            return baseJumpStrength;
        }
        else if ((baseJumpStrength < Figure.SmallJumpStrength + (Figure.MediumJumpStrength - Figure.SmallJumpStrength) / 2)) {
            return Figure.SmallJumpStrength;
        } else if (baseJumpStrength < Figure.FullJumpStrength) {
            return Figure.MediumJumpStrength;
        } else {
            return Figure.FullJumpStrength;
        }
    }

    render(context: CanvasRenderingContext2D): void {
        const jumpStrength = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
        const isLoadingJump = jumpStrength > Figure.SmallJumpStrength && !this._isJumping;
        const isLoadingFullJump = isLoadingJump && jumpStrength > Figure.MediumJumpStrength;
        this._animation.renderNextFrame(context, {
            isLoadingJump, 
            isLoadingFullJump, 
            jumpDirection: this._direction,
            x: Math.round(this.x), 
            y: Math.round(this.y), 
            width: this.width, 
            height: this.height
        });
    }

    state: GameElementState = GameElementState.Active;

    private _calculationTimeStamp = 0;
    private _jumpTime = 0;
    private _timeSinceLastCalculation = 0;
    private _calculationSpeed = 1;
    calculateNextFrame(): void {
        const nowTimeStamp = Date.now();
        const timeLastCalculation = this.calculateJumpTime(this._calculationTimeStamp);
        this._jumpTime = this.calculateJumpTime(nowTimeStamp);
        this._timeSinceLastCalculation = this._jumpTime - timeLastCalculation;
        if ((this._timeSinceLastCalculation) > 20 * this._calculationSpeed) {
            this._jumpTime = timeLastCalculation + 20 * this._calculationSpeed;
            this._jumpStartTime += (this._timeSinceLastCalculation - 20 * this._calculationSpeed);
        }


        this._calculationTimeStamp = nowTimeStamp;

        if (this._isJumping) {
            this._speedY = this.calculateSpeedYNew(timeLastCalculation, this._jumpTime);
            this._speedX = this.calculateSpeedXNew(timeLastCalculation, this._jumpTime);

            this._x += this._speedX;
            this._y += this._speedY;

            if (this._speedY > Figure.MaxFallSpeed) {
                this._calculationSpeed = Figure.MaxFallSpeed / this._speedY;
            } else if (this._speedY > 0 && this._calculationSpeed >= 1 && this._jumpStrengthX != Figure.SmallJumpStrength) {
                this._calculationSpeed = (this._jumpStrengthX / 1.25) / this._jumpStrengthX;
                this._jumpStrengthX = this._jumpStrengthX / 1.25;
            }
        } else if (!this._isDoubleJumping && !this._ignoreGravity) {
            this._speedY = Figure.MaxFallSpeed;
            this._y += this._speedY;
        }
    }

    private calculateJumpTime(calculationTimeStamp: number) {
        return calculationTimeStamp - this._jumpStartTime;
    }

    private calculateSpeedXNew(jumpTimeLastCalculation: number, jumpTime: number) {
        const width = this.calculateWidthLinear(jumpTime);
        const lastWidth = this.calculateWidthLinear(jumpTimeLastCalculation);
        return (width - lastWidth) * this._direction;
    }

    private calculateWidthLinear(jumpTime: number) {
        return this._footSpeed * jumpTime;
    }

    private calculateSpeedYNew(jumpTimeLastCalculation: number, jumpTime: number): number {
        let height = 0;
        let lastHeight = 0;
        height = this.calculateHeightQudratic(jumpTime);
        lastHeight = this.calculateHeightQudratic(jumpTimeLastCalculation);
        return -(height - lastHeight);
    }

    private calculateHeightQudratic(jumpTime: number) {
        let gravityModifier = 1;
        if (jumpTime > this._jumpLength) {
            gravityModifier = 1;
        }

        return (0.5 * this.gravity * gravityModifier * Math.pow(jumpTime, 2) + this.initialVelocity * jumpTime);
    }

    private endJump() {
        this._isJumping = false;
        this._isDoubleJumping = false;
        this._jumpStrengthY = 0;
        this._jumpStrengthX = 0;
        this._jumpStartTime = 0;
        this._direction = 0;
        this._speedY = 0;
        this._speedX = 0;
        this._calculationSpeed = 1;
    }

    goToSavePoint(savePoint: SavePoint) {
        this.endJump();
        this._x = savePoint.x;
        this._y = savePoint.y - this._height;
    }

    fixCollision(collision: CollisionV2): void {
        if (this._ignoreCollision || collision.type == CollisionType.Ignore) {
            return;
        }

        this._x = collision.contactX;
        this._y = collision.contactY;
        if (this._isJumping && collision.timeOfContact) {
            this._calculationTimeStamp -= this._timeSinceLastCalculation - this._timeSinceLastCalculation * collision.timeOfContact;
        }

        if (collision.type == CollisionType.Horizontal) {
            if (this._speedY > 0 && this._isJumping) {
                this.endJump();
                this._animation.stop();
            } else if (this._speedY < 0) {
                const nowTimeStamp = this._calculationTimeStamp;
                const jumpedTime = nowTimeStamp - this._jumpStartTime;
                if (jumpedTime < this._jumpLength) {
                    this._jumpStartTime -= (this._jumpLength - jumpedTime);
                    const lastCalculationTimeStamp = this._calculationTimeStamp - this._timeSinceLastCalculation * collision.timeOfContact;
                    const lastCalculationJumpTime = this.calculateJumpTime(lastCalculationTimeStamp);
                    this._jumpTime = this.calculateJumpTime(this._calculationTimeStamp);
                    this._speedY = this.calculateSpeedYNew(lastCalculationJumpTime, this._jumpTime);
                    this._speedX = this.calculateSpeedXNew(lastCalculationJumpTime, this._jumpTime);
                    if (this._speedY > 0 && this._calculationSpeed >= 1 && this._jumpStrengthX != Figure.SmallJumpStrength) {
                        this._calculationSpeed = (this._jumpStrengthX / 1.25) / this._jumpStrengthX;
                        this._jumpStrengthX = this._jumpStrengthX / 1.25;

                    }
                }
            }
        } else if (this._speedX > 0) {
            if (this._direction != 0) {
                this._direction = -1;
                this._speedX = -this._speedX;
            }
        }
        else if (this._speedX < 0) {
            if (this._direction != 0) {
                this._direction = 1;
                this._speedX = -this._speedX;
            }
        }
    }

    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number): boolean {
        return super.shouldRender(renderAreaXStart - this._width, renderAreaYStart + this._height, renderAreaXEnd, renderAreaYEnd);
    }
}