import { FigureAnimation } from "./animation/figureAnimation";
import { CollisionV2 } from "./collision/collision";
import { CollisionType } from "./collision/collisionType";
import { MovingCollisionElement } from "./collision/movingCollisionElement";
import { DefaultGameElement } from "./elements/gameElement";
import { GameElementEvent } from "./elements/gameElementEventMap";
import { GameElementState } from "./elements/gameElementState";
import { RenderArea } from "./elements/renderArea";
import { RenderElement } from "./elements/renderElement";
import { RenderPrio } from "./elements/renderPrio";
import { RenderData } from "./render/renderData";
import { SavePoint } from "./savePoint";
import { RunHandler } from "./time/runHandler";
import { FocusElement } from "./util/focusElement";
import { Timer } from "./util/timer";

export class Figure extends DefaultGameElement implements FocusElement, MovingCollisionElement, RenderElement {
    private _animation: FigureAnimation;
    private _initialX: number;
    private _prevRenderData: RenderData | undefined;
    private _runHandler: RunHandler | undefined;
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
    private _initialY: number;
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
    static MaxFallSpeed: number = 10;
    private _ignoreGravity: boolean = false;
    private get _footSpeed() {
        return (Figure.MaxFootSpeed / 100) * this._jumpStrengthY;
    };
    private _isJumping = false;
    private _isDoubleJumping = false;
    private _direction = 0;
    private _ignoreCollision = false;
    constructor(x: number, y: number, figureAnimation: FigureAnimation, runHandler?: RunHandler) {
        super();
        this._animation = figureAnimation;
        this._x = x;
        this._y = y;
        this._initialY = y;
        this._initialX = x;
        this._runHandler = runHandler;
    }
    get prevRenderData(): RenderData | undefined {
        return this._prevRenderData;
    }
    pause() {
        this.endMove();
        this.endJump();
        this.state = GameElementState.Inactive;
        this.dispatchEvent(new GameElementEvent<"PauseListeners">("PauseListeners", this));
    }    
    resume() {
        this.state = GameElementState.Active;
        this.dispatchEvent(new GameElementEvent<"ResumeListeners">("ResumeListeners", this));
    }
    shouldRender(renderArea: RenderArea) {    
        let should = this.state == GameElementState.Active && this.x >= renderArea.xStart - this.width && this.x <= renderArea.xEnd && this.y >= renderArea.yStart + this.height && this.y <= renderArea.yEnd;
        return should;
    }
    get x(): number {
        return this._x;
    }
    get y(): number {
        return this._y;
    }
    handleResize(heightChange: number): void {
        this._y += heightChange;
    }
    get renderData(): RenderData | undefined {
        const jumpStrength = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
        const isLoadingJump = jumpStrength > Figure.SmallJumpStrength && !this._isJumping;
        const isLoadingFullJump = isLoadingJump && jumpStrength > Figure.MediumJumpStrength;
        this._prevRenderData = this._animation.renderNextFrame({
            isLoadingJump,
            isLoadingFullJump,
            jumpDirection: this._direction,
            x: Math.round(this.x),
            y: Math.round(this.y),
            width: this.width,
            height: this.height,
            prevRenderData: this.prevRenderData
        });
        return this._prevRenderData;
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

    startJumpLoad(direction: "left" | "up" | "right") {
        if (!this._spaceTimer.isRunning) {
            this._runHandler?.start();
            if (!this._isJumping) {
                this.setDirection(direction);
                this._spaceTimer.Start();
            } else if (!this._isDoubleJumping) {
                this.endJump();
                this.setDirection(direction);
                this._isDoubleJumping = true;
                this._spaceTimer.Start();
            }
        }
    }

    setDirection(direction: "left" | "up" | "right") {
        switch(direction) {
            case "left":
                this._direction = -1;
                break;

            case "right":
                this._direction = 1;
                break;
            
            default: 
                this._direction = 0;
                break;
        }
    }


    move(direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", sprint: boolean, sneak: boolean) {
        this._ignoreCollision = true;
        this._ignoreGravity = true;
        this.endJump();
        const devSpeed = sprint ? 100 : sneak ? 1 : 10;
        switch (direction) {
            case "ArrowLeft":
                this._x -= devSpeed;
                break;
            case "ArrowRight":
                this._x += devSpeed;
                break;
            case "ArrowUp":
                this._y -= devSpeed;
                break;
            case "ArrowDown":
                this._y += devSpeed;
                break;
            default:
                break;
        }
    }

    endMove() {
        this._ignoreCollision = false;
    }

    toggleGravity() {
        this._ignoreGravity = !this._ignoreGravity;
    }

    endJumpLoad() {
        if (this._spaceTimer.isRunning && !this._isJumping) {
            document.querySelector<HTMLAudioElement>("#jump")?.play();
            this._animation.start();
            this._spaceTimer.Stop();
            this._jumpStartTime = Date.now();
            this._isJumping = true;
            this._jumpStrengthY = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
            this._jumpStrengthX = this.ApproximateJumpStrength(100 * (this._spaceTimer.millseconds / Figure.FullJumpLoadTime));
            this._spaceTimer.Reset();
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

    goToStartPosition() {
        this._x = this._initialX;
        this._y = this._initialY;
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
}