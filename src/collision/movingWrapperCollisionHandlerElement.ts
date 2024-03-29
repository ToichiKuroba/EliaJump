
import { CollisionType } from "./collisionType";
import { WrapperCollisionHandlerElement } from "./wrapperCollisionHandlerElement";
import { AxisLine } from "./axisLine";
import { CollisionV2 } from "./collision";
import { CollisionHandlerElement } from "./collisionHandlerElement";
import { GameElementState } from "../elements/gameElementState";
import { MovingCollisionElement } from "./movingCollisionElement";

export function isMovingWrapperCollisionHandlerElement(collisionElement: CollisionHandlerElement): collisionElement is MovingWrapperCollisionHandlerElement {
    return (collisionElement instanceof MovingWrapperCollisionHandlerElement) ? collisionElement.state == GameElementState.Active : false
}

export class MovingWrapperCollisionHandlerElement extends WrapperCollisionHandlerElement<MovingCollisionElement> {  
    get state() {
        return this._element.state;
    }

    protected get _prevXAxisLine() : AxisLine {
        return new AxisLine(this.xAxisLine.minPoint - this._element.speedX, this.xAxisLine.maxPoint - this._element.speedX);
    }

    protected get _prevYAxisLine() : AxisLine {
        return new AxisLine(this.yAxisLine.minPoint - this._element.speedY, this.yAxisLine.maxPoint - this._element.speedY);
    }

    private calculateCollidingPixels(speed: number, axisLine: AxisLine, referenceAxisLine: AxisLine) {
        if(speed == 0) {
            return 0;
        }

        const referencePoint = speed < 0 ? referenceAxisLine.maxPoint : referenceAxisLine.minPoint;
        const point = speed > 0 ? axisLine.maxPoint : axisLine.minPoint;
        return referencePoint - point;
    }

    private findContactY(element: CollisionHandlerElement) {        
        const toMinY = element.yAxisLine.minPoint - this.yAxisLine.maxPoint;
        const toMaxY = element.yAxisLine.maxPoint - this.yAxisLine.minPoint;
        if(toMinY < 0 == toMaxY < 0) {
            return 0;
        }

        if(Math.abs(toMinY) > toMaxY * 2) {
            return toMaxY;
        }

        return toMinY;
    }

    private findContactX(element: CollisionHandlerElement) {
        const toMinX = element.xAxisLine.minPoint - this.xAxisLine.maxPoint;
        const toMaxX = element.xAxisLine.maxPoint - this.xAxisLine.minPoint;
        if(toMinX < 0 == toMaxX < 0) {
            return 0;
        }

        if(Math.abs(toMinX) > toMaxX) {
            return toMaxX;
        }

        return toMinX;
    }

    calculateCollision(element: CollisionHandlerElement) : CollisionV2{
        const [speedX, speedY] = isMovingWrapperCollisionHandlerElement(element) ? this.calculateRelativeSpeed(element) : [this._element.speedX, this._element.speedY];
        if(speedX == 0 && speedY == 0) {
            return this.calculateStuckCollision(element);
        }

        const [collisionType, collidingXPixels, collidingYPixels] = this.calculateCollisionType(speedX, speedY, element);
        let contactX = 0; 
        let contactY = 0;
        let timeOfContact = 0;
        if(this._element.wantsTofixCollision && (!isMovingWrapperCollisionHandlerElement(element) || !element._element.wantsTofixCollision)) {
            [contactX, contactY, timeOfContact] = this.calculateContactPoint(speedX, speedY, collisionType, collidingXPixels, collidingYPixels);
        }
        else if(!this._element.wantsTofixCollision && isMovingWrapperCollisionHandlerElement(element) && element._element.wantsTofixCollision){
            return {
                contactX : this._element.x,
                contactY : this._element.y,
                timeOfContact : 0,
                type: CollisionType.Ignore
            }
        }
        else {
            [contactX, contactY, timeOfContact] = this.calculateContactPoint(speedX, speedY, collisionType, collidingXPixels, collidingYPixels);
        }

        return {
            contactX,
            contactY,
            timeOfContact,
            type: collisionType
        }
    }

    calculateStuckCollision(element: CollisionHandlerElement) {
            const distanceToContactY = this.findContactY(element);
            const distanceToContactX = this.findContactX(element);
            let contactY = this._element.y;
            let contactX = this._element.x;
            let collisionType: CollisionType;
            if(Math.abs(distanceToContactY) < Math.abs(distanceToContactX) || (distanceToContactY < 0 && Math.abs(distanceToContactY) < Math.abs(distanceToContactX) * 2)) {
                contactY += distanceToContactY;
                collisionType = CollisionType.Horizontal;
                
            }else {
                contactX += distanceToContactX;
                collisionType = CollisionType.Verticle
            }

            return {
                contactY,
                contactX,
                type : collisionType,
                timeOfContact: 0,
            }
    }

    calculateContactPointEqualFix(speedX : number, speedY : number,collisionType: CollisionType, collidingXPixels: number, collidingYPixels: number) : [contactX: number, contactY: number, timeOfContact: number] {
        let timeOfContact = 0;
        if (collisionType == CollisionType.Horizontal) {
            timeOfContact = this.calculateTimeOfContact(speedY, collidingYPixels);
        }else {
            timeOfContact = this.calculateTimeOfContact(speedX, collidingXPixels);
        }
        
        let pixelsXToContactPoint = this._element.speedX * timeOfContact;
        let pixelsYToContactPoint = this._element.speedY * timeOfContact;
        const contactX = this._element.x + pixelsXToContactPoint;
        const contactY = this._element.y + pixelsYToContactPoint;
        
        return [contactX, contactY, timeOfContact];
    }

    calculateContactPoint(speedX : number, speedY : number,collisionType: CollisionType, collidingXPixels: number, collidingYPixels: number) : [contactX: number, contactY: number, timeOfContact: number] {
        let timeOfContact;
        let pixelsXToContactPoint;
        let pixelsYToContactPoint;
        if (collisionType == CollisionType.Horizontal) {
            [pixelsYToContactPoint, pixelsXToContactPoint, timeOfContact] = this.calculateDistanceToContactPoint(speedY, speedX, collidingYPixels);
        } else {
            [pixelsXToContactPoint, pixelsYToContactPoint, timeOfContact] = this.calculateDistanceToContactPoint(speedX, speedY, collidingXPixels);
        }

        const contactX = this._element.x + pixelsXToContactPoint;
        const contactY = this._element.y + pixelsYToContactPoint;
        
        return [contactX, contactY, timeOfContact];
    }

    calculateTimeOfContact(speed: number, collidingPixels: number) {
        if (speed == 0) {
            return 0;
        }

        return Math.abs(collidingPixels / speed);
    }

    calculateDistanceToContactPoint(speedMainAxis : number, speedSecondaryAxis : number, collidingPixelsMainAxis : number): [distanceToContactPointMainAxis: number, distanceToContactPointSecondaryAxis: number, timeOfContact: number]{
        
        let distanceToContactPointMainAxis = collidingPixelsMainAxis;
            
        let timeOfContact = this.calculateTimeOfContact(speedMainAxis, collidingPixelsMainAxis);

        let distanceToContactPointSecondaryAxis = speedSecondaryAxis * timeOfContact;

        return [distanceToContactPointMainAxis, distanceToContactPointSecondaryAxis, timeOfContact];
    }

    calculateCollisionType(speedX : number, speedY : number, element: CollisionHandlerElement) : [collisionType: CollisionType, collidingXPixels: number, collidingYPixels: number ] {
        const [prevXAxisLine, prevYAxisLine] = isMovingWrapperCollisionHandlerElement(element) ? 
                                                    [element._prevXAxisLine, element._prevYAxisLine] 
                                                    : [element.xAxisLine,  element.yAxisLine];

        let collisionType: CollisionType; 
        let collidingYPixels = 0;
        let collidingXPixels = 0;
        if(speedX == 0 || 
            (this._prevXAxisLine.isFullyInside(prevXAxisLine) && 
            this.xAxisLine.isFullyInside(element.xAxisLine))) {
            collisionType = CollisionType.Horizontal;
            collidingYPixels = this.calculateCollidingPixels(speedY, this.yAxisLine, element.yAxisLine);
        } else if(speedY == 0 || (this._prevYAxisLine.isFullyInside(prevYAxisLine) && 
                                        this.yAxisLine.isFullyInside(element.yAxisLine))){
            collisionType = CollisionType.Verticle;
            collidingXPixels = this.calculateCollidingPixels(speedX, this.xAxisLine, element.xAxisLine);
        }
        else if(speedY != 0 && speedX != 0) {
            collidingYPixels = this.calculateCollidingPixels(speedY, this.yAxisLine, element.yAxisLine);
            collidingXPixels = this.calculateCollidingPixels(speedX, this.xAxisLine, element.xAxisLine);
            if (collidingYPixels / speedY > collidingXPixels / speedX ) {
                collisionType = CollisionType.Horizontal;
            } else if (collidingYPixels / speedY < collidingXPixels / speedX) {
                collisionType = CollisionType.Verticle;
            }
            else {
                //Here goes juice special logic for the perfect corner.
                collisionType = CollisionType.Verticle;
                if (speedY > 0) {
                }
            }
        }else {
            collisionType = CollisionType.Verticle;
        }

        return [collisionType, collidingXPixels, collidingYPixels];
    }

    calculateRelativeSpeed(element: MovingWrapperCollisionHandlerElement) : [speedX: number, speedY: number] {
        return [
            this._element.speedX - element._element.speedX,
            this._element.speedY - element._element.speedY
        ];
    }

    fixCollision(collisionHandlerElement: CollisionHandlerElement) {
        const collision = this.calculateCollision(collisionHandlerElement);
        this._element.fixCollision(collision);
    }
}