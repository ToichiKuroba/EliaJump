import { RenderElement } from "../elements/renderElement";

export abstract class CollisionElement extends RenderElement {
    protected abstract _width: number;
    protected abstract _height: number;

    get height() {
        return this._height;
    }

    get minX() {
        return this._x;
    }

    get minY() {
        return this._y;
    }

    get maxX() {
        return this._x + this._width;
    }

    get maxY() {
        return this._y + this._height;
    }

    detectCollision(collisionElement: CollisionElement) : boolean
    {
        const minXIsLeft = this.minX <= collisionElement.minX;
        const minXIsOutside = minXIsLeft || this.minX >= collisionElement.maxX;
        const maxXIsLeft = this.maxX <= collisionElement.minX;
        const maxXIsOutside = maxXIsLeft || (this.maxX >= collisionElement.maxX);
        const minYIsAbove = this.minY <= collisionElement.minY;
        const minYIsOutside = minYIsAbove || this.minY >= collisionElement.maxY;
        const maxYIsAbove =  this.maxY <= collisionElement.minY;
        const maxYIsOutside = maxYIsAbove || this.maxY >= collisionElement.maxY;
        const xOnSameSide = minXIsLeft == maxXIsLeft;
        const yOnSameSide = minYIsAbove == maxYIsAbove;

        if(((minXIsOutside && maxXIsOutside && xOnSameSide) || (minYIsOutside && maxYIsOutside && yOnSameSide))) {
            return false;
        }

        return true;
    }
} 