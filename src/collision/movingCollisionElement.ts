import { CollisionV2 } from "./collision";
import { CollisionElement } from "./collisionElement";
import { CollisionType } from "./collisionType";

export abstract class MovingCollisionElement extends CollisionElement {
    protected abstract _speedX: number;
    protected abstract _speedY: number;

    get speedY() {
        return this._speedY;
    }

    protected get _prevMinX() {
        return this.minX - this._speedX;
    }
    protected get _prevMinY() {
        return this.minY - this._speedY;
    }
    protected get _prevMaxX() {
        return this.maxX - this._speedX;
    }
    protected get _prevMaxY() {
        return this.maxY - this._speedY;
    }

    private calculateCollidingYPixels(element: CollisionElement) {
        if(this._speedY == 0) {
            return 0;
        }
        const yReference = this._speedY < 0 ? element.maxY : element.minY;
        const yLine = this._speedY > 0 ? this.maxY : this.minY;
        return yReference - yLine;
    }

    private calculateCollidingXPixels(element: CollisionElement) {
        if(this._speedX == 0) {
            return 0;
        }
        const xReference = this._speedX < 0 ? element.maxX : element.minX;
        const xLine = this._speedX > 0 ? this.maxX : this.minX;
        return xReference - xLine;
    }


    private findContactY(element: CollisionElement) {        
        const toMinY = element.minY - this.maxY;
        const toMaxY = element.maxY - this.minY;
        if(toMinY < 0 == toMaxY < 0) {
            return 0;
        }

        if(Math.abs(toMinY) > toMaxY * 2) {
            return toMaxY;
        }

        return toMinY;
    }

    private findContactX(element: CollisionElement) {
        const toMinX = element.minX - this.maxX;
        const toMaxX = element.maxX - this.minX;
        if(toMinX < 0 == toMaxX < 0) {
            return 0;
        }

        if(Math.abs(toMinX) > toMaxX) {
            return toMaxX;
        }

        return toMinX;
    }

    calculateCollision(element: CollisionElement): CollisionV2 {
        let collisionType: CollisionType; 
        let collidingYPixels = 0;
        let collidingXPixels = 0;

        if(this._speedX == 0 && this._speedY == 0) {
            const distanceToContactY = this.findContactY(element);
            const distanceToContactX = this.findContactX(element);
            let contactY = this._y;
            let contactX = this._x;

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

        if(this._speedX == 0 || 
            (this._prevMinX > element.minX && this._prevMaxX < element.maxX && 
            this.minX > element.minX && this.maxX < element.maxX)) {
            collisionType = CollisionType.Horizontal;
            collidingYPixels = this.calculateCollidingYPixels(element);
        } else if(this._speedY == 0 || (this._prevMinY > element.minY && this._prevMaxY < element.maxY && 
                this.minX > element.minY && this.maxY < element.maxY)){
            collisionType = CollisionType.Verticle;
            collidingXPixels = this.calculateCollidingXPixels(element);
        }
        else if(this._speedY != 0 && this._speedX != 0) {
            collidingYPixels = this.calculateCollidingYPixels(element);
            collidingXPixels = this.calculateCollidingXPixels(element);
            if (collidingYPixels / this._speedY > collidingXPixels / this._speedX ) {
                collisionType = CollisionType.Horizontal;
            } else if (collidingYPixels / this._speedY < collidingXPixels / this._speedX) {
                collisionType = CollisionType.Verticle;
            }
            else {
                //Here goes juice special logic for the perfect corner.
                collisionType = CollisionType.Verticle;
                if (this._speedY > 0) {
                    collisionType = CollisionType.Horizontal;
                }
            }
        }else {
            collisionType = CollisionType.Verticle;
        }

        let contactY;
        let contactX;
        let timeOfContact;
        if (collisionType == CollisionType.Horizontal) {
            let pixelsYToContactPoint = collidingYPixels;

            timeOfContact = 0;

            if (this._speedY != 0) {
                timeOfContact = Math.abs(collidingYPixels / this._speedY);
            }

            let pixelsXToContactPoint = this._speedX * timeOfContact;

            contactY = this._y + pixelsYToContactPoint;
            contactX = this._x + pixelsXToContactPoint;
        } else {
            let pixelsXToContactPoint = collidingXPixels;

            timeOfContact = 0;

            if (this._speedX != 0) {
                timeOfContact = Math.abs(collidingXPixels / this._speedX);
            }
            let pixelsYToContactPoint = this._speedY * timeOfContact;

            contactY = this._y + pixelsYToContactPoint;
            contactX = this._x + pixelsXToContactPoint;
        }

        return {
            contactX,
            contactY,
            timeOfContact,
            type: collisionType
        }
    }

    abstract fixCollision(collision: CollisionV2): void
}